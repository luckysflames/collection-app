import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export function ScreenHeader({ title, onBack, unlocked, total }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.container}>
            <View style={styles.leftRow}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
            </View>

            <View style={styles.statsBadge}>
                <Text style={styles.statsText}>
                    {unlocked}
                    <Text style={styles.statsDivider}> / </Text>
                    {total}
                </Text>
            </View>
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        leftRow: {
            flexDirection: "row",
            alignItems: "center",
        },
        title: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            marginLeft: 15,
        },
        backButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        statsBadge: {
            backgroundColor: theme.accentMuted,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        statsText: {
            color: theme.accent,
            fontSize: 16,
            fontWeight: "bold",
            fontVariant: ["tabular-nums"],
        },
        statsDivider: {
            color: theme.accent,
            fontWeight: "bold",
        },
    });
