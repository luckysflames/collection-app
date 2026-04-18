import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
    useEffect,
    useMemo,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryChips = forwardRef(
    ({ categories, activeCategory, onPress, scrollX }, ref) => {
        const scrollViewRef = useRef(null);
        const [itemLayouts, setItemLayouts] = useState({});

        // Сбрасываем замеры только если список категорий физически изменился
        useEffect(() => {
            setItemLayouts({});
        }, [categories]);

        useEffect(() => {
            const activeIndex = categories.indexOf(activeCategory);
            const layout = itemLayouts[activeIndex];

            // Ключевое изменение: скроллим ТОЛЬКО когда замеры для ЭТОГО индекса готовы
            if (activeIndex !== -1 && layout) {
                const scrollToX =
                    layout.x - SCREEN_WIDTH / 2 + layout.width / 2;

                // Используем requestAnimationFrame, чтобы дождаться окончания отрисовки
                requestAnimationFrame(() => {
                    scrollViewRef.current?.scrollTo({
                        x: Math.max(0, scrollToX),
                        animated: true,
                    });
                });
            }
        }, [activeCategory, itemLayouts]);

        const { input, outX, outW } = useMemo(() => {
            const keys = Object.keys(itemLayouts);
            // Если замеров еще нет или их мало — индикатор просто не виден (width: 0)
            if (keys.length < categories.length || keys.length === 0) {
                return { input: [0, 1], outX: [0, 0], outW: [0, 0] };
            }

            const measuredIndices = keys.map(Number).sort((a, b) => a - b);
            return {
                input: measuredIndices.map((i) => i * SCREEN_WIDTH),
                outX: measuredIndices.map((i) => itemLayouts[i].x),
                outW: measuredIndices.map((i) => itemLayouts[i].width),
            };
        }, [itemLayouts, categories.length]);

        const translateX = scrollX.interpolate({
            inputRange: input,
            outputRange: outX,
            extrapolate: "clamp",
        });

        const chipWidth = scrollX.interpolate({
            inputRange: input,
            outputRange: outW,
            extrapolate: "clamp",
        });

        useImperativeHandle(ref, () => ({
            scrollToIndex: (index) => {
                const layout = itemLayouts[index];
                if (layout) {
                    const scrollToX =
                        layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
                    scrollViewRef.current?.scrollTo({
                        x: Math.max(0, scrollToX),
                        animated: true,
                    });
                }
            },
        }));

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
                                // Показываем индикатор только когда есть расчетные данные
                                opacity: input.length > 1 ? 1 : 0,
                            },
                        ]}
                    />

                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={`${cat}-${index}`}
                            onLayout={(e) => {
                                const { x, width } = e.nativeEvent.layout;
                                setItemLayouts((prev) => ({
                                    ...prev,
                                    [index]: { x, width },
                                }));
                            }}
                            onPress={() => onPress(cat, index)}
                            activeOpacity={0.7}
                            style={styles.chip}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    activeCategory === cat && styles.activeText,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    },
);

const styles = StyleSheet.create({
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
        height: 38,
        backgroundColor: "#7D8AFF",
        borderRadius: 20,
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        // Добавляем left: 0, чтобы translateX считал позицию от начала контейнера
        left: 0,
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 60,
    },
    chipText: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "500",
        zIndex: 2,
    },
    activeChipText: {
        color: "#FFFFFF",
    },
});
