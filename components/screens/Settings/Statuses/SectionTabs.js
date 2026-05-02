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
                                style={[
                                    styles.tabIcon,
                                    isActive && styles.activeTabIcon,
                                ]}
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
    tabBar: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
        backgroundColor: "rgba(125, 138, 255, 0.03)",
        padding: 4,
        borderRadius: 18,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 15,
        borderRadius: 14,
        backgroundColor: "transparent",
    },
    activeTab: {
        backgroundColor: "#7D8AFF",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    tabText: {
        color: "#4E5564",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "700",
    },
    tabIcon: {
        width: 14,
        height: 14,
        objectFit: "contain",
        opacity: 0.6,
    },
    activeTabIcon: {
        opacity: 1,
    },
});
