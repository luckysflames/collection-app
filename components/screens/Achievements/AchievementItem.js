import React, { useEffect, useRef } from "react";
import {
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    Animated,
} from "react-native";
import { ChevronRight, CheckCircle2 } from "lucide-react-native";
import { DynamicIcon } from "./DynamicIcon";

export const AchievementItem = ({ achievement, onPress, isHighlighted }) => {
    const isCompleted = achievement.current >= achievement.target;
    const progress = Math.min(achievement.current / achievement.target, 1);
    const isLockedSecret = achievement.hidden && !achievement.isCompleted;
    const isUnlockedSecret = achievement.hidden && isCompleted;

    // Реф для анимации пульсации
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isHighlighted) {
            // Создаем цикл пульсации: 0 -> 1 -> 0
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: false, // т.к. анимируем стили контейнера
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: false,
                    }),
                ]),
                { iterations: 3 }, // Пульсируем 3 раза и затихаем
            ).start();
        }
    }, [isHighlighted]);

    // Интерполяция для цвета бордера и тени
    const highlightStyles = {
        borderColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
                "rgba(125, 138, 255, 0.08)",
                "rgba(125, 138, 255, 0.8)",
            ],
        }),
        backgroundColor: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["rgba(11, 21, 52, 0.6)", "rgba(125, 138, 255, 0.15)"],
        }),
    };

    return (
        <Animated.View
            style={[
                styles.item,
                !isCompleted && styles.lockedItem,
                isUnlockedSecret && styles.secretUnlocked,
                isHighlighted && highlightStyles, // Применяем анимированные стили
            ]}
        >
            <TouchableOpacity
                onPress={() => onPress(achievement)}
                activeOpacity={0.7}
                style={styles.touchableArea}
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
                            color={isCompleted ? "#7D8AFF" : "#444E72"}
                        />
                    </View>

                    <View style={styles.textInfo}>
                        <Text
                            style={[
                                styles.label,
                                !isLockedSecret && { marginBottom: 6 },
                            ]}
                            numberOfLines={1}
                        >
                            {achievement.displayTitle}
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
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    item: {
        borderRadius: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
        backgroundColor: "rgba(11, 21, 52, 0.6)",
        overflow: "hidden",
    },
    touchableArea: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    secretUnlocked: {
        backgroundColor: "rgba(125, 138, 255, 0.2)",
        borderColor: "rgba(125, 138, 255, 0.7)",
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
