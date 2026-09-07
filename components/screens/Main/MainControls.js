import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { ListFilter, Folder, Dices, Sliders } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export const MainControls = ({
    count,
    onSortPress,
    onFilterPress,
    showFoldersOnly,
    onToggleFolderMode,
    onRandomPress,
    hasActiveFilters = false,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
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
                    <Dices size={18} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, showFoldersOnly && styles.activeBtn]}
                    onPress={onToggleFolderMode}
                    activeOpacity={0.7}
                >
                    <Folder size={18} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, hasActiveFilters && styles.activeBtn]}
                    onPress={onFilterPress}
                    activeOpacity={0.7}
                >
                    <Sliders size={18} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={onSortPress}
                    activeOpacity={0.7}
                >
                    <ListFilter size={18} color={theme.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
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
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.accent,
            width: 40,
            height: 36,
        },
        activeBtn: {
            backgroundColor: theme.accent,
        },
        countBadge: {
            backgroundColor: theme.main,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 20,
        },
        countText: { color: theme.text, fontSize: 12, fontWeight: "700" },
        countNumber: { color: theme.accent, fontWeight: "bold" },
    });
