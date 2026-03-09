import React, { useRef, useImperativeHandle, forwardRef } from "react";
import {
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryChips = forwardRef(
    ({ categories, activeCategory, onPress }, ref) => {
        const scrollViewRef = useRef(null);
        const itemLayouts = useRef({}).current;

        useImperativeHandle(ref, () => ({
            scrollToIndex: (index) => {
                handleScroll(index);
            },
        }));

        const handleScroll = (index) => {
            const layout = itemLayouts[index];
            if (layout && scrollViewRef.current) {
                const scrollToX =
                    layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
                scrollViewRef.current.scrollTo({
                    x: Math.max(0, scrollToX),
                    animated: true,
                });
            }
        };

        return (
            <View style={styles.container}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                >
                    {categories.map((cat, index) => (
                        <TouchableOpacity
                            key={cat}
                            onLayout={(e) => {
                                itemLayouts[index] = e.nativeEvent.layout;
                            }}
                            onPress={() => {
                                onPress(cat, index);
                                handleScroll(index);
                            }}
                            activeOpacity={0.7}
                            style={[
                                styles.chip,
                                activeCategory === cat && styles.activeChip,
                            ]}
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
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginRight: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    activeChip: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        // Небольшое свечение для активной чипсы
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    chipText: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "500",
    },
    activeChipText: {
        color: "#FFFFFF",
    },
});
