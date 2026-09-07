import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SUB_CATEGORIES } from "../../../constants/index";
import { useTheme } from "../../../hooks/useTheme";

const { width } = Dimensions.get("window");

const CHIP_WIDTH = (width - 40 - 10) / 2;

export default function SectionSelector({ sections = [], currentType, onSelect }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Категория</Text>
            <View style={styles.grid}>
                {sections.map((s, index) => {
                    const isActive = currentType === s.id;
                    const isLastAndOdd = index === sections.length - 1 && sections.length % 2 !== 0;
                    const subCat = SUB_CATEGORIES.find((cat) => cat.id === s.id);

                    return (
                        <TouchableOpacity
                            key={s.id}
                            style={[
                                styles.chipTile,
                                isLastAndOdd && styles.chipFullWidth,
                                isActive && styles.activeChipTile,
                            ]}
                            onPress={() => onSelect(s.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.contentLayout}>
                                {subCat && (
                                    <Image
                                        source={isActive ? subCat.active : subCat.inactive}
                                        style={[styles.chipIcon, isActive && styles.activeChipIcon]}
                                    />
                                )}
                                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                                    {s.label}
                                </Text>
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
            marginBottom: 24,
        },
        label: {
            color: theme.text,
            fontSize: 12,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
            marginLeft: 4,
        },
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
        },
        chipTile: {
            width: CHIP_WIDTH,
            height: 65,
            backgroundColor: theme.main,
            borderRadius: 16,
            justifyContent: "center",
            paddingHorizontal: 16,
        },
        chipFullWidth: {
            width: "100%",
        },
        activeChipTile: {
            backgroundColor: theme.accent,
        },
        contentLayout: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        chipText: {
            color: theme.textDark,
            fontSize: 14,
            fontWeight: "600",
        },
        activeChipText: {
            color: theme.text,
            fontWeight: "700",
        },
        chipIcon: {
            width: 20,
            height: 20,
            objectFit: "contain",
            tintColor: theme.textDark,
        },
        activeChipIcon: {
            tintColor: theme.text,
        },
    });
