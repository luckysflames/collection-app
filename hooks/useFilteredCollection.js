import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants";

export const useFilteredCollection = ({
    data,
    category,
    currentSection,
    sortType,
    showFoldersOnly,
    isInsideFolder,
}) => {
    return useMemo(() => {
        // --- 1. ФИЛЬТРАЦИЯ ---
        let filtered = data.filter((item) => {
            if (isInsideFolder) return true;
            if (item.appSection !== currentSection) return false;

            const isFolder = !!item.isFolder;
            const hasParent = item.parentFolderIds?.length > 0;

            if (category === "Всё") {
                return showFoldersOnly ? isFolder || !hasParent : !isFolder;
            }
            if (category === "Папки") return isFolder;
            if (category === FAVORITE_STATUS) {
                if (!item.isFavorite) return false;
                return showFoldersOnly ? true : !isFolder;
            }

            // Статусные вкладки
            if (item.status !== category) return false;
            if (showFoldersOnly) {
                if (isFolder) return true;
                if (!hasParent) return true;
                const hasSameStatusParent = item.parentFolderIds.some(
                    (parentId) => {
                        const parent = data.find((d) => d.id === parentId);
                        return parent && parent.status === item.status;
                    },
                );
                return !hasSameStatusParent;
            }
            return !isFolder;
        });

        // --- 2. НОВАЯ СОРТИРОВКА (под обновленную модалку) ---
        const sorted = [...filtered].sort((a, b) => {
            const dateA = a.createdAt || 0;
            const dateB = b.createdAt || 0;
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            const titleA = a.title?.toLowerCase() || "";
            const titleB = b.title?.toLowerCase() || "";

            switch (sortType) {
                // Дата
                case "newest":
                case "date_desc":
                    return dateB - dateA;
                case "oldest":
                case "date_asc":
                    return dateA - dateB;

                // Рейтинг
                case "rating": // дефолтный рейтинг (убывание)
                case "rating_desc":
                    return ratingB - ratingA;
                case "rating_asc":
                    return ratingA - ratingB;

                // Алфавит
                case "alphabetical": // дефолтный алфавит (А-Я)
                case "alphabet_asc":
                    return titleA.localeCompare(titleB);
                case "alphabet_desc":
                    return titleB.localeCompare(titleA);

                default:
                    return dateB - dateA;
            }
        });

        // --- 3. СЧЕТЧИКИ ДЛЯ ПАПОК ---
        return sorted.map((item) => {
            if (item.isFolder) {
                const count = data.filter((i) =>
                    i.parentFolderIds?.includes(item.id),
                ).length;
                return { ...item, _computedCount: count };
            }
            return item;
        });
    }, [
        data,
        category,
        currentSection,
        sortType,
        showFoldersOnly,
        isInsideFolder,
    ]);
};
