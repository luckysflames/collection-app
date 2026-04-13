import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SearchHeader = ({
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    onSearch,
}) => {
    const categories = ["Игры", "Фильмы", "Аниме", "Книги"];

    const handleClear = () => {
        setQuery("");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Поиск</Text>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Что ищем?"
                    placeholderTextColor="#8E94A4"
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    onSubmitEditing={() => onSearch(query)}
                />

                {query.length > 0 && (
                    <TouchableOpacity
                        onPress={handleClear}
                        style={styles.clearIcon}
                    >
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color="#8E94A4"
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => onSearch(query)}>
                    <Ionicons name="search" size={22} color="#7D8AFF" />
                </TouchableOpacity>
            </View>

            <View style={styles.categoryToggle}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => {
                            setActiveCategory(cat);
                            if (query.length >= 3) onSearch(query, cat);
                        }}
                        style={[
                            styles.miniChip,
                            activeCategory === cat && styles.activeMiniChip,
                        ]}
                    >
                        <Text
                            style={[
                                styles.miniChipText,
                                activeCategory === cat &&
                                    styles.activeMiniChipText,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
    },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    searchBarContainer: {
        marginBottom: 10,
        height: 50,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    searchInput: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },
    clearIcon: {
        marginHorizontal: 10,
    },
    categoryToggle: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 15,
    },
    miniChip: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        marginHorizontal: 5,
    },
    activeMiniChip: {
        backgroundColor: "#7D8AFF",
    },
    miniChipText: {
        color: "#8E94A4",
        fontSize: 12,
    },
    activeMiniChipText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
