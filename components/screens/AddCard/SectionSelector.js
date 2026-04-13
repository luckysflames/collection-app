import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SectionSelector({ sections, currentType, onSelect }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Категория</Text>
            <View style={styles.chipRow}>
                {sections.map((s) => (
                    <TouchableOpacity
                        key={s.value}
                        style={[
                            styles.chip,
                            currentType === s.value && styles.activeChip,
                        ]}
                        onPress={() => onSelect(s.value)}
                    >
                        <Text style={styles.chipText}>{s.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    label: { color: "#8E94A4", fontSize: 14, marginBottom: 10 },
    chipRow: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
        backgroundColor: "#1E293B",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    activeChip: { backgroundColor: "#7D8AFF" },
    chipText: { color: "#fff", fontSize: 12 },
});
