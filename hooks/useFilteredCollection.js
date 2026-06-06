import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants/index";
import { matchesFilterValue } from "../utils/filterUtils";

export const useFilteredCollection = ({
    data,
    category,
    currentSection,
    sortType,
    showFoldersOnly,
    isInsideFolder,
    folderOrder,
    searchQuery,
    activeFilters = {},
}) => {
    return useMemo(() => {
        // --- 1. ФИЛЬТРАЦИЯ ---
        let filtered = data.filter((item) => {
            // 0. ФИЛЬТР ПОИСКА (приоритет)
            if (searchQuery && searchQuery.trim().length > 0) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = item.title?.toLowerCase().includes(query);
                const matchesOriginal = item.originalTitle?.toLowerCase().includes(query);

                if (item.appSection !== currentSection) return false;

                if (category === "Папки") {
                    if (!item.isFolder) return false;
                } else if (category === FAVORITE_STATUS) {
                    if (!item.isFavorite) return false;
                } else if (category !== "Всё") {
                    if (item.status !== category) return false;
                }

                return matchesTitle || matchesOriginal;
            }

            // --- ОБЫЧНАЯ ФИЛЬТРАЦИЯ ---
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

                const hasSameStatusParent = item.parentFolderIds.some((parentId) => {
                    const parent = data.find((d) => String(d.id) === String(parentId));
                    return parent && parent.status === item.status;
                });
                return !hasSameStatusParent;
            }
            return !isFolder;
        });

        // --- 1.5. ФИЛЬТРЫ ПО ПОЛЯМ ---
        if (Object.keys(activeFilters).length > 0) {
            filtered = filtered.filter((item) => {
                if (item.isFolder) return true;

                for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
                    if (!matchesFilterValue(item, filterKey, filterValue)) {
                        return false;
                    }
                }

                return true;
            });
        }

        // --- 2. СОРТИРОВКА ---
        const sorted = [...filtered].sort((a, b) => {
            if (!isInsideFolder) {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
            }

            // --- РУЧНАЯ СОРТИРОВКА (Прямая и Обратная) ---
            const isManualSort = sortType === "manual" || sortType === "manual_desc";

            if (isInsideFolder && isManualSort) {
                if (Array.isArray(folderOrder) && folderOrder.length > 0) {
                    const orderStrings = folderOrder.map(String);
                    const indexA = orderStrings.indexOf(String(a.id));
                    const indexB = orderStrings.indexOf(String(b.id));

                    if (indexA !== -1 || indexB !== -1) {
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;

                        // Если "manual" — сортируем как обычно (0, 1, 2...)
                        // Если "manual_desc" — разворачиваем порядок (индексы наоборот)
                        return sortType === "manual" ? indexA - indexB : indexB - indexA;
                    }
                }

                // Если порядка нет в буфере, сваливаемся на сортировку по умолчанию (дате)
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return sortType === "manual" ? dateB - dateA : dateA - dateB;
            }

            // --- СТАНДАРТНАЯ СОРТИРОВКА ПО СВОЙСТВАМ ---
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            const statusChangeDateA = a.lastStatusChangeAt
                ? new Date(a.lastStatusChangeAt).getTime()
                : dateA;
            const statusChangeDateB = b.lastStatusChangeAt
                ? new Date(b.lastStatusChangeAt).getTime()
                : dateB;

            const ratingA = a.isBrilliant ? 11 : Number(a.userScore) || 0;
            const ratingB = b.isBrilliant ? 11 : Number(b.userScore) || 0;
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
                case "status_change_desc":
                    return statusChangeDateB - statusChangeDateA;
                case "status_change_asc":
                    return statusChangeDateA - statusChangeDateB;
                default:
                    return dateB - dateA;
            }
        });

        // --- 3. СЧЕТЧИКИ ---
        return sorted.map((item) => {
            if (item.isFolder) {
                const count = data.filter((i) =>
                    i.parentFolderIds?.some((id) => String(id) === String(item.id)),
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
        searchQuery,
        activeFilters,
    ]);
};
