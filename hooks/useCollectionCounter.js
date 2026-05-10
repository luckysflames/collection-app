import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants/index";

export const useCollectionCounter = (
    myCollection,
    currentSection,
    activeCategory,
    showFoldersOnly,
    searchQuery,
    activeFilters = {}, // Не забываем фильтры
) => {
    return useMemo(() => {
        // 1. Создаем функцию-предикат, которая проверяет, подходит ли один айтем под ВСЕ условия
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
                    // Select фильтр
                    if (typeof filterValue === "string") {
                        const itemValue = item[filterKey];
                        if (itemValue === undefined || itemValue === null) {
                            return false;
                        }

                        // Для динамических полей (genres, studios и т.д.) проверяем вхождение
                        const isDynamicField = ['genres', 'studios', 'developers', 'platforms', 'authors', 'companies', 'countries'].includes(filterKey);
                        if (isDynamicField) {
                            // Если значение - строка, разделяем по запятым
                            let values = [];
                            if (typeof itemValue === 'string') {
                                values = itemValue.split(',').map(v => v.trim());
                            } else if (Array.isArray(itemValue)) {
                                values = itemValue;
                            }
                            // Проверяем, содержит ли массив значение
                            if (!values.includes(filterValue)) {
                                return false;
                            }
                        } else {
                            // Для статических полей строгое равенство
                            if (itemValue !== filterValue) {
                                return false;
                            }
                        }
                    }
                    // Range фильтр
                    if (Array.isArray(filterValue)) {
                        const [min, max] = filterValue;
                        const val = item[filterKey];
                        if (
                            val === undefined ||
                            val === null ||
                            val < min ||
                            val > max
                        )
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

                const hasSameStatusParent = item.parentFolderIds.some(
                    (parentId) => {
                        const parent = myCollection.find(
                            (d) => String(d.id) === String(parentId),
                        );
                        return parent && parent.status === item.status;
                    },
                );
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
