import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Zap } from "lucide-react-native";

export const AverageRatingBlock = ({ items, onApply }) => {
    const [includeUnrated, setIncludeUnrated] = useState(false);

    const averageScore = useMemo(() => {
        const filteredItems = includeUnrated
            ? items
            : items.filter((item) => (item.userScore) > 0);

        if (filteredItems.length === 0) return 0;

        const sum = filteredItems.reduce(
            (acc, item) => acc + (item.userScore || 0),
            0,
        );

        return parseFloat((sum / filteredItems.length).toFixed(1));
    }, [items, includeUnrated]);

    // Функция для переключения
    const toggleSwitch = () =>
        setIncludeUnrated((previousState) => !previousState);

    if (items.length === 0 || (averageScore === 0 && !includeUnrated))
        return null;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.label}>Средний балл карточек: </Text>
                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => onApply(Math.round(averageScore))}
                    activeOpacity={0.7}
                >
                    <Zap size={12} color="#7D8AFF" fill="#7D8AFF" />
                    <Text style={styles.avgValue}>{averageScore} / 10</Text>
                    <Text style={styles.applyText}>Применить</Text>
                </TouchableOpacity>
            </View>

            {/* Теперь вся строка кликабельна */}
            <TouchableOpacity
                style={styles.switchRow}
                onPress={toggleSwitch}
                activeOpacity={0.6}
            >
                <Text style={styles.switchLabel}>
                    Учитывать карточки без рейтинга
                </Text>
                <View pointerEvents="none">
                    {/* pointerEvents="none" нужен, чтобы свитч не перехватывал нажатия сам по себе */}
                    <Switch
                        value={includeUnrated}
                        onValueChange={setIncludeUnrated}
                        trackColor={{
                            false: "#1A2232",
                            true: "rgba(125, 138, 255, 0.5)",
                        }}
                        thumbColor={includeUnrated ? "#7D8AFF" : "#8E94A4"}
                        ios_backgroundColor="#1A2232"
                        style={{
                            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 16,
        padding: 12,
        marginTop: 15,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    label: {
        color: "#8E94A4",
        fontSize: 13,
    },
    applyBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    avgValue: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
        marginLeft: 4,
    },
    applyText: {
        color: "#7D8AFF",
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
        marginLeft: 8,
    },
    switchRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(255, 255, 255, 0.05)",
    },
    switchLabel: {
        color: "#5C6370",
        fontSize: 11,
        fontWeight: "600",
    },
});
