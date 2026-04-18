import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SUB_CATEGORIES } from "../../../../constants";

export const SectionTabs = ({ sections, selectedSection, onSelect }) => {
    return (
        <View style={styles.tabBar}>
            {sections.map((section) => {
                const isActive = selectedSection === section.id;
                const subCat = SUB_CATEGORIES.find(
                    (cat) => cat.id === section.id,
                );

                return (
                    <TouchableOpacity
                        key={section.id}
                        style={[styles.tab, isActive && styles.activeTab]}
                        onPress={() => onSelect(section.id)}
                    >
                        {subCat && (
                            <Image
                                source={
                                    isActive ? subCat.active : subCat.inactive
                                }
                                style={styles.tabIcon}
                            />
                        )}
                        <Text
                            style={[
                                styles.tabText,
                                isActive && styles.activeTabText,
                            ]}
                        >
                            {section.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: { flexDirection: "row", gap: 8, marginBottom: 20 },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    activeTab: { backgroundColor: "#7D8AFF" },
    tabText: { color: "#8E94A4", fontSize: 11, fontWeight: "600" },
    activeTabText: { color: "#fff" },
    tabIcon: { width: 16, height: 16, objectFit: "contain" },
});
