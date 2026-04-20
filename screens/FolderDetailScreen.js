import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCollectionStore } from "../store/useCollectionStore";
import { useFolderActions } from "../hooks/useFolderActions";

import { CategoryPage } from "../components/shared/CategoryPage";
import { FolderHeader } from "../components/screens/Main/Folder/FolderHeader";
import { AddItemsToFolderModal } from "../components/screens/Main/Folder/AddItemsToFolderModal";
import DeleteFolderModal from "../components/screens/Main/Folder/DeleteFolderModal";
import StatusModal from "../components/shared/StatusModal";

export default function FolderDetailScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { folderId } = route.params;

    // --- STORE ---
    const { myCollection, addItemsToFolder, updateFolderOrder, updateCard } =
        useCollectionStore();

    // --- STATE ---
    const [sortType, setSortType] = useState("newest");
    const [isReordering, setIsReordering] = useState(false);
    const [reorderBuffer, setReorderBuffer] = useState([]);

    // UI Visibility
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);

    // --- DATA MEMO ---
    const folder = useMemo(
        () => myCollection.find((item) => item.id === folderId),
        [myCollection, folderId],
    );

    const folderItems = useMemo(
        () =>
            myCollection.filter((item) =>
                item.parentFolderIds?.includes(folderId),
            ),
        [myCollection, folderId],
    );

    const availableItems = useMemo(() => {
        if (!folder) return [];
        return myCollection.filter(
            (item) =>
                !item.isFolder &&
                item.appSection === folder.appSection &&
                !item.parentFolderIds?.includes(folderId),
        );
    }, [myCollection, folder, folderId]);

    // --- CUSTOM HOOKS ---
    const {
        isEditing,
        setIsEditing,
        editForm,
        updateField,
        pickImage,
        handleSave, // Это наш обновленный метод
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
    const onConfirmDeleteAll = () => {
        deleteEverything();
        navigation.goBack();
    };

    const onConfirmDeleteOnlyFolder = () => {
        deleteFolderOnly();
        navigation.goBack();
    };

    const handleCardPress = (item) => {
        if (isReordering) {
            setReorderBuffer((prev) => {
                if (prev.includes(item.id)) {
                    return prev.filter((id) => id !== item.id);
                }
                return [...prev, item.id];
            });
            return;
        }

        if (item.isFolder) {
            navigation.navigate("FolderDetail", {
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

    // Внутри FolderDetailScreen или вашего хука действий
    const handleToggleReorder = () => {
        if (isReordering) {
            // Мы нажимаем "Применить порядок" (завершаем сортировку)
            // 1. Сохраняем накопленный reorderBuffer в стор
            handleSave(true, reorderBuffer);

            // 2. Выключаем режим
            setIsReordering(false);
        } else {
            // Мы только входим в режим сортировки
            setIsReordering(true);
        }
    };

    const handleStatusUpdate = (newStatus) => {
        // В сторе папка — это такая же карточка, поэтому используем updateCard
        updateCard(folder.id, { status: newStatus });
        setStatusModalVisible(false);
    };

    if (!folder) return null;

    return (
        <View style={styles.container}>
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
                reorderBuffer={reorderBuffer}
                ListHeaderComponent={
                    <FolderHeader
                        folder={folder}
                        folderItems={folderItems}
                        editForm={editForm}
                        displayImage={isEditing ? editForm.image : folder.image}
                        insets={insets}
                        isEditing={isEditing}
                        isReordering={isReordering}
                        setIsEditing={setIsEditing}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onBack={() => navigation.goBack()}
                        pickImage={pickImage}
                        updateField={updateField}
                        onDeletePress={() => setIsDeleteModalVisible(true)}
                        onToggleReorder={handleToggleReorder}
                        onStatusPress={() => setStatusModalVisible(true)}
                        onAddPress={() => setIsAddModalVisible(true)}
                    />
                }
            />

            {/* MODALS */}
            <StatusModal
                visible={isStatusModalVisible}
                category={folder.appSection} // "Книги", "Игры" или "Фильмы"
                currentStatus={folder.status}
                onClose={() => setStatusModalVisible(false)}
                onSelect={handleStatusUpdate}
                // removeCard здесь не нужен, так как удаление папки обычно в редактировании
            />

            <AddItemsToFolderModal
                visible={isAddModalVisible}
                availableItems={availableItems}
                onClose={() => setIsAddModalVisible(false)}
                onAdd={(ids) => addItemsToFolder(ids, folderId)}
            />

            <DeleteFolderModal
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onDeleteAll={onConfirmDeleteAll}
                onDeleteOnlyFolder={onConfirmDeleteOnlyFolder}
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
