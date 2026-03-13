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
    container: { marginTop: 10, marginBottom: 10 },
    label: { color: "#8E94A4", fontSize: 14, marginBottom: 10 },
    chipRow: { flexDirection: "row", flexWrap: "wrap" },
    miniChip: {
        backgroundColor: "#1E293B",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        marginRight: 6,
        marginBottom: 6,
    },
    activeMiniChip: { backgroundColor: "#7D8AFF" },
    chipText: { color: "#fff", fontSize: 12 },
});
