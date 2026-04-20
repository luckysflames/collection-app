import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { Star, RotateCcw, Info } from "lucide-react-native";

// Можно рассчитать ширину, чтобы точно входило 5 звезд с учетом отступов
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const UserRating = ({ score, onSetScore, onInfoPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Моя оценка</Text>
                    <TouchableOpacity
                        onPress={onInfoPress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Info size={18} color="#7D8AFF" />
                    </TouchableOpacity>
                </View>
                {score > 0 && (
                    <TouchableOpacity
                        onPress={() => onSetScore(0)}
                        style={styles.resetBtn}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <RotateCcw size={14} color="#8E94A4" />
                        <Text style={styles.resetText}>Сбросить</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.card}>
                <View style={styles.starsRow}>
                    {[...Array(10)].map((_, i) => {
                        const starValue = i + 1;
                        const isActive = starValue <= score;

                        return (
                            <TouchableOpacity
                                key={starValue}
                                activeOpacity={0.6}
                                onPress={() => onSetScore(starValue)}
                                style={styles.starTouch}
                            >
                                <Star
                                    size={26} // Немного увеличили для удобства
                                    color={isActive ? "#FFD700" : "#2A2F3E"}
                                    fill={isActive ? "#FFD700" : "transparent"}
                                    strokeWidth={isActive ? 1.5 : 2}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.scoreBadge}>
                    <Text
                        style={[
                            styles.scoreValue,
                            score > 0 && styles.scoreActive,
                        ]}
                    >
                        {score > 0 ? score : "--"}
                    </Text>
                    <Text style={styles.scoreTotal}>/ 10</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    labelRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    label: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    resetBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    resetText: {
        color: "#8E94A4",
        fontSize: 12,
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    starsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        // Рассчитываем ширину: (Размер иконки 26 + padding 2*2) * 5 звезд + gap 8 * 4 промежутка
        width: (26 + 4) * 5 + 8 * 4,
        gap: 8,
    },
    starTouch: {
        padding: 2,
    },
    scoreBadge: {
        backgroundColor: "rgba(125, 138, 255, 0.1)", // Добавили легкий оттенок основного цвета
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 65,
    },
    scoreValue: {
        color: "#2A2F3E",
        fontSize: 24,
        fontWeight: "900",
    },
    scoreActive: {
        color: "#FFD700",
    },
    scoreTotal: {
        color: "#8E94A4",
        fontSize: 10,
        marginTop: -2,
        fontWeight: "600",
    },
});
