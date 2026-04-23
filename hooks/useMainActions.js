import { useCallback, useRef } from "react";
import { useCollectionStore } from "../store/useCollectionStore";
import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

export const useMainActions = (currentSection, activeCategory, navigation) => {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const updateCard = useCollectionStore((state) => state.updateCard);

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
            Platform.OS === "android"
                ? Vibration.vibrate([0, 30, 1, 30])
                : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            updateCard(item.id, { isPinned: !item.isPinned });
        },
        [updateCard],
    );

    // 1. Добавь ref в начале компонента
    const lastRandomId = useRef(null);

    const handleRandomCard = useCallback(() => {
        // Фильтруем коллекцию
        const availableItems = myCollection.filter((item) => {
            // Базовые фильтры
            if (item.isFolder || item.appSection !== currentSection)
                return false;

            // Фильтр по категориям
            let matchesCategory = false;
            if (activeCategory === "Всё") {
                matchesCategory = true;
            } else if (activeCategory === "Избранное") {
                matchesCategory =
                    item.status === "Избранное" || item.isFavorite;
            } else {
                matchesCategory = item.status === activeCategory;
            }

            // КРИТИЧЕСКИЙ МОМЕНТ: Исключаем прошлую карточку
            // Но только если в списке больше одного элемента, иначе мы застрянем
            const isLastOne = item.id === lastRandomId.current;

            return matchesCategory && !isLastOne;
        });

        // Если после фильтрации "прошлого ID" пусто (например, в категории всего 1 карточка),
        // берем список БЕЗ исключения последнего ID, чтобы функция всё равно сработала
        const finalItems =
            availableItems.length > 0
                ? availableItems
                : myCollection.filter(
                      (item) =>
                          !item.isFolder && item.appSection === currentSection,
                  );

        if (finalItems.length === 0) return;

        const randomItem =
            finalItems[Math.floor(Math.random() * finalItems.length)];

        // 2. Сохраняем ID текущей карточки как "прошлый" для следующего раза
        lastRandomId.current = randomItem.id;

        navigation.navigate("Details", {
            item: randomItem,
            category: currentSection,
        });
    }, [myCollection, currentSection, activeCategory, navigation]);

    return { handleCardPress, handleCardLongPress, handleRandomCard };
};
