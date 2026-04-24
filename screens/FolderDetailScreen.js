import React, { useState } from "react";
import { View, StyleSheet, Platform, Vibration, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionStore } from "../store/useCollectionStore";

import { useFolderData } from "../hooks/useFolderData";
import { useFolderActions } from "../hooks/useFolderActions";

import { CategoryPage } from "../components/shared/CategoryPage";
import { FolderHeader } from "../components/screens/Main/Folder/FolderHeader";
import StatusModal from "../components/shared/StatusModal";
import { AddItemsToFolderModal } from "../components/screens/Main/Folder/AddItemsToFolderModal";
import DeleteFolderModal from "../components/screens/Main/Folder/DeleteFolderModal";
import { WarnModal } from "../components/ui/WarnModal";

export default function FolderDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { folderId } = route.params;
    const addItemsToFolder = useCollectionStore(
        (state) => state.addItemsToFolder,
    );
    const updateCard = useCollectionStore((state) => state.updateCard);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const setFavorite = useCollectionStore((state) => state.setFavorite);
    const isVibration = useCollectionStore((state) => state.isVibration);

    // --- LOGIC & DATA (используем ваш хук) ---
    const { folder, folderItems, availableItems } = useFolderData(folderId);

    // --- UI STATE ---
    const [sortType, setSortType] = useState("newest");
    const [isReordering, setIsReordering] = useState(false);
    const [reorderBuffer, setReorderBuffer] = useState([]);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);

    // Группируем видимость модалок для чистоты
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
                prev.includes(item.id)
                    ? prev.filter((id) => id !== item.id)
                    : [...prev, item.id],
            );
            return;
        }

        if (isEditing) return; // Блокируем переходы при редактировании

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
            handleSave(true); // Сохраняем только порядок
        } else {
            setIsReordering(true);
        }
    };

    const handleStatusUpdate = (newStatus) => {
        updateCard(folder.id, { status: newStatus });
        setModals((p) => ({ ...p, status: false }));
    };

    const handleRatingUpdate = (newScore) => {
        // 1. Сохраняем оценку в стор
        setUserScore(folder.id, newScore);

        if (isVibration && newScore !== 0) {
            // 2. Логика вибрации
            if (Platform.OS === "android") {
                // Создаем паттерн: [пауза, удар, пауза, удар...]
                const pattern = [0, 1];
                for (let i = 0; i < newScore; i++) {
                    pattern.push(30); // Длительность вибрации
                    pattern.push(100); // Пауза перед следующим ударом
                }
                Vibration.vibrate(pattern);
            } else {
                // На iOS для оценок хорошо подходит Success или Medium
                // Но если хочешь именно по количеству звезд:
                Vibration.vibrate(10);
            }
        }
    };

    if (!folder) return null;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            // Это важно: смещение, чтобы не перекрыть инпуты
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
                        toggleFavorite={() =>
                            setFavorite(folder.id, !folder.isFavorite)
                        }
                        isEditing={isEditing}
                        isReordering={isReordering}
                        setIsEditing={setIsEditing}
                        onSave={() => handleSave(false)} // Полное сохранение
                        onCancel={handleCancel}
                        onBack={() => navigation.goBack()}
                        pickImage={pickImage}
                        updateField={updateField}
                        onRatingUpdate={handleRatingUpdate}
                        onInfoPress={() => setInfoModalVisible(true)}
                        onDeletePress={() =>
                            setModals((p) => ({ ...p, delete: true }))
                        }
                        onToggleReorder={handleToggleReorder}
                        onStatusPress={() =>
                            setModals((p) => ({ ...p, status: true }))
                        }
                        onAddPress={() =>
                            setModals((p) => ({ ...p, add: true }))
                        }
                    />
                }
            />

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
                onDeleteAll={() => {
                    deleteEverything();
                    navigation.goBack();
                }}
                onDeleteOnlyFolder={() => {
                    deleteFolderOnly();
                    navigation.goBack();
                }}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
    },
});
