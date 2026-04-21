import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants";

export const useCollectionCounter = (
    myCollection,
    currentSection,
    activeCategory,
    showFoldersOnly,
    searchQuery, // Принимаем новый пропс
) => {
    return useMemo(() => {
        // --- 1. ФИЛЬТРАЦИЯ ПО ПОИСКУ (ЕСЛИ ОН ЕСТЬ) ---
        if (searchQuery && searchQuery.trim().length > 0) {
            const query = searchQuery.toLowerCase();

            return myCollection.filter((item) => {
                // Базовая проверка раздела
                if (item.appSection !== currentSection) return false;

                // Проверка на совпадение названия
                const matchesText =
                    item.title?.toLowerCase().includes(query) ||
                    item.originalTitle?.toLowerCase().includes(query);

                if (!matchesText) return false;

                // Учитываем текущую вкладку (категорию), чтобы цифра
                // соответствовала тому, что пользователь видит на экране
                if (activeCategory === "Папки") {
                    return item.isFolder;
                }
                if (activeCategory === FAVORITE_STATUS) {
                    const isFav = item.isFavorite;
                    return showFoldersOnly ? isFav : isFav && !item.isFolder;
                }
                if (activeCategory !== "Всё") {
                    // Для вкладок "Смотрю", "Запланировано" и т.д.
                    return item.status === activeCategory;
                }

                // Для вкладки "Всё" фильтруем папки согласно режиму showFoldersOnly
                if (activeCategory === "Всё") {
                    return showFoldersOnly
                        ? item.isFolder || !item.parentFolderIds?.length
                        : !item.isFolder;
                }

                return true;
            }).length;
        }

        // --- 2. СТАНДАРТНАЯ ЛОГИКА (БЕЗ ПОИСКА) ---
        const items = myCollection.filter(
            (item) => item.appSection === currentSection,
        );

        if (activeCategory === "Всё") {
            return items.filter((i) =>
                showFoldersOnly
                    ? i.isFolder || !i.parentFolderIds?.length
                    : !i.isFolder,
            ).length;
        }

        if (activeCategory === "Папки") {
            return items.filter((i) => i.isFolder).length;
        }

        if (activeCategory === FAVORITE_STATUS) {
            const favorites = items.filter((i) => i.isFavorite);
            return showFoldersOnly
                ? favorites.length
                : favorites.filter((i) => !i.isFolder).length;
        }

        const statusItems = items.filter((i) => i.status === activeCategory);
        if (showFoldersOnly) {
            return statusItems.filter((item) => {
                if (item.isFolder) return true;
                const hasSameStatusParent = item.parentFolderIds?.some(
                    (parentId) => {
                        const parent = myCollection.find(
                            (d) => d.id === parentId,
                        );
                        return parent && parent.status === activeCategory;
                    },
                );
                return !hasSameStatusParent;
            }).length;
        }

        return statusItems.filter((i) => !i.isFolder).length;

        // Не забудь добавить searchQuery в массив зависимостей!
    }, [
        myCollection,
        currentSection,
        activeCategory,
        showFoldersOnly,
        searchQuery,
    ]);
};
