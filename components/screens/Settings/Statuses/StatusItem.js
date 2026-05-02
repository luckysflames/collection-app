import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
    ChevronDown,
    ChevronUp,
    LockIcon,
    Trash2,
    Star,
} from "lucide-react-native";

// Используем memo, чтобы не перерисовывать элементы списка при каждом чихе в родительском стейте
export const StatusItem = memo(
    ({
        status,
        index,
        isFirst,
        isLast,
        isSystem,
        onDelete,
        onMove,
        isSelectedDefault,
        onSetDefault,
    }) => {
        return (
            <View style={styles.statusItem}>
                {/* Левая часть: Стрелки перемещения */}
                <View style={styles.moveColumn}>
                    <TouchableOpacity
                        onPress={() => onMove(index, "up")}
                        disabled={isFirst}
                        style={[styles.arrowButton, isFirst && styles.disabled]}
                    >
                        <ChevronUp
                            size={18}
                            color={isLast ? "#2A3247" : "#7D8AFF"}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onMove(index, "down")}
                        disabled={isLast}
                        style={[styles.arrowButton, isLast && styles.disabled]}
                    >
                        <ChevronDown
                            size={18}
                            color={isLast ? "#2A3247" : "#7D8AFF"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Центр: Текст статуса */}
                <View style={styles.contentColumn}>
                    <Text
                        style={[
                            styles.statusText,
                            isSelectedDefault && styles.activeStatusText,
                        ]}
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

                {/* Правая часть: Действия (Звезда и Удаление) */}
                <View style={styles.actionsColumn}>
                    {!isSystem && (
                        <TouchableOpacity
                            onPress={() => onDelete(status)}
                            style={[styles.actionIconButton, styles.deleteBg]}
                        >
                            <Trash2 size={18} color="#FF4B4B" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={() => onSetDefault(status)}
                        style={[
                            styles.actionIconButton,
                            isSelectedDefault && styles.starActiveBg,
                        ]}
                    >
                        <Star
                            size={18}
                            color={isSelectedDefault ? "#FFD700" : "#4E5564"}
                            fill={isSelectedDefault ? "#FFD700" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    },
);

const styles = StyleSheet.create({
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(11, 21, 52, 0.6)",
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
        height: 64,
    },
    moveColumn: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        gap: 2,
    },
    arrowButton: {
        padding: 2,
    },
    contentColumn: {
        flex: 1,
        justifyContent: "center",
    },
    statusText: {
        color: "#fff",
        fontSize: 15,
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
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    actionsColumn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginLeft: 8,
    },
    actionIconButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
    },
    starActiveBg: {
        backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
    deleteBg: {
        backgroundColor: "rgba(255, 75, 75, 0.08)",
    },
    disabled: {
        opacity: 0.2,
    },
});
