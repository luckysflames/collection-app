import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants";

export const useFilteredCollection = ({
    data,
    category,
    currentSection,
    sortType,
    showFoldersOnly,
    isInsideFolder,
    folderOrder,
}) => {
    return useMemo(() => {
        // --- 1. ФИЛЬТРАЦИЯ ---
        let filtered = data.filter((item) => {
            if (isInsideFolder) return true;
            if (item.appSection !== currentSection) return false;

            const isFolder = !!item.isFolder;
            const hasParent = (item.parentFolderIds || []).length > 0;

            if (category === "Всё") {
                return showFoldersOnly ? isFolder || !hasParent : !isFolder;
            }
            if (category === "Папки") return isFolder;
            if (category === FAVORITE_STATUS) {
                if (!item.isFavorite) return false;
                return showFoldersOnly ? true : !isFolder;
            }

            if (item.status !== category) return false;

            if (showFoldersOnly) {
                if (isFolder) return true;
                if (!hasParent) return true;

                const hasSameStatusParent = item.parentFolderIds.some(
                    (parentId) => {
                        const parent = data.find(
                            (d) => String(d.id) === String(parentId),
                        );
                        return parent && parent.status === item.status;
                    },
                );
                return !hasSameStatusParent;
            }
            return !isFolder;
        });

        // --- 2. СОРТИРОВКА ---
        const sorted = [...filtered].sort((a, b) => {
            // Принудительный ручной порядок внутри папки
            if (isInsideFolder) {
                if (Array.isArray(folderOrder) && folderOrder.length > 0) {
                    const orderStrings = folderOrder.map(String);
                    const indexA = orderStrings.indexOf(String(a.id));
                    const indexB = orderStrings.indexOf(String(b.id));

                    if (indexA !== -1 || indexB !== -1) {
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    }
                }
            }

            // Стандартная сортировка (если не папка или нет ручного порядка)
            const dateA = a.createdAt || 0;
            const dateB = b.createdAt || 0;
            const ratingA = a.userScore || 0;
            const ratingB = b.userScore || 0;
            const titleA = a.title?.toLowerCase() || "";
            const titleB = b.title?.toLowerCase() || "";

            switch (sortType) {
                case "date_desc":
                    return dateB - dateA;
                case "date_asc":
                    return dateA - dateB;
                case "rating_desc":
                    return ratingB - ratingA;
                case "rating_asc":
                    return ratingA - ratingB;
                case "alphabet_asc":
                    return titleA.localeCompare(titleB);
                case "alphabet_desc":
                    return titleB.localeCompare(titleA);
                default:
                    return dateB - dateA;
            }
        });

        // --- 3. СЧЕТЧИКИ (только для отображения папок снаружи) ---
        return sorted.map((item) => {
            if (item.isFolder) {
                const count = data.filter((i) =>
                    i.parentFolderIds?.some(
                        (id) => String(id) === String(item.id),
                    ),
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
        folderOrder,
    ]);
};
