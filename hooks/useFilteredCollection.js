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
        // --- 1. ПЕРВИЧНАЯ ФИЛЬТРАЦИЯ (Выбираем то, что подходит по условиям) ---
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

            // --- ОБЫЧНАЯ ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ ---
            if (isInsideFolder) return true;
            if (item.appSection !== currentSection) return false;

            const isFolder = !!item.isFolder;
            const hasParent = (item.parentFolderIds || []).length > 0;

            // Специальная вкладка 1: Всё
            if (category === "Всё") {
                return showFoldersOnly ? isFolder || !hasParent : !isFolder;
            }
            // Специальная вкладка 2: Папки (тут всегда только папки)
            if (category === "Папки") return isFolder;

            // Специальная вкладка 3: Избранное
            if (category === FAVORITE_STATUS) {
                if (!item.isFavorite) return false;
                return showFoldersOnly ? isFolder || !hasParent : !isFolder;
            }

            // Фильтр для обычных вкладок статусов (например, "Смотрю", "В планах")
            // Если группировщик ВЫКЛЮЧЕН — папки на этих вкладках вообще не показываем
            if (!showFoldersOnly && isFolder) return false;

            return item.status === category;
        });

        // --- 1.5. ФИЛЬТРЫ ПО ДОПОЛНИТЕЛЬНЫМ ПОЛЯМ ---
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

        // --- 1.8. МАГИЯ ГРУППИРОВКИ ---
        // Применяется, только если тумблер ВКЛЮЧЕН, мы на вкладке статуса и не внутри папки
        if (
            showFoldersOnly &&
            !isInsideFolder &&
            category !== "Всё" &&
            category !== "Папки" &&
            category !== FAVORITE_STATUS
        ) {
            const finalItemsMap = new Map();
            const parentIdsToFetch = new Set();

            filtered.forEach((item) => {
                if (item.isFolder) {
                    // Если папка каким-то образом сама подошла под статус, сохраняем
                    finalItemsMap.set(String(item.id), item);
                } else {
                    const parents = item.parentFolderIds || [];
                    if (parents.length === 0) {
                        // Карточку без папки оставляем в корне списка
                        finalItemsMap.set(String(item.id), item);
                    } else {
                        // Для карточек с папками — собираем ID их родителей, а сами карточки убираем
                        parents.forEach((parentId) => parentIdsToFetch.add(String(parentId)));
                    }
                }
            });

            // Вытаскиваем накопленные папки из исходного массива data (любого статуса)
            if (parentIdsToFetch.size > 0) {
                data.forEach((dbItem) => {
                    if (dbItem.isFolder && parentIdsToFetch.has(String(dbItem.id))) {
                        finalItemsMap.set(String(dbItem.id), dbItem);
                    }
                });
            }

            filtered = Array.from(finalItemsMap.values());
        }

        // --- 2. СОРТИРОВКА ---
        const sorted = [...filtered].sort((a, b) => {
            if (!isInsideFolder) {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
            }

            const isManualSort = sortType === "manual" || sortType === "manual_desc";

            if (isInsideFolder && isManualSort) {
                if (Array.isArray(folderOrder) && folderOrder.length > 0) {
                    const orderStrings = folderOrder.map(String);
                    const indexA = orderStrings.indexOf(String(a.id));
                    const indexB = orderStrings.indexOf(String(b.id));

                    if (indexA !== -1 || indexB !== -1) {
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return sortType === "manual" ? indexA - indexB : indexB - indexA;
                    }
                }

                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return sortType === "manual" ? dateB - dateA : dateA - dateB;
            }

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
