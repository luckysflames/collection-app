import React, { memo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { GripVertical } from "lucide-react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useDraggableItem } from "../../../../hooks/useDraggableItem";

const ITEM_HEIGHT = 54;
const ITEM_GAP = 10;
const TOTAL_OFFSET = ITEM_HEIGHT + ITEM_GAP;

// Компонент отдельной строки категории
const CategoryRowItem = memo(({ 
    category, 
    index, 
    totalCount, 
    positions, 
    activeId, 
    onDragStateChange, 
    onOrderChange 
}) => {
    const { panGesture, animatedStyle } = useDraggableItem({
        id: category.id,
        index,
        totalCount,
        positions,
        activeId,
        totalOffset: TOTAL_OFFSET,
        onDragStart: () => onDragStateChange(true),
        onDragEnd: (oldIdx, newIdx) => {
            onDragStateChange(false);
            if (oldIdx === newIdx) return;

            // Собираем новый упорядоченный массив ID на основе финальных позиций Reanimated
            const sortedIds = Object.keys(positions.value).sort(
                (a, b) => positions.value[a] - positions.value[b]
            );
            onOrderChange(sortedIds);
        },
    });

    return (
        <Animated.View style={[styles.categoryRow, animatedStyle]}>
            <View style={styles.categoryInfo}>
                <Image
                    source={category.active}
                    style={styles.icon}
                    tintColor="#7D8AFF"
                />
                <Text style={styles.categoryLabel}>{category.label}</Text>
            </View>

            {/* Хэндл для перетаскивания */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={styles.dragHandle}>
                    <GripVertical size={20} color="#7D8AFF" />
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    );
});

// Основной контейнер списка
export const CategoryOrderList = ({ categories, onDragStateChange, onOrderChange }) => {
    const activeId = useSharedValue(null);

    // Инициализируем shared-объект позиций { [catId]: index }
    const positions = useSharedValue(
        Object.fromEntries(categories.map((cat, idx) => [cat.id, idx]))
    );

    // Вычисляем общую высоту контейнера, так как элементы внутри позиционируются absolute
    const containerHeight = categories.length * TOTAL_OFFSET - ITEM_GAP;

    return (
        <View style={[styles.listWrapper, { height: containerHeight }]}>
            {categories.map((category, index) => (
                <CategoryRowItem
                    key={category.id}
                    category={category}
                    index={index}
                    totalCount={categories.length}
                    positions={positions}
                    activeId={activeId}
                    onDragStateChange={onDragStateChange}
                    onOrderChange={onOrderChange}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    listWrapper: {
        position: "relative",
        width: "100%",
    },
    categoryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.12)",
        height: ITEM_HEIGHT,
    },
    categoryInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        flex: 1,
    },
    icon: {
        width: 24,
        height: 24,
        objectFit: "contain",
    },
    categoryLabel: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    dragHandle: {
        paddingVertical: 10,
        paddingLeft: 16,
        paddingRight: 4,
        justifyContent: "center",
        alignItems: "center",
    },
});