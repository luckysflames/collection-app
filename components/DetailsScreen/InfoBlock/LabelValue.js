import React from "react";
import { Text, StyleSheet } from "react-native";

export const LabelValue = ({ label, value }) => {
    // Если значения нет, ничего не рендерим, чтобы не плодить пустые строки
    if (!value || value === "" || value === "$?") return null;

    return (
        <Text style={styles.textLine}>
            <Text style={styles.label}>{label}: </Text>
            <Text style={styles.value}>{value}</Text>
        </Text>
    );
};

const styles = StyleSheet.create({
    textLine: {
        fontSize: 14,
        marginBottom: 6, // Небольшой отступ между строками
        paddingHorizontal: 5,
        lineHeight: 20, // Чтобы многострочные списки (страны/компании) не слипались
    },
    label: {
        color: "#8E94A4",
        textTransform: "uppercase",
        fontSize: 11,
        fontWeight: "600",
    },
    value: {
        color: "#7D8AFF",
        fontWeight: "500",
    },
});
