import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FolderPlus } from "lucide-react-native";

export const ScreenHeader = ({ title, onAddPress }) => (
    <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={onAddPress} activeOpacity={0.7}>
            <FolderPlus size={32} color="#7D8AFF" />
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
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 0.5,
    },
});
