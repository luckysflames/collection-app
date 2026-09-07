import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

export default function StatusPicker({ categories = [], currentStatus, onSelect }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

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
                            <Text style={styles.itemText}>{s}</Text>

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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 10,
            marginBottom: 20,
        },
        listContainer: {
            backgroundColor: theme.main,
            borderRadius: 16,
        },
        listItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 18,
            borderRadius: 16,
        },
        activeListItem: {
            backgroundColor: theme.accentMuted,
        },
        borderBottom: {
            borderBottomWidth: 1,
            borderBottomColor: theme.accentMuted,
        },
        itemText: {
            color: theme.text,
            fontSize: 15,
            fontWeight: "500",
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.textDark,
            justifyContent: "center",
            alignItems: "center",
        },
        radioOuterActive: {
            borderColor: theme.accent,
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.accent,
        },
    });
