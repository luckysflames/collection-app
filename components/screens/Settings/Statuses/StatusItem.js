import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LockIcon, Trash2, Star, GripVertical } from "lucide-react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useDraggableItem } from "../../../../hooks/useDraggableItem";

const ITEM_HEIGHT = 58;
const ITEM_GAP = 10;
const TOTAL_OFFSET = ITEM_HEIGHT + ITEM_GAP;

export const StatusItem = memo(
    ({
        id,
        status,
        index,
        statusesCount,
        activeId,
        positions,
        isSystem,
        onDelete,
        onDragStart,
        onDragEnd,
        isSelectedDefault,
        onSetDefault,
    }) => {
        // Подключаем наш вынесенный DnD хук
        const { panGesture, animatedStyle } = useDraggableItem({
            id,
            index,
            totalCount: statusesCount,
            positions,
            activeId,
            totalOffset: TOTAL_OFFSET,
            onDragStart,
            onDragEnd,
        });

        return (
            <Animated.View
                style={[
                    styles.statusItem,
                    isSelectedDefault && styles.activeStatusItem,
                    animatedStyle,
                ]}
            >
                {/* Передаем жест на ручку для перетаскивания */}
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={styles.dragHandle}>
                        <GripVertical size={20} color="#7D8AFF" />
                    </Animated.View>
                </GestureDetector>

                <View style={styles.contentColumn}>
                    <Text
                        style={[styles.statusText, isSelectedDefault && styles.activeStatusText]}
                        numberOfLines={1}
                    >
                        {status}
                    </Text>
                    {isSystem && (
                        <View style={styles.systemBadge}>
                            <LockIcon size={10} color="#4E5564" />
                            <Text style={styles.systemText}>Системный</Text>
                        </View>
                    )}
                </View>

                <View style={styles.actionsColumn}>
                    {!isSystem && (
                        <TouchableOpacity
                            onPress={() => onDelete(status)}
                            style={[styles.actionIconButton, styles.deleteBg]}
                            activeOpacity={0.7}
                        >
                            <Trash2 size={16} color="#FF4B4B" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => onSetDefault(status)}
                        style={[styles.actionIconButton, isSelectedDefault && styles.starActiveBg]}
                        activeOpacity={0.7}
                    >
                        <Star
                            size={16}
                            color={isSelectedDefault ? "#FFD700" : "#4E5564"}
                            fill={isSelectedDefault ? "#FFD700" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    },
);

const styles = StyleSheet.create({
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0B1534",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
        height: ITEM_HEIGHT,
    },
    activeStatusItem: {
        borderColor: "rgba(125, 138, 255, 0.3)",
        backgroundColor: "rgba(125, 138, 255, 0.04)",
    },
    dragHandle: {
        paddingVertical: 10,
        paddingRight: 12,
        paddingLeft: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    contentColumn: {
        flex: 1,
        justifyContent: "center",
    },
    statusText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    activeStatusText: {
        color: "#7D8AFF",
    },
    systemBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
    },
    systemText: {
        color: "#4E5564",
        fontSize: 9,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    actionsColumn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginLeft: 8,
    },
    actionIconButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
    },
    starActiveBg: {
        backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
    deleteBg: {
        backgroundColor: "rgba(255, 75, 75, 0.06)",
    },
});
