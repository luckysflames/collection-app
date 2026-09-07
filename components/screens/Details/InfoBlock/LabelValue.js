import React from "react";
import { Text, StyleSheet } from "react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const LabelValue = ({ label, value }) => {
    if (!value || value === "" || value === "$?") return null;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <Text style={styles.textLine}>
            <Text style={styles.label}>{label}: </Text>
            <Text style={styles.value}>{value}</Text>
        </Text>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        textLine: {
            fontSize: 14,
            marginBottom: 6,
            paddingHorizontal: 5,
            lineHeight: 20,
        },
        label: {
            color: theme.text,
            textTransform: "uppercase",
            fontSize: 11,
            fontWeight: "600",
        },
        value: {
            color: theme.accent,
            fontWeight: "500",
        },
    });
