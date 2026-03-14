import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
    useState,
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
        const itemLayouts = useRef({}).current;
        const [measuredCount, setMeasuredCount] = useState(0);

        const isAllMeasured = measuredCount === categories.length;

        // Создаем массивы для интерполяции только когда всё замерено
        const inputRange = categories.map((_, i) => i * SCREEN_WIDTH);

        // Важно: если еще не замерено, отдаем массив нулей того же размера
        const outputX = isAllMeasured
            ? categories.map((_, i) => itemLayouts[i]?.x || 0)
            : categories.map(() => 0);

        const outputWidth = isAllMeasured
            ? categories.map((_, i) => itemLayouts[i]?.width || 0)
            : categories.map(() => 0);

        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: outputX,
            extrapolate: "clamp",
        });

        const chipWidth = scrollX.interpolate({
            inputRange,
            outputRange: outputWidth,
            extrapolate: "clamp",
        });

        const onItemLayout = (index, event) => {
            if (!itemLayouts[index]) {
                setMeasuredCount((prev) => prev + 1);
            }
            itemLayouts[index] = event.nativeEvent.layout;
        };

        useImperativeHandle(ref, () => ({
            scrollToIndex: (index) => {
                const layout = itemLayouts[index];
                if (layout && scrollViewRef.current) {
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
                    {isAllMeasured && (
                        <Animated.View
                            style={[
                                styles.activeIndicator,
                                {
                                    width: chipWidth,
                                    transform: [{ translateX }],
                                },
                            ]}
                        />
                    )}

                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={cat}
                            onLayout={(e) => onItemLayout(index, e)}
                            onPress={() => onPress(cat, index)}
                            activeOpacity={0.7}
                            style={styles.chip}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    activeCategory === cat &&
                                        styles.activeChipText,
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
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "500",
        zIndex: 2,
    },
    activeChipText: {
        color: "#FFFFFF",
    },
});
