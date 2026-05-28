import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { SUB_CATEGORIES } from "../../../..//constants/index";

const { width } = Dimensions.get("window");
// Высчитываем ширину одной плитки для сетки из 2 колонок (минус отступы экрана 40 и gap 10)
const itemWidth = (width - 40 - 10) / 2;

export const SectionTabs = ({ sections = [], selectedSection, onSelect }) => {
    return (
        <View style={styles.tabGrid}>
            {sections.map((section, index) => {
                const isActive = selectedSection === section.id;
                const subCat = SUB_CATEGORIES.find((cat) => cat.id === section.id);

                // Если элемент последний и общее количество нечетное — растягиваем его на 100%
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

const styles = StyleSheet.create({
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
        backgroundColor: "rgba(11, 21, 52, 0.6)",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.05)",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    tabTileFullWidth: {
        width: "100%", // Растягивание нечетного хвоста
    },
    activeTabTile: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    contentLayout: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10, // Фиксированный отступ между иконкой и текстом
    },
    tabText: {
        color: "#8E94A4",
        fontSize: 14, // Немного увеличил размер, так как в строку влезает лучше
        fontWeight: "600",
    },
    activeTabText: {
        color: "#FFF",
        fontWeight: "700",
    },
    tabIcon: {
        width: 20, // Слегка увеличил иконку для баланса с новым размером текста
        height: 20,
        objectFit: "contain",
        tintColor: "#4E5564",
    },
    activeTabIcon: {
        tintColor: "#FFF",
    },
});
