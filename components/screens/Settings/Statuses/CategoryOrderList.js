import React, { memo } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { GripVertical } from "lucide-react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue } from "react-native-reanimated";
import { useDraggableItem } from "../../../../hooks/useDraggableItem";
import { useTheme } from "../../../../hooks/useTheme";

const ITEM_HEIGHT = 54;
const ITEM_GAP = 10;
const TOTAL_OFFSET = ITEM_HEIGHT + ITEM_GAP;

const CategoryRowItem = memo(
    ({ category, index, totalCount, positions, activeId, onDragStateChange, onOrderChange }) => {
        const { theme, createStyles } = useTheme();
        const styles = createStyles(createLocalStyles);

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

                const sortedIds = Object.keys(positions.value).sort(
                    (a, b) => positions.value[a] - positions.value[b],
                );
                onOrderChange(sortedIds);
            },
        });

        return (
            <Animated.View style={[styles.categoryRow, animatedStyle]}>
                <View style={styles.categoryInfo}>
                    <Image source={category.active} style={styles.icon} />
                    <Text style={styles.categoryLabel}>{category.label}</Text>
                </View>

                <GestureDetector gesture={panGesture}>
                    <Animated.View style={styles.dragHandle}>
                        <GripVertical size={20} color={theme.accent} />
                    </Animated.View>
                </GestureDetector>
            </Animated.View>
        );
    },
);

// Основной контейнер списка
export const CategoryOrderList = ({ categories, onDragStateChange, onOrderChange }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const activeId = useSharedValue(null);

    const positions = useSharedValue(
        Object.fromEntries(categories.map((cat, idx) => [cat.id, idx])),
    );

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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        listWrapper: {
            position: "relative",
            width: "100%",
        },
        categoryRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.accent,
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
            resizeMode: "contain",
            tintColor: theme.accent,
        },
        categoryLabel: {
            color: theme.text,
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
