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
    query,
    setQuery,
    onSearch,
    handleReset,
    topInset,
}) => {
    const { sectionName } = useMediaCategories(activeCategory);

    return (
        <View style={[styles.wrapper, { paddingTop: topInset - 20 }]}>
            <View style={styles.headerContainer}>
                {/* Кнопка назад */}
                <TouchableOpacity
                    onPress={handleReset}
                    style={styles.backButton}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>

                {/* Заголовок теперь в обертке для контроля высоты */}
                <View style={styles.titleWrapper}>
                    <Text style={styles.header} numberOfLines={1}>
                        Поиск {sectionName}
                    </Text>
                </View>
            </View>

            {/* Поиск */}
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
                        onPress={() => setQuery("")}
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
    wrapper: {
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center", // Выравнивает элементы по центральной оси
        marginBottom: 20,
        height: 45, // Явно задаем высоту, равную высоте кнопки назад
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
    titleWrapper: {
        flex: 1,
        justifyContent: "center", // Центрируем текст внутри той же высоты, что и кнопка
        marginLeft: 15, // Заменяем gap на понятный отступ
    },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        // Убираем лишние отступы самого шрифта, если они есть
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    searchBarContainer: {
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
