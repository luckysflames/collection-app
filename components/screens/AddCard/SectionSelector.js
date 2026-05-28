import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SUB_CATEGORIES } from "../../../constants/index";

const { width } = Dimensions.get("window");

// Высчитываем ширину для сетки из 2 колонок (минус горизонтальные отступы экрана и gap)
const CHIP_WIDTH = (width - 40 - 10) / 2;

export default function SectionSelector({ sections = [], currentType, onSelect }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Категория</Text>
            <View style={styles.grid}>
                {sections.map((s, index) => {
                    const isActive = currentType === s.id;
                    
                    // Если элемент последний и общее количество нечетное — растягиваем на всю ширину
                    const isLastAndOdd = index === sections.length - 1 && sections.length % 2 !== 0;
                    
                    // Ищем иконку для текущей категории
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

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
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
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    chipTile: {
        width: CHIP_WIDTH,
        height: 65,
        backgroundColor: "#0B1534",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.05)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    chipFullWidth: {
        width: "100%",
    },
    activeChipTile: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        // Фирменное свечение активной плитки
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    contentLayout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10, // Отступ между иконкой и текстом
    },
    chipText: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "600",
    },
    activeChipText: {
        color: "#FFF",
        fontWeight: "700",
    },
    chipIcon: {
        width: 20,
        height: 20,
        objectFit: "contain",
        tintColor: "#4E5564",
    },
    activeChipIcon: {
        tintColor: "#FFF",
    },
});