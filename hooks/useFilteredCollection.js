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
    searchQuery,
}) => {
    return useMemo(() => {
        // --- 1. ФИЛЬТРАЦИЯ ---
        let filtered = data.filter((item) => {
            // 0. ФИЛЬТР ПОИСКА (приоритет)
            if (searchQuery && searchQuery.trim().length > 0) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = item.title?.toLowerCase().includes(query);
                const matchesOriginal = item.originalTitle
                    ?.toLowerCase()
                    .includes(query);

                // 1. Сначала базовая проверка: тот ли это глобальный раздел (Anime/Movie/Game)
                if (item.appSection !== currentSection) return false;

                // 2. Если мы внутри папки, ищем только в ней
                if (isInsideFolder) {
                    // Здесь проверка на вхождение в папку (через folderOrder или parentFolderIds)
                    // Но обычно если есть searchQuery, мы хотим найти элемент везде в этом разделе.
                    // Если хочешь ограничить поиск только текущей вкладкой/категорией:
                }

                // 3. ПРОВЕРКА КАТЕГОРИИ (Чтобы не вылетало из "Смотрю", "Папки" и т.д.)
                if (category === "Папки") {
                    if (!item.isFolder) return false;
                } else if (category === FAVORITE_STATUS) {
                    if (!item.isFavorite) return false;
                } else if (category !== "Всё") {
                    // Если это конкретный статус (Смотрю, Брошено и т.д.)
                    if (item.status !== category) return false;
                }

                // 4. Если это папка, и мы НЕ во вкладке "Папки" или "Всё" (с модом папок),
                // возможно, стоит её скрыть? Зависит от твоей логики.
                // Сейчас оставим логику "нашел — показывай".

                return matchesTitle || matchesOriginal;
            }

            // --- 1. ОБЫЧНАЯ ФИЛЬТРАЦИЯ (ваш старый код) ---
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
        searchQuery,
    ]);
};
