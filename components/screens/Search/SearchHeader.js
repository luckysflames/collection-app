import React from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMediaCategories } from "../../../hooks/useMediaCategories";
import { ChevronLeft } from "lucide-react-native";

export const SearchHeader = ({
    activeCategory,
    setActiveCategory,
    query,
    setQuery,
    onSearch,
    handleReset,
}) => {
    const { sectionName } = useMediaCategories(activeCategory);

    const handleClear = () => {
        setQuery("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Кнопка назад к категориям */}
                <TouchableOpacity
                    onPress={handleReset}
                    style={[styles.backButton]}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.header}>Поиск {sectionName}</Text>
            </View>

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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        marginBottom: 20,
    },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    backButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
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
});
