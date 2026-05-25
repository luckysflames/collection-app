import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SUB_CATEGORIES } from "../../../..//constants/index";

const { width } = Dimensions.get("window");
// Высчитываем ширину одной плитки с учётом отступов (3 плитки в ряд для баланса 3+2)
const itemWidth = (width - 40 - 16) / 3;

export const SectionTabs = ({ sections, selectedSection, onSelect }) => {
    return (
        <View style={styles.tabGrid}>
            {sections.map((section) => {
                const isActive = selectedSection === section.id;
                const subCat = SUB_CATEGORIES.find((cat) => cat.id === section.id);

                return (
                    <TouchableOpacity
                        key={section.id}
                        style={[styles.tabTile, isActive && styles.activeTabTile]}
                        onPress={() => onSelect(section.id)}
                        activeOpacity={0.7}
                    >
                        {subCat && (
                            <Image
                                source={isActive ? subCat.active : subCat.inactive}
                                style={[styles.tabIcon, isActive && styles.activeTabIcon]}
                            />
                        )}
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {section.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 15,
        justifyContent: "flex-start",
    },
    tabTile: {
        width: itemWidth,
        height: 65,
        backgroundColor: "rgba(11, 21, 52, 0.6)",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.05)",
        gap: 6,
    },
    activeTabTile: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        // Легкая тень для выделения активной плитки
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    tabText: {
        color: "#8E94A4",
        fontSize: 11,
        fontWeight: "600",
    },
    activeTabText: {
        color: "#FFF",
        fontWeight: "700",
    },
    tabIcon: {
        width: 18,
        height: 18,
        objectFit: "contain",
        tintColor: "#4E5564",
    },
    activeTabIcon: {
        tintColor: "#FFF",
    },
});
