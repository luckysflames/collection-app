import { useCollectionStore } from "../store/useCollectionStore";
import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUS_BY_SECTION,
    SECTION_MAPPING,
    FAVORITE_STATUS,
} from "../constants";
import { useState } from "react";

const getSectionKey = (section) => SECTION_MAPPING[section] || section;

export const useDetailsActions = (item, displayData, category) => {
    const { myCollection, addToCollection, updateCard, deleteCard } =
        useCollectionStore();

    const savedItem = myCollection.find(
        (fav) => String(fav.id) === String(item.id),
    );
    const isInCollection = !!savedItem;

    // Поиск подходящих папок для текущей секции (Фильмы/Аниме и т.д.)
    const currentSection = category || item.appSection || "Фильмы";

    const [isRefreshing, setIsRefreshing] = useState(false);

    const existingFolders = myCollection.filter((i) => {
        if (!i.isFolder) return false;
        const folderSection = String(i.appSection || "")
            .trim()
            .toLowerCase();
        const activeSection = String(currentSection).trim().toLowerCase();
        return folderSection === activeSection;
    });

    // Вспомогательная функция для обработки статуса перед сохранением
    const processStatus = (inputStatus) => {
        const isFavoriteStatus = inputStatus === FAVORITE_STATUS;
        return {
            finalStatus: isFavoriteStatus ? null : inputStatus,
            isFavorite: isFavoriteStatus,
        };
    };

    // Логика добавления/удаления из папки (Toggle)
    const handleAddToFolder = (folderId) => {
        if (!isInCollection) {
            const rawStatus = displayData.status || FAVORITE_STATUS;
            const { finalStatus, isFavorite } = processStatus(rawStatus);

            addToCollection({
                ...item,
                ...displayData,
                status: finalStatus,
                isFavorite: isFavorite,
                appSection: currentSection,
                parentFolderIds: [folderId],
            });
        } else {
            const currentFolders = savedItem.parentFolderIds || [];
            const newFolderIds = currentFolders.includes(folderId)
                ? currentFolders.filter((id) => id !== folderId)
                : [...currentFolders, folderId];

            updateCard(item.id, { parentFolderIds: newFolderIds });
        }
    };

    // Обновление статуса
    const handleStatusUpdate = (newStatus) => {
        if (isInCollection) {
            updateCard(item.id, { status: newStatus });
        } else {
            addToCollection({
                ...item,
                ...displayData,
                status: newStatus,
                appSection: currentSection,
                parentFolderIds: [], // Инициализируем пустым массивом
            });
        }
    };

    const handleToggleFavorite = () => {
        if (isInCollection) {
            updateCard(item.id, {
                isFavorite: !savedItem?.isFavorite,
            });
        } else {
            addToCollection({
                ...item,
                ...displayData,
                status: null,
                isFavorite: true,
                appSection: currentSection,
                parentFolderIds: [],
            });
        }
    };

    const refreshCardDetails = async (item, fetchDetailsById) => {
        if (!savedItem) return;
        setIsRefreshing(true);

        try {
            const freshDetails = await fetchDetailsById(item.id);
            updateCard(item.id, {
                ...freshDetails,
                image: savedItem.image || item.image,
                userNotes: savedItem.userNotes,
                userScore: savedItem.userScore,
                status: savedItem.status,
                isFavorite: savedItem.isFavorite,
                parentFolderIds: savedItem.parentFolderIds || [],
                appSection: savedItem.appSection,
                createdAt: savedItem.createdAt,
                isCustom: savedItem.isCustom,
            });
        } catch (error) {
            console.warn("Refresh details failed:", error);
            throw error; // Пробрасываем ошибку для Alert в компоненте
        } finally {
            setIsRefreshing(false);
        }
    };

    return {
        savedItem,
        isInCollection,
        existingFolders,
        handleAddToFolder,
        handleStatusUpdate,
        handleToggleFavorite,
        updateCard,
        deleteCard,
        refreshCardDetails,
        isRefreshing,
    };
};
