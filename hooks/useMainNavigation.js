import { useRef, useEffect, useCallback } from "react";
import { Animated, Dimensions } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const useMainNavigation = (
    CATEGORIES,
    defaultActive,
    currentSection,
    setActiveCategory,
) => {
    // --- Refs & Animation ---
    const chipsRef = useRef(null);
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Вычисляем индекс начальной категории
    const initialIndex = CATEGORIES.indexOf(defaultActive);

    // --- Эффект синхронизации при смене раздела (Movies/Anime и т.д.) ---
    useEffect(() => {
        setActiveCategory(defaultActive);

        const timer = setTimeout(() => {
            if (pagerRef.current && initialIndex !== -1) {
                // Сбрасываем позицию пейджера и чипсов без анимации
                pagerRef.current.scrollToIndex({
                    index: initialIndex,
                    animated: false,
                });
                chipsRef.current?.scrollToIndex(initialIndex);
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [currentSection, defaultActive, initialIndex, setActiveCategory]);

    // --- Обработчики взаимодействия ---

    // Нажатие на чип (вкладку)
    const handleChipPress = useCallback(
        (cat, index) => {
            setActiveCategory(cat);
            pagerRef.current?.scrollToIndex({ index, animated: true });
        },
        [setActiveCategory],
    );

    // Завершение свайпа в Pager
    const handleMomentumScrollEnd = useCallback(
        (e) => {
            const index = Math.round(
                e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            const targetCategory = CATEGORIES[index];

            if (targetCategory) {
                setActiveCategory(targetCategory);
                chipsRef.current?.scrollToIndex(index);
            }
        },
        [CATEGORIES, setActiveCategory],
    );

    // Конфигурация события скролла для анимаций CategoryChips
    const onScrollEvent = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false },
    );

    return {
        chipsRef,
        pagerRef,
        scrollX,
        handleChipPress,
        handleMomentumScrollEnd,
        onScrollEvent,
    };
};
