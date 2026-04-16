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

        // Убрали measuredCount, будем проверять наличие ключей в объекте
        useEffect(() => {
            setItemLayouts({});
        }, [categories]);

        // Проверяем, есть ли замеры для текущего списка категорий
        const hasMeasurements = useMemo(() => {
            return (
                categories.length > 0 &&
                categories.every((_, i) => itemLayouts[i])
            );
        }, [categories, itemLayouts]);

        const getInterpolationData = () => {
            // Если замеров нет, возвращаем дефолтные значения, чтобы интерполяция не упала
            if (!hasMeasurements) {
                return {
                    input: [0, SCREEN_WIDTH],
                    outX: [0, 0],
                    outW: [0, 0],
                };
            }

            const input = categories.map((_, i) => i * SCREEN_WIDTH);
            const outX = categories.map((_, i) => itemLayouts[i].x);
            const outW = categories.map((_, i) => itemLayouts[i].width);

            return { input, outX, outW };
        };

        const { input, outX, outW } = getInterpolationData();

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

        const onItemLayout = (index, event) => {
            const { x, width } = event.nativeEvent.layout;
            setItemLayouts((prev) => ({
                ...prev,
                [index]: { x, width },
            }));
        };

        useImperativeHandle(ref, () => ({
            scrollToIndex: (index) => {
                const layout = itemLayouts[index];
                if (layout && scrollViewRef.current) {
                    // Важно: здесь НЕ нужно прибавлять 16, так как layout.x
                    // уже считается внутри контейнера с отступами
                    const scrollToX =
                        layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
                    scrollViewRef.current.scrollTo({
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
                    scrollEventThrottle={16}
                >
                    {/* Рисуем индикатор всегда, когда есть хоть какие-то замеры, 
                        чтобы он не "моргал" при переключении разделов */}
                    {Object.keys(itemLayouts).length > 0 && (
                        <Animated.View
                            style={[
                                styles.activeIndicator,
                                {
                                    width: chipWidth,
                                    transform: [{ translateX }],
                                    // Убеждаемся, что индикатор виден поверх фона, но под текстом
                                    opacity: hasMeasurements ? 1 : 0,
                                },
                            ]}
                        />
                    )}

                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={`${cat}-${index}`}
                            onLayout={(e) => onItemLayout(index, e)}
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
