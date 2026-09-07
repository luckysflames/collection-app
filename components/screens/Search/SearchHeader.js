import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useMediaCategories } from "../../../hooks/useMediaCategories";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export const SearchHeader = ({
    activeCategory,
    query,
    setQuery,
    onSearch,
    handleReset,
    topInset,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const { sectionName } = useMediaCategories(activeCategory);

    return (
        <View style={[styles.wrapper, { paddingTop: topInset - 20 }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleReset} style={styles.backButton}>
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={styles.titleWrapper}>
                    <Text style={styles.header} numberOfLines={1}>
                        Поиск {sectionName}
                    </Text>
                </View>
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
            paddingHorizontal: 20,
            paddingBottom: 10,
        },
        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 2.5,
            marginBottom: 20,
            height: 45,
        },
        backButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        titleWrapper: {
            flex: 1,
            justifyContent: "center",
            marginLeft: 15,
        },
        header: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            includeFontPadding: false,
            textAlignVertical: "center",
        },
        searchBarContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            borderRadius: 15,
            paddingHorizontal: 15,
            height: 50,
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
