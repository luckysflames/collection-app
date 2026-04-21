import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ChevronLeft, FolderPlus } from "lucide-react-native";

export const ScreenHeader = ({ title, onAddPress, onBack }) => (
    // <View style={styles.headerRow}>
    //     <Text style={styles.headerTitle}>{title}</Text>
    //     <TouchableOpacity onPress={onAddPress} activeOpacity={0.7}>
    //         <FolderPlus size={32} color="#7D8AFF" />
    //     </TouchableOpacity>
    // </View>

    <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
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
    headerButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 0.5,
    },
});
