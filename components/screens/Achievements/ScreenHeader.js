import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ChevronLeft } from "lucide-react-native";

export function ScreenHeader({ title, onBack, unlocked, total }) {
    return (
        <View style={styles.container}>
            <View style={styles.leftRow}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ChevronLeft size={24} color="#fff" />
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

const styles = StyleSheet.create({
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
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 15,
    },
    backButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    statsBadge: {
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    statsText: {
        color: "#7D8AFF",
        fontSize: 16,
        fontWeight: "bold",
        fontVariant: ["tabular-nums"],
    },
    statsDivider: {
        color: "rgba(125, 138, 255, 0.5)",
        fontWeight: "normal",
    },
});
