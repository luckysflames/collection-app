import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useMediaCategories } from "../../../hooks/useMediaCategories";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export const SearchHeader = ({ activeCategory, query, setQuery, onSearch, handleReset }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const { sectionName } = useMediaCategories(activeCategory);

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    Поиск {sectionName}
                </Text>

                <View style={styles.headerButtonPlaceholder} />
            </View>

            <View style={styles.searchBarContainer}>
                <TouchableOpacity onPress={() => onSearch(query)}>
                    <Search color={theme.accent} size={20} style={styles.searchIcon} />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Поиск по названию..."
                    placeholderTextColor={theme.textDark}
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    onSubmitEditing={() => onSearch(query)}
                    selectionColor={theme.accent}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery("")} style={styles.clearIcon}>
                        <X size={20} color={theme.text} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        wrapper: {
            backgroundColor: theme.dark,
            paddingHorizontal: 16,
            paddingBottom: 15,
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 75,
        },
        headerButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        headerButtonPlaceholder: {
            width: 45,
            height: 45,
            opacity: 0,
        },
        headerTitle: {
            flex: 1,
            textAlign: "center",
            fontSize: 22,
            fontWeight: "bold",
            color: theme.text,
            marginHorizontal: 10,
        },
        searchBarContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            borderRadius: 15,
            paddingHorizontal: 15,
            height: 50,
            marginTop: 5,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            color: theme.text,
            fontSize: 16,
        },
        clearIcon: {
            marginLeft: 8,
        },
    });
