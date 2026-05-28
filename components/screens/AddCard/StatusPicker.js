import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function StatusPicker({ categories = [], currentStatus, onSelect }) {
    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                {categories.map((s, index) => {
                    const isActive = currentStatus === s;
                    const isLast = index === categories.length - 1;

                    return (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.listItem,
                                isActive && styles.activeListItem,
                                !isLast && styles.borderBottom,
                            ]}
                            onPress={() => onSelect(s)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.itemText, isActive && styles.activeItemText]}>
                                {s}
                            </Text>

                            {/* Кастомный красивый Radio-индикатор */}
                            <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                                {isActive && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 20,
    },
    label: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    listContainer: {
        backgroundColor: "#0B1534",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.03)",
        overflow: "hidden",
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 18,
    },
    activeListItem: {
        backgroundColor: "rgba(125, 138, 255, 0.03)",
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.04)",
    },
    itemText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 15,
        fontWeight: "500",
    },
    activeItemText: {
        color: "#fff",
        fontWeight: "600",
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
    },
    radioOuterActive: {
        borderColor: "#7D8AFF",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#7D8AFF",
    },
});
