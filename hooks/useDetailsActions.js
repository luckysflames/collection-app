import { useCollectionStore } from "../store/useCollectionStore";
import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUS_BY_SECTION,
    SECTION_MAPPING,
    FAVORITE_STATUS,
} from "../constants/index";
import { useMemo, useState } from "react";

const getSectionKey = (section) => SECTION_MAPPING[section] || section;

export const useDetailsActions = (item, displayData, category) => {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const addToCollection = useCollectionStore((state) => state.addToCollection);
    const updateCard = useCollectionStore((state) => state.updateCard);
    const deleteCard = useCollectionStore((state) => state.deleteCard);

    const savedItem = myCollection.find(
        (fav) => String(fav.id) === String(item.id),
    );
    const isInCollection = !!savedItem;

    // Поиск подходящих папок для текущей секции (Фильмы/Аниме и т.д.)
    const currentSection = useMemo(() => {
        // Приоритет 1: Явно переданная категория (из route.params)
        if (category) return category;

        // Приоритет 2: Секция из сохраненного айтема (если он уже в базе)
        if (savedItem?.appSection) return savedItem.appSection;

        // Приоритет 3: Если это пришло из карусели аниме или сериалов (проверяем поля API)
        if (item.type === "anime" || item.episodes) return "Аниме";
        if (item.type === "tv" || item.isTV) return "Сериалы";

        // Приоритет 4: Поле самого айтема
        return item.appSection || "Фильмы";
    }, [category, savedItem, item]);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const existingFolders = useMemo(() => {
        return myCollection.filter((i) => {
            if (!i.isFolder) return false;
            const folderSection = String(i.appSection || "")
                .trim()
                .toLowerCase();
            const activeSection = String(currentSection).trim().toLowerCase();
            return folderSection === activeSection;
        });
    }, [myCollection, currentSection]);

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
            const rawStatus = displayData.status || null;
            const { finalStatus } = processStatus(rawStatus);

            addToCollection({
                ...item,
                ...displayData,
                status: finalStatus,
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
            updateCard(item.id, {
                status: newStatus,
                lastStatusChangeAt: Date.now(),
            });
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
        const idToFetch = savedItem?.id || item.id;

        if (!idToFetch) return;
        setIsRefreshing(true);

        try {
            const freshDetails = await fetchDetailsById(idToFetch);
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
