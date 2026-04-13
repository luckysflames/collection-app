import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ListFilter } from "lucide-react-native";

const SORT_LABELS = {
    newest: "Сначала новые",
    oldest: "Сначала старые",
    alphabetical: "По алфавиту",
    rating: "По рейтингу",
};

export const MainControls = ({ sortType, count, onSortPress }) => (
    <View style={styles.staticControlsRow}>
        <View style={styles.countBadge}>
            <Text style={styles.countText}>
                Всего: <Text style={styles.countNumber}>{count}</Text>
            </Text>
        </View>
        <TouchableOpacity
            style={styles.sortBtn}
            onPress={onSortPress}
            activeOpacity={0.7}
        >
            <ListFilter size={18} color="#7D8AFF" />
            <Text style={styles.sortBtnText}>
                {SORT_LABELS[sortType] || "Сортировка"}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    staticControlsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sortBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    sortBtnText: {
        color: "#7D8AFF",
        fontSize: 13,
        fontWeight: "600",
        marginLeft: 6,
    },
    countBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    countText: { color: "#8E94A4", fontSize: 12, fontWeight: "500" },
    countNumber: { color: "#fff", fontWeight: "bold" },
});
