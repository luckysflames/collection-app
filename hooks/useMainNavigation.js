import { useRef, useEffect, useCallback } from "react";
import { Animated, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const useMainNavigation = (CATEGORIES, defaultActive, currentSection, setActiveCategory) => {
    const chipsRef = useRef(null);
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const initialIndex = CATEGORIES.indexOf(defaultActive);

    // --- 1. Синхронизация при смене раздела ---
    useEffect(() => {
        const targetIndex = initialIndex !== -1 ? initialIndex : 0;

        setActiveCategory(defaultActive);
        scrollX.setValue(targetIndex * SCREEN_WIDTH);

        const timer = setTimeout(() => {
            if (pagerRef.current && targetIndex !== -1) {
                pagerRef.current.scrollToIndex({
                    index: targetIndex,
                    animated: false,
                });
                chipsRef.current?.scrollToIndex(targetIndex);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [currentSection, defaultActive, initialIndex, setActiveCategory, scrollX]);

    // --- 2. Обработчик нажатия на чип (вкладку) ---
    const handleChipPress = useCallback(
        (cat, index) => {
            setActiveCategory(cat);

            // Просто запускаем скролл пейджера.
            // Событие onScroll само плавно передвинет индикатор (scrollX) без дерганий.
            pagerRef.current?.scrollToIndex({ index, animated: true });
            chipsRef.current?.scrollToIndex(index);
        },
        [setActiveCategory],
    );

    // --- 3. Завершение свайпа/скролла в Pager ---
    const handleMomentumScrollEnd = useCallback(
        (e) => {
            const offsetX = e.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / SCREEN_WIDTH);
            const targetCategory = CATEGORIES[index];

            if (targetCategory) {
                setActiveCategory(targetCategory);
                chipsRef.current?.scrollToIndex(index);
            }
        },
        [CATEGORIES, setActiveCategory],
    );

    // --- 4. Прямая привязка скролла к scrollX ---
    const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
        useNativeDriver: false,
    });

    return {
        chipsRef,
        pagerRef,
        scrollX,
        handleChipPress,
        handleMomentumScrollEnd,
        onScrollEvent: handleScroll,
    };
};
