import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
// Используем ChevronRight для консистентности с настройками
import { ChevronRight, CheckCircle2 } from "lucide-react-native";
import { DynamicIcon } from "./DynamicIcon";

export const AchievementItem = ({ achievement, onPress }) => {
    // Рассчитываем состояние
    const isCompleted = achievement.current >= achievement.target;
    const progress = Math.min(achievement.current / achievement.target, 1);
    const isLockedSecret = achievement.hidden && !achievement.isCompleted;

    return (
        <TouchableOpacity
            style={[styles.item, !isCompleted && styles.lockedItem]}
            onPress={() => onPress(achievement)}
            activeOpacity={0.7}
            disabled={isLockedSecret}
        >
            <View style={styles.leftContainer}>
                <View
                    style={[
                        styles.iconWrapper,
                        isCompleted && styles.completedIcon,
                    ]}
                >
                    <DynamicIcon
                        name={achievement.displayIconName}
                        size={22}
                        // Меняем цвет иконки в зависимости от статуса
                        color={isCompleted ? "#7D8AFF" : "#444E72"}
                    />
                </View>

                <View style={styles.textInfo}>
                    <Text style={styles.label} numberOfLines={1}>
                        {achievement.displayTitle}{" "}
                        {/* Используем displayTitle */}
                    </Text>

                    {!isLockedSecret && (
                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: `${progress * 100}%` },
                                    isCompleted && styles.completedFill,
                                ]}
                            />
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.rightContainer}>
                {isCompleted ? (
                    <CheckCircle2 size={18} color="#7D8AFF" />
                ) : (
                    <Text style={styles.progressText}>
                        {isLockedSecret
                            ? "? / ?"
                            : `${achievement.current}/${achievement.target}`}
                    </Text>
                )}
                <ChevronRight
                    size={18}
                    color="#444E72"
                    style={{ marginLeft: 8 }}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "rgba(11, 21, 52, 0.6)", // Чуть прозрачный фон
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
    },
    lockedItem: {
        opacity: 0.8,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    completedIcon: {
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        borderColor: "rgba(125, 138, 255, 0.5)",
    },
    textInfo: {
        flex: 1,
        justifyContent: "center",
        marginRight: 10,
    },
    label: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 6,
    },
    progressTrack: {
        height: 4,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 2,
        width: "90%", // Оставляем немного места справа
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#7D8AFF",
        borderRadius: 2,
    },
    completedFill: {
        backgroundColor: "#7D8AFF",
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    progressText: {
        color: "#8E94A4",
        fontSize: 11,
        fontWeight: "700",
    },
});
