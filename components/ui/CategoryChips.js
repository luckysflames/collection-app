import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import {
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Dimensions,
    Animated,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryChips = forwardRef(({ categories, activeCategory, onPress, scrollX }, ref) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const scrollViewRef = useRef(null);
    const layoutsRef = useRef({});

    const [isMeasured, setIsMeasured] = useState(false);

    const scrollToCategory = useCallback((index) => {
        const layout = layoutsRef.current[index];
        if (layout && scrollViewRef.current) {
            const scrollToX = layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollToX),
                animated: true,
            });
        }
    }, []);

    useEffect(() => {
        const activeIndex = categories.indexOf(activeCategory);
        if (activeIndex !== -1) {
            requestAnimationFrame(() => scrollToCategory(activeIndex));
        }
    }, [activeCategory, categories, scrollToCategory]);

    useImperativeHandle(ref, () => ({
        scrollToIndex: (index) => scrollToCategory(index),
    }));

    const handleLayout = (index, event) => {
        const { x, width } = event.nativeEvent.layout;
        layoutsRef.current[index] = { x, width };

        if (Object.keys(layoutsRef.current).length === categories.length) {
            if (!isMeasured) setIsMeasured(true);
        }
    };

    const getInterpolationRanges = () => {
        const total = categories.length;
        const measuredKeys = Object.keys(layoutsRef.current).map(Number);

        if (measuredKeys.length < total) {
            return {
                inputRange: [0, SCREEN_WIDTH],
                outputX: [0, 0],
                outputW: [0, 0],
            };
        }

        const inputRange = categories.map((_, i) => i * SCREEN_WIDTH);
        const outputX = categories.map((_, i) => layoutsRef.current[i]?.x || 0);
        const outputW = categories.map((_, i) => layoutsRef.current[i]?.width || 0);

        return { inputRange, outputX, outputW };
    };

    const { inputRange, outputX, outputW } = getInterpolationRanges();

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: outputX,
        extrapolate: "clamp",
    });

    const chipWidth = scrollX.interpolate({
        inputRange,
        outputRange: outputW,
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Animated.View
                    style={[
                        styles.activeIndicator,
                        {
                            width: chipWidth,
                            transform: [{ translateX }],
                            opacity: isMeasured ? 1 : 0,
                        },
                    ]}
                />

                {categories.map((cat, index) => {
                    return (
                        <TouchableOpacity
                            key={`${cat}-${index}`}
                            onLayout={(e) => handleLayout(index, e)}
                            onPress={() => onPress(cat, index)}
                            activeOpacity={0.7}
                            style={styles.chip}
                        >
                            <Text style={styles.chipText}>{cat}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
});

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            height: 50,
            marginBottom: 10,
        },
        contentContainer: {
            paddingHorizontal: 16,
            alignItems: "center",
            flexDirection: "row",
        },
        activeIndicator: {
            position: "absolute",
            left: 0,
            height: 38,
            backgroundColor: theme.accent,
            borderRadius: 20,
        },
        chip: {
            paddingHorizontal: 18,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 10,
            borderWidth: 1,
            borderColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
            minWidth: 60,
        },
        chipText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "500",
            zIndex: 2,
        },
    });
