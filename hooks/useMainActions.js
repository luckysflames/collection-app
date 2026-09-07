import { useCallback, useRef } from "react";
import { useCollectionStore } from "../store/useCollectionStore";
import { Vibration } from "react-native";
import { FAVORITE_STATUS } from "../constants/index";
import { matchesFilterValue } from "../utils/filterUtils";

export const useMainActions = (
    currentSection,
    activeCategory,
    navigation,
    activeFilters = {},
) => {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const updateCard = useCollectionStore((state) => state.updateCard);
    const lastRandomId = useRef(null);

    const handleCardPress = useCallback(
        (item) => {
            if (item.isFolder) {
                navigation.navigate("FolderDetail", {
                    folderId: item.id,
                    title: item.title,
                });
            } else {
                navigation.navigate("Details", {
                    item,
                    category: currentSection,
                });
            }
        },
        [navigation, currentSection],
    );

    const handleCardLongPress = useCallback(
        async (item) => {
            Vibration.vibrate([0, 30, 1, 30]);
            updateCard(item.id, { isPinned: !item.isPinned });
        },
        [updateCard],
    );

    const handleRandomCard = useCallback(() => {
        // --- 1. Функция проверки фильтров (та же, что в счетчике) ---
        const matchesFilters = (item) => {
            if (Object.keys(activeFilters).length === 0) return true;

            for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
                if (!matchesFilterValue(item, filterKey, filterValue)) {
                    return false;
                }
            }
            return true;
        };

        // --- 2. Фильтруем доступные элементы ---
        const availableItems = myCollection.filter((item) => {
            // Базовые исключения: папки никогда не участвуют в рандоме, только текущий раздел
            if (item.isFolder || item.appSection !== currentSection) return false;

            // Применяем активные фильтры (жанры, рейтинг и т.д.)
            if (!matchesFilters(item)) return false;

            // Фильтр по текущей вкладке (Категории)
            let matchesTab = false;
            if (activeCategory === "Всё" || activeCategory === "Папки") {
                matchesTab = true; // Из "Папок" рандомим все айтемы раздела
            } else if (activeCategory === FAVORITE_STATUS) {
                matchesTab = item.isFavorite;
            } else {
                matchesTab = item.status === activeCategory;
            }

            return matchesTab;
        });

        if (availableItems.length === 0) return;

        // --- 3. Исключаем прошлый ID (чтобы не выпадало дважды одно и то же) ---
        const finalPool =
            availableItems.length > 1
                ? availableItems.filter((i) => i.id !== lastRandomId.current)
                : availableItems;

        const randomItem = finalPool[Math.floor(Math.random() * finalPool.length)];

        // Сохраняем ID для следующего исключения
        lastRandomId.current = randomItem.id;

        navigation.navigate("Details", {
            item: randomItem,
            category: currentSection,
        });
    }, [myCollection, currentSection, activeCategory, navigation, activeFilters]);

    return { handleCardPress, handleCardLongPress, handleRandomCard };
};
