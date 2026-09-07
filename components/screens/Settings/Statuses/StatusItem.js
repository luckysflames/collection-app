import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LockIcon, Trash2, Star, GripVertical } from "lucide-react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useDraggableItem } from "../../../../hooks/useDraggableItem";
import { useTheme } from "../../../../hooks/useTheme";

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
        const { theme, createStyles } = useTheme();
        const styles = createStyles(createLocalStyles);

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
                <GestureDetector gesture={panGesture}>
                    <Animated.View style={styles.dragHandle}>
                        <GripVertical size={20} color={theme.accent} />
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
                            <LockIcon size={10} color={theme.textDark} />
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
                            <Trash2 size={16} color={theme.red} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => onSetDefault(status)}
                        style={[styles.actionIconButton, isSelectedDefault && styles.starActiveBg]}
                        activeOpacity={0.7}
                    >
                        <Star
                            size={16}
                            color={isSelectedDefault ? theme.yellow : theme.textDark}
                            fill={isSelectedDefault ? theme.yellow : "tracnsparent"}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    },
);

const createLocalStyles = (theme) =>
    StyleSheet.create({
        statusItem: {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 16,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: theme.accent,
            height: ITEM_HEIGHT,
        },
        activeStatusItem: {
            backgroundColor: theme.accentMuted,
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
            color: theme.text,
            fontSize: 14,
            fontWeight: "600",
        },
        activeStatusText: {
            color: theme.accent,
        },
        systemBadge: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginTop: 2,
        },
        systemText: {
            color: theme.textDark,
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
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        starActiveBg: {
            backgroundColor: theme.yellowMuted,
        },
        deleteBg: {
            backgroundColor: theme.redMuted,
        },
    });
