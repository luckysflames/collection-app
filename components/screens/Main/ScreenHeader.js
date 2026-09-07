import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { ChevronLeft, Search, X } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export const ScreenHeader = ({ title, onBack, searchQuery, setSearchQuery }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef(null);

    const toggleSearch = () => {
        if (isSearching) {
            setSearchQuery("");
        }
        setIsSearching(!isSearching);
        if (!isSearching) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <View style={styles.headerRow}>
            {isSearching ? (
                <View style={styles.searchContainer}>
                    <Search color={theme.accent} size={20} style={styles.searchIcon} />
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder="Поиск по названию..."
                        placeholderTextColor={theme.textDark}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        selectionColor={theme.accent}
                    />
                    <TouchableOpacity onPress={toggleSearch} style={styles.closeButton}>
                        <X size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                        <ChevronLeft size={24} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title}
                    </Text>

                    <View style={styles.headerButton}>
                        <TouchableOpacity onPress={toggleSearch}>
                            <Search size={26} color={theme.accent} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 15,
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
        headerTitle: {
            flex: 1,
            textAlign: "center",
            fontSize: 22,
            fontWeight: "bold",
            color: theme.text,
            marginHorizontal: 10,
        },
        searchContainer: {
            flex: 1,
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
        closeButton: {
            marginLeft: 8,
        },
    });
