import React, { useMemo, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Platform,
    Vibration,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useFetchDetails } from "../hooks/useFetchDetails";
import { useDetailsData } from "../hooks/useDetailsData";
import { useEditForm } from "../hooks/useEditForm";
import { useDetailsActions } from "../hooks/useDetailsActions";
import { useCollectionStore } from "../store/useCollectionStore";

// Components
import { ContentSection } from "../components/screens/Details/ContentSection";
import { EditSection } from "../components/screens/Details/EditSection";
import { useImagePicker } from "../hooks/useImagePicker";
import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { DetailsModals } from "../components/screens/Details/Modals/DetailsModals";
import { prepareDataForSave } from "../utils/prepareDetailsData";
import { FAVORITE_STATUS } from "../constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category } = route.params;
    const { pickImage } = useImagePicker();

    // 1. Единое состояние для всех модалок
    const [modals, setModals] = useState({
        status: false,
        folder: false,
        info: false,
        createFolder: false,
    });
    const [isEditing, setIsEditing] = useState(false);

    const { data: fullDetails, loading } = useFetchDetails(item.id);
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const isVibration = useCollectionStore((state) => state.isVibration);

    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
    );

    const displayData = useDetailsData(item, fullDetails, initialSavedItem);

    const {
        savedItem,
        isInCollection,
        existingFolders,
        handleAddToFolder,
        handleStatusUpdate,
        handleToggleFavorite,
        updateCard,
        deleteCard,
    } = useDetailsActions(item, displayData, category);

    const isFavorite = !!savedItem?.isFavorite;

    const [editForm, updateField] = useEditForm(isEditing, {
        ...displayData,
        status: displayData.status || savedItem?.status || "",
    });

    // Вспомогательные переменные для верстки
    const parentFolders = useMemo(() => {
        const ids = savedItem?.parentFolderIds || [];
        return myCollection.filter((f) => ids.includes(f.id));
    }, [savedItem?.parentFolderIds, myCollection]);

    const folderLabel = useMemo(() => {
        if (parentFolders.length === 0) return "Добавить в папку";
        if (parentFolders.length === 1) return parentFolders[0].title;
        return `В папках: ${parentFolders.length}`;
    }, [parentFolders]);

    const isAnyFolderSelected = parentFolders.length > 0;
    const cardType = item.type || savedItem?.type || category;

    // Обертка для сохранения, которую мы передаем в Header и EditSection
    const onSaveAction = () => {
        // Вызываем утилиту для сборки объекта
        const finalData = prepareDataForSave(editForm, cardType);
        updateCard(item.id, finalData);
        setIsEditing(false);
    };

    const handleScoreWithHaptics = (score) => {
        // 1. Сохраняем оценку в стор
        setUserScore(item.id, score);

        if (isVibration && score !== 0) {
            // 2. Логика вибрации
            if (Platform.OS === "android") {
                // Создаем паттерн: [пауза, удар, пауза, удар...]
                const pattern = [0, 0];
                for (let i = 0; i < score; i++) {
                    pattern.push(30); // Пауза перед следующим ударом
                    pattern.push(100); // Длительность вибрации
                }
                Vibration.vibrate(pattern);
            } else {
                // На iOS для оценок хорошо подходит Success или Medium
                // Но если хочешь именно по количеству звезд:
                Vibration.vibrate(10);
            }
        }
    };

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            bounces={false}
            extraScrollHeight={200}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
            <HeaderSection
                isEditing={isEditing}
                image={editForm.image || item.image}
                insets={insets}
                onLeftPress={
                    isEditing
                        ? () => setIsEditing(false)
                        : () => navigation.goBack()
                }
                onRightPress={
                    isEditing ? onSaveAction : () => setIsEditing(true)
                }
                onPickImage={async () => {
                    const uri = await pickImage([240, 340]);
                    if (uri) updateField("image", uri);
                }}
                showEditButton={item?.isCustom || savedItem?.isCustom}
            />

            <View style={styles.infoContainer}>
                {loading && !fullDetails && !savedItem ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#7D8AFF" />
                    </View>
                ) : isEditing ? (
                    <EditSection
                        form={editForm}
                        updateField={updateField}
                        type={cardType}
                        onSave={onSaveAction} // Использовать onSaveAction вместо handleSave
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <ContentSection
                        displayData={displayData}
                        savedItem={savedItem}
                        isInCollection={isInCollection}
                        isFavorite={isFavorite}
                        folderLabel={folderLabel}
                        isAnyFolderSelected={isAnyFolderSelected}
                        // Исправленные обработчики модалок:
                        onStatusPress={() =>
                            setModals((prev) => ({ ...prev, status: true }))
                        }
                        onFolderPress={() =>
                            setModals((prev) => ({ ...prev, folder: true }))
                        }
                        onInfoPress={() =>
                            setModals((prev) => ({ ...prev, info: true }))
                        }
                        onToggleFavorite={handleToggleFavorite}
                        onUpdateNotes={(text) =>
                            updateCard(item.id, { userNotes: text })
                        }
                        onSetScore={handleScoreWithHaptics}
                    />
                )}
            </View>

            <DetailsModals
                state={{
                    isStatusVisible: modals.status,
                    isFolderVisible: modals.folder,
                    isInfoVisible: modals.info,
                    isCreateFolderVisible: modals.createFolder,
                }}
                actions={{
                    closeStatus: () =>
                        setModals((prev) => ({ ...prev, status: false })),
                    closeFolder: () =>
                        setModals((prev) => ({ ...prev, folder: false })),
                    closeInfo: () =>
                        setModals((prev) => ({ ...prev, info: false })),
                    openCreateFolder: () =>
                        setModals((prev) => ({
                            ...prev,
                            folder: false,
                            createFolder: true,
                        })),
                    closeCreateFolder: () =>
                        setModals((prev) => ({ ...prev, createFolder: false })),
                }}
                data={{
                    category,
                    existingFolders,
                    parentFolderIds: savedItem?.parentFolderIds || [],
                    currentStatus: savedItem?.status,
                }}
                handlers={{
                    handleAddToFolder,
                    handleStatusUpdate,
                    handleCreateFolder: (name) => {
                        createFolder(name, category, FAVORITE_STATUS, []);
                        setModals((prev) => ({ ...prev, createFolder: false }));
                    },
                    handleDelete: () => {
                        deleteCard(item.id);
                        navigation.goBack();
                    },
                }}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
    },
    infoContainer: {
        padding: 20,
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
    loaderContainer: {
        paddingVertical: 50,
        alignItems: "center",
    },
});
