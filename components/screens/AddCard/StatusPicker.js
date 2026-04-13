import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function StatusPicker({
    categories,
    currentStatus,
    type,
    onSelect,
}) {
    const getDisplayStatus = (s) => {
        if (type === "book") {
            if (s === "Смотрю") return "Читаю";
            if (s === "Просмотрено") return "Прочитано";
        } else if (type === "game") {
            if (s === "Смотрю") return "Играю";
            if (s === "Просмотрено") return "Пройдено";
        }
        return s;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Статус в коллекции</Text>
            <View style={styles.chipRow}>
                {categories.map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[
                            styles.miniChip,
                            currentStatus === s && styles.activeMiniChip,
                        ]}
                        onPress={() => onSelect(s)}
                    >
                        <Text style={styles.chipText}>
                            {getDisplayStatus(s)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        marginBottom: 20,
    },
    label: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    miniChip: {
        backgroundColor: "rgba(125, 138, 255, 0.05)", // Легкий оттенок основного цвета
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
    activeMiniChip: {
        backgroundColor: "rgba(125, 138, 255, 0.2)", // Выделение цветом, но не такое яркое как основные кнопки
        borderColor: "#7D8AFF",
    },
    chipText: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "600",
    },
    activeChipText: {
        color: "#7D8AFF", // Цветной текст для активного статуса
        fontWeight: "700",
    },
});
