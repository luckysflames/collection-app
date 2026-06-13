import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants/index";
import { matchesFilterValue } from "../utils/filterUtils";

export const useCollectionCounter = (
    myCollection,
    currentSection,
    activeCategory,
    showFoldersOnly,
    searchQuery,
    activeFilters = {}, // Не забываем фильтры
) => {
    return useMemo(() => {
        // 1. Создаем карту родителей заранее, чтобы не пересоздавать её для каждого элемента
        const parentMap = new Map(myCollection.map((item) => [String(item.id), item]));

        const filterFn = (item) => {
            // --- Базовая проверка раздела ---
            if (item.appSection !== currentSection) return false;

            // --- 0. Поиск ---
            if (searchQuery && searchQuery.trim().length > 0) {
                const query = searchQuery.toLowerCase();
                const matchesText =
                    item.title?.toLowerCase().includes(query) ||
                    item.originalTitle?.toLowerCase().includes(query);
                if (!matchesText) return false;
            }

            // --- 1. Активные фильтры (Жанры, года и т.д.) ---
            // Папки обычно не фильтруются по метаданным, так же как в useFilteredCollection
            if (!item.isFolder && Object.keys(activeFilters).length > 0) {
                for (const [filterKey, filterValue] of Object.entries(
                    activeFilters,
                )) {
                    if (!matchesFilterValue(item, filterKey, filterValue)) {
                        return false;
                    }
                }
            }

            // --- 2. Категории (Вкладки) и режим Папок ---
            const isFolder = !!item.isFolder;
            const hasParent = (item.parentFolderIds || []).length > 0;

            // Вкладка "Папки"
            if (activeCategory === "Папки") return isFolder;

            // Вкладка "Избранное"
            if (activeCategory === FAVORITE_STATUS) {
                if (!item.isFavorite) return false;
                // В избранном либо всё (если мод папок), либо только айтемы
                return showFoldersOnly ? true : !isFolder;
            }

            // Вкладка "Всё"
            if (activeCategory === "Всё") {
                return showFoldersOnly ? isFolder || !hasParent : !isFolder;
            }

            // Конкретные статусы (Смотрю, Брошено и т.д.)
            if (item.status !== activeCategory) return false;

            // Логика для статусов при включенном режиме папок (скрываем вложенные)
            if (showFoldersOnly) {
                if (isFolder) return true;
                if (!hasParent) return true;

                const hasSameStatusParent = item.parentFolderIds.some((parentId) => {
                    const parent = parentMap.get(String(parentId));
                    return parent && parent.status === item.status;
                });
                return !hasSameStatusParent;
            }

            // Обычный режим для статусов — только элементы
            return !isFolder;
        };

        // 2. Применяем единый фильтр ко всей коллекции
        return myCollection.filter(filterFn).length;
    }, [
        myCollection,
        currentSection,
        activeCategory,
        showFoldersOnly,
        searchQuery,
        activeFilters, // КРИТИЧНО: добавили в зависимости
    ]);
};
