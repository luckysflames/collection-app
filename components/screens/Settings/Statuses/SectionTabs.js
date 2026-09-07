import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SUB_CATEGORIES } from "../../../..//constants/index";
import { useTheme } from "../../../../hooks/useTheme";

const { width } = Dimensions.get("window");
const itemWidth = (width - 40 - 10) / 2;

export const SectionTabs = ({ sections = [], selectedSection, onSelect }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.tabGrid}>
            {sections.map((section, index) => {
                const isActive = selectedSection === section.id;
                const subCat = SUB_CATEGORIES.find((cat) => cat.id === section.id);

                const isLastAndOdd = index === sections.length - 1 && sections.length % 2 !== 0;

                return (
                    <TouchableOpacity
                        key={section.id}
                        style={[
                            styles.tabTile,
                            isLastAndOdd && styles.tabTileFullWidth,
                            isActive && styles.activeTabTile,
                        ]}
                        onPress={() => onSelect(section.id)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.contentLayout}>
                            {subCat && (
                                <Image
                                    source={isActive ? subCat.active : subCat.inactive}
                                    style={[styles.tabIcon, isActive && styles.activeTabIcon]}
                                />
                            )}
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {section.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        tabGrid: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 15,
            justifyContent: "flex-start",
        },
        tabTile: {
            width: itemWidth,
            height: 65,
            backgroundColor: theme.main,
            borderRadius: 16,
            justifyContent: "center",
            paddingHorizontal: 16,
        },
        tabTileFullWidth: {
            width: "100%",
        },
        activeTabTile: {
            backgroundColor: theme.accent,
        },
        contentLayout: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        tabText: {
            color: theme.textDark,
            fontSize: 14,
            fontWeight: "600",
        },
        activeTabText: {
            color: theme.text,
            fontWeight: "700",
        },
        tabIcon: {
            width: 20,
            height: 20,
            objectFit: "contain",
            tintColor: theme.textDark,
        },
        activeTabIcon: {
            tintColor: theme.text,
        },
    });
