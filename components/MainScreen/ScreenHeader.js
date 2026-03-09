import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ScreenHeader = ({ title, onAddPress }) => (
    <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={onAddPress} activeOpacity={0.7}>
            <Ionicons name="add-circle-outline" size={32} color="#7D8AFF" />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: 0.5,
    },
});
