import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ListFilter, Folder, Dices, Sliders } from "lucide-react-native";

export const MainControls = ({
    count,
    onSortPress,
    onFilterPress,
    showFoldersOnly,
    onToggleFolderMode,
    onRandomPress,
    hasActiveFilters = false,
}) => (
    <View style={styles.staticControlsRow}>
        <View style={styles.countBadge}>
            <Text style={styles.countText}>
                Всего: <Text style={styles.countNumber}>{count}</Text>
            </Text>
        </View>
        <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.actionBtn}
                onPress={onRandomPress}
                activeOpacity={0.7}
            >
                <Dices size={18} color="#7D8AFF" />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionBtn, showFoldersOnly && styles.activeBtn]}
                onPress={onToggleFolderMode}
                activeOpacity={0.7}
            >
                <Folder
                    size={18}
                    color={showFoldersOnly ? "#fff" : "#7D8AFF"}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.actionBtn, hasActiveFilters && styles.activeBtn]}
                onPress={onFilterPress}
                activeOpacity={0.7}
            >
                <Sliders
                    size={18}
                    color={hasActiveFilters ? "#fff" : "#7D8AFF"}
                />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.actionBtn}
                onPress={onSortPress}
                activeOpacity={0.7}
            >
                <ListFilter size={18} color="#7D8AFF" />
            </TouchableOpacity>
        </View>
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
    buttonGroup: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
        width: 40,
        height: 36,
    },
    activeBtn: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    disabledBtn: {
        backgroundColor: "rgba(22, 26, 39, 0.5)",
        borderColor: "rgba(62, 66, 79, 0.5)",
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
