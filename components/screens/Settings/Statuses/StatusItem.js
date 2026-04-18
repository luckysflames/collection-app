import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Используем memo, чтобы не перерисовывать элементы списка при каждом чихе в родительском стейте
export const StatusItem = memo(
    ({
        status,
        index,
        isFirst,
        isLast,
        isSystem, // Переименовали для ясности (это системный статус или кастомный)
        onDelete,
        onMove,
        isSelectedDefault, // А это — выбран ли он основным для раздела
        onSetDefault,
    }) => {
        return (
            <View style={styles.statusItem}>
                <View style={styles.topRow}>
                    <Text
                        style={[
                            styles.statusText,
                            isSelectedDefault && styles.activeStatusText,
                        ]}
                        numberOfLines={1}
                    >
                        {status}
                    </Text>

                    <TouchableOpacity
                        onPress={() => onSetDefault(status)}
                        style={styles.starButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isSelectedDefault ? "star" : "star-outline"}
                            size={22}
                            color={isSelectedDefault ? "#FFD700" : "#4E5564"}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.bottomRow}>
                    {/* Если статус системный — показываем замок, если нет — кнопку удаления */}
                    {isSystem ? (
                        <View style={styles.systemBadge}>
                            <Ionicons
                                name="lock-closed"
                                size={12}
                                color="#4E5564"
                            />
                            <Text style={styles.systemText}>Системный</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => onDelete(status)}
                            style={styles.deleteAction}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={16}
                                color="#FF6B6B"
                            />
                            <Text style={styles.deleteText}>Удалить</Text>
                        </TouchableOpacity>
                    )}

                    <View style={styles.moveControls}>
                        <TouchableOpacity
                            onPress={() => onMove(index, "up")}
                            disabled={isFirst}
                            style={[
                                styles.miniButton,
                                isFirst && styles.hidden,
                            ]}
                        >
                            <Ionicons
                                name="arrow-up"
                                size={16}
                                color="#7D8AFF"
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => onMove(index, "down")}
                            disabled={isLast}
                            style={[styles.miniButton, isLast && styles.hidden]}
                        >
                            <Ionicons
                                name="arrow-down"
                                size={16}
                                color="#7D8AFF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    },
);

const styles = StyleSheet.create({
    statusItem: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 16,
        padding: 12,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    statusText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        marginRight: 10,
    },
    activeStatusText: { color: "#FFD700" },
    starButton: { padding: 4 },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.05)",
    },
    moveControls: { flexDirection: "row", gap: 12 },
    miniButton: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderRadius: 8,
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteAction: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    deleteText: { color: "#FF6B6B", fontSize: 12, fontWeight: "600" },
    systemBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        opacity: 0.5,
    },
    systemText: { color: "#4E5564", fontSize: 11, fontWeight: "600" },
    hidden: { opacity: 0 },
});
