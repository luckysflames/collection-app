import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SectionSelector({ sections, currentType, onSelect }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Категория</Text>
            <View style={styles.chipRow}>
                {sections.map((s) => (
                    <TouchableOpacity
                        key={s.id}
                        style={[
                            styles.chip,
                            currentType === s.id && styles.activeChip,
                        ]}
                        onPress={() => onSelect(s.id)}
                    >
                        <Text
                            style={[
                                styles.chipText,
                                currentType === s.id
                                    ? styles.activeChipText
                                    : styles.chipText,
                            ]}
                        >
                            {s.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20, // Увеличили отступ до следующей секции
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
        gap: 8, // Используем gap вместо marginRight для чистоты
    },
    chip: {
        backgroundColor: "rgba(255, 255, 255, 0.05)", // Полупрозрачный фон для неактивных
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    activeChip: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        // Добавим небольшое свечение для активного элемента
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    chipText: {
        color: "rgba(255, 255, 255, 0.6)", // Приглушенный текст для неактивных
        fontSize: 13,
        fontWeight: "600",
    },
    activeChipText: {
        color: "#fff",
        fontWeight: "700",
    },
});
