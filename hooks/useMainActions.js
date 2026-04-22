import { useCallback } from "react";
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

    const handleRandomCard = useCallback(() => {
        const availableItems = myCollection.filter((item) => {
            if (item.isFolder || item.appSection !== currentSection)
                return false;
            if (activeCategory === "Всё") return true;
            if (activeCategory === "Избранное")
                return item.status === "Избранное" || item.isFavorite;
            return item.status === activeCategory;
        });

        if (availableItems.length === 0) return;
        const randomItem =
            availableItems[Math.floor(Math.random() * availableItems.length)];
        navigation.navigate("Details", {
            item: randomItem,
            category: currentSection,
        });
    }, [myCollection, currentSection, activeCategory, navigation]);

    return { handleCardPress, handleCardLongPress, handleRandomCard };
};
