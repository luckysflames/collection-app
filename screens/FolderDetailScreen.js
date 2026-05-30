import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Platform,
    Vibration,
    KeyboardAvoidingView,
    BackHandler,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionStore } from "../store/useCollectionStore";

import { useFolderData } from "../hooks/useFolderData";
import { useFolderActions } from "../hooks/useFolderActions";

import { CategoryPage } from "../components/shared/CategoryPage";
import { FolderHeader } from "../components/screens/Main/Folder/FolderHeader";
import StatusModal from "../components/shared/StatusModal";
import { SortModal } from "../components/screens/Main/Modals/SortModal";
import { AddItemsToFolderModal } from "../components/screens/Main/Folder/AddItemsToFolderModal";
import DeleteFolderModal from "../components/screens/Main/Folder/DeleteFolderModal";
import { WarnModal } from "../components/ui/WarnModal";

export default function FolderDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { folderId } = route.params;

    // --- UI & ANIMATION FLAGS ---
    const [isDeleting, setIsDeleting] = useState(false); // 1. Флаг удаления для предотвращения моргания

    const addItemsToFolder = useCollectionStore((state) => state.addItemsToFolder);
    const updateCard = useCollectionStore((state) => state.updateCard);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const setFavorite = useCollectionStore((state) => state.setFavorite);
    const isVibration = useCollectionStore((state) => state.isVibration);
    const setRaining = useCollectionStore((state) => state.setRaining);

    // --- LOGIC & DATA ---
    // 2. Если папка удаляется, передаем null во избежание реактивных ошибок рендеринга
    const { folder, folderItems, availableItems } = useFolderData(isDeleting ? null : folderId);

    // --- UI STATE ---
    const [sortType, setSortType] = useState("manual");
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);
    const [isReordering, setIsReordering] = useState(false);
    const [reorderBuffer, setReorderBuffer] = useState([]);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);

    const [modals, setModals] = useState({
        delete: false,
        add: false,
        status: false,
    });

    // --- ACTIONS HOOK ---
    const {
        isEditing,
        setIsEditing,
        editForm,
        updateField,
        pickImage,
        handleSave,
        handleCancel,
        deleteEverything,
        deleteFolderOnly,
    } = useFolderActions(
        folder,
        folderItems,
        isReordering,
        reorderBuffer,
        setIsReordering,
        setReorderBuffer,
    );

    // --- HANDLERS ---
    const handleCardPress = (item) => {
        if (isReordering) {
            setReorderBuffer((prev) =>
                prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id],
            );
            return;
        }

        if (isEditing) return;

        if (item.isFolder) {
            navigation.push("FolderDetail", {
                folderId: item.id,
                title: item.title,
            });
        } else {
            navigation.navigate("Details", {
                item,
                category: folder.appSection,
            });
        }
    };

    const handleToggleReorder = () => {
        if (isReordering) {
            handleSave(true);
        } else {
            setIsReordering(true);
        }
    };

    const handleStatusUpdate = (newStatus) => {
        updateCard(folder.id, {
            status: newStatus,
            lastStatusChangeAt: Date.now(),
        });
        setModals((p) => ({ ...p, status: false }));
    };

    const handleRatingUpdate = (newScore) => {
        setUserScore(folder.id, newScore);

        // Если оценка не 10, забираем бриллиант и выключаем дождь
        if (newScore !== 10 && isBrilliant) {
            updateCard(folder.id, { isBrilliant: false });
            setRaining(false);
        }

        if (isVibration && newScore !== 0) {
            if (Platform.OS === "android") {
                const pattern = [0, 1];
                for (let i = 0; i < newScore; i++) {
                    pattern.push(30);
                    pattern.push(100);
                }
                Vibration.vibrate(pattern);
            } else {
                Vibration.vibrate(10);
            }
        }
    };

    const isBrilliant = folder?.isBrilliant || false;
    const isPeak = folder?.userScore === 10 || isBrilliant;

    const handleToggleBrilliant = () => {
        const newIsBrilliant = !isBrilliant;
        updateCard(folder.id, { isBrilliant: newIsBrilliant });
        setRaining(newIsBrilliant);
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isEditing) {
                    handleCancel();
                    return true;
                }
                if (isReordering) {
                    setIsReordering(false);
                    setReorderBuffer([]);
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => subscription.remove();
        }, [isEditing, isReordering, handleCancel]),
    );

    // Эффект контроля эффекта "дождя"
    useEffect(() => {
        if (folder?.id && !isDeleting) {
            setRaining(folder.id, isFocused && isBrilliant);
        }
    }, [isFocused, isBrilliant, folder?.id, setRaining, isDeleting]);

    // Безопасный выход из экрана при удалении
    const safeNavigateBackAfterDelete = (deleteCallback) => {
        setIsDeleting(true); // Включаем флаг, чтобы закоммитить пустой рендер
        setModals((p) => ({ ...p, delete: false }));
        navigation.goBack(); // Сначала плавно уходим назад

        setTimeout(() => {
            deleteCallback(); // И только после этого стираем данные из Zustand
        }, 150);
    };

    if (!folder || isDeleting) return null;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
            >
                <CategoryPage
                    data={folderItems}
                    folderOrder={folder.itemsOrder}
                    category={folder.status}
                    currentSection={folder.appSection}
                    navigation={navigation}
                    isInsideFolder
                    isEditing={isEditing}
                    isReordering={isReordering}
                    reorderBuffer={reorderBuffer}
                    sortType={sortType}
                    onCardPress={handleCardPress}
                    ListHeaderComponent={
                        <FolderHeader
                            folder={folder}
                            folderItems={folderItems}
                            editForm={editForm}
                            displayImage={isEditing ? editForm.image : folder.image}
                            insets={insets}
                            toggleFavorite={() => setFavorite(folder.id, !folder.isFavorite)}
                            isEditing={isEditing}
                            isReordering={isReordering}
                            isFocused={isFocused}
                            setIsEditing={setIsEditing}
                            onSave={() => handleSave(false)}
                            onCancel={handleCancel}
                            onBack={() => navigation.goBack()}
                            pickImage={pickImage}
                            updateField={updateField}
                            onRatingUpdate={handleRatingUpdate}
                            onInfoPress={() => setInfoModalVisible(true)}
                            onDeletePress={() => setModals((p) => ({ ...p, delete: true }))}
                            onToggleReorder={handleToggleReorder}
                            onStatusPress={() => setModals((p) => ({ ...p, status: true }))}
                            onAddPress={() => setModals((p) => ({ ...p, add: true }))}
                            onSortPress={() => setIsSortModalVisible(true)}
                            isBrilliant={isBrilliant}
                            onBrilliantPress={handleToggleBrilliant}
                            showBrilliantBtn={isBrilliant}
                        />
                    }
                />
            </KeyboardAvoidingView>

            {/* MODALS */}
            <WarnModal
                visible={isInfoModalVisible}
                title="О личной оценке"
                message="Эта оценка видна только Вам. Она помогает структурировать Вашу личную коллекцию и никак не влияет на глобальный рейтинг произведения. Средний балл также высчитывается из Ваших оценок"
                type="info"
                onClose={() => setInfoModalVisible(false)}
            />
            <StatusModal
                visible={modals.status}
                category={folder.appSection}
                currentStatus={folder.status}
                onClose={() => setModals((p) => ({ ...p, status: false }))}
                onSelect={handleStatusUpdate}
            />
            <AddItemsToFolderModal
                visible={modals.add}
                availableItems={availableItems}
                onClose={() => setModals((p) => ({ ...p, add: false }))}
                onAdd={(ids) => {
                    addItemsToFolder(ids, folderId);
                    setModals((p) => ({ ...p, add: false }));
                }}
            />
            <DeleteFolderModal
                visible={modals.delete}
                isEmpty={folderItems.length === 0}
                onClose={() => setModals((p) => ({ ...p, delete: false }))}
                onDeleteAll={() => safeNavigateBackAfterDelete(deleteEverything)}
                onDeleteOnlyFolder={() => safeNavigateBackAfterDelete(deleteFolderOnly)}
            />

            <SortModal
                isVisible={isSortModalVisible}
                onClose={() => setIsSortModalVisible(false)}
                currentSort={sortType}
                onSelectSort={setSortType}
                isInsideFolder
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
    },
});
