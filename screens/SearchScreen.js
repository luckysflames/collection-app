import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MediaCard } from "../components/MediaCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchMedia } from "../services/apiService";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Игры");
    const insets = useSafeAreaInsets();

    const handleSearch = async (text, categoryOverride) => {
        const currentCategory = categoryOverride || activeCategory;
        if (!text || text.length < 3) return;

        setLoading(true);
        setResults([]); // Очищаем старые результаты сразу

        try {
            // Вызываем ИМПОРТИРОВАННУЮ функцию
            const data = await searchMedia(text, currentCategory);
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Чипсы категорий */}
            <View style={styles.categoryToggle}>
                {["Игры", "Фильмы", "Аниме", "Книги"].map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => {
                            setActiveCategory(cat);
                            // Если в строке уже что-то есть, сразу ищем в новой категории
                            if (query.length >= 3) handleSearch(query, cat);
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

            {/* Поисковая строка */}
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Что ищем?"
                    placeholderTextColor="#8E94A4"
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    onSubmitEditing={() => handleSearch(query)}
                />
                <TouchableOpacity onPress={() => handleSearch(query)}>
                    <Ionicons name="search" size={22} color="#7D8AFF" />
                </TouchableOpacity>
            </View>
            {query.length === 0 && (
                <View style={styles.content}>
                    <LinearGradient
                        colors={["#1E293B", "#0F172A"]}
                        style={styles.card}
                    >
                        <Ionicons
                            name="search"
                            size={64}
                            color="#7D8AFF"
                            style={styles.icon}
                        />

                        <Text style={styles.title}>Предупреждение</Text>

                        <Text style={styles.subtitle}>
                            Мы не отвечаем за результаты поиска. Подробнее
                            "Настройки" &gt; "Используемые API"
                        </Text>
                    </LinearGradient>
                </View>
            )}

            {loading && (
                <ActivityIndicator color="#7D8AFF" style={{ marginTop: 20 }} />
            )}

            <FlatList
                data={results}
                renderItem={({ item }) => (
                    <MediaCard
                        item={item}
                        onPress={() => {
                            let finalCategory = "Фильмы"; // значение по умолчанию
                            if (item.id.startsWith("anime-"))
                                finalCategory = "Аниме";
                            else if (item.id.startsWith("game-"))
                                finalCategory = "Игры";
                            else if (item.id.startsWith("book-"))
                                finalCategory = "Книги";

                            navigation.navigate("Details", {
                                item,
                                category: finalCategory,
                            });
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
                ListEmptyComponent={() =>
                    !loading &&
                    query.length > 2 && (
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() =>
                                navigation.navigate("AddCard", {
                                    currentSection: activeCategory,
                                })
                            }
                        >
                            <Text
                                style={{
                                    color: "#8E94A4",
                                    textAlign: "center",
                                    marginVertical: 10,
                                    paddingHorizontal: 20,
                                }}
                            >
                                Не нашли то, что искали? Добавьте это в свою
                                коллекцию вручную!
                            </Text>
                            <Ionicons
                                name="add-circle-outline"
                                size={30}
                                color="#7D8AFF"
                            />
                        </TouchableOpacity>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
        paddingTop: 60, // Отступ под челку
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
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    searchBarContainer: {
        marginHorizontal: 16,
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
    searchIcon: {
        marginLeft: 10,
    },
    content: {
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    card: {
        width: "100%",
        padding: 10,
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)", // Тонкая светящаяся рамка
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: "#8E94A4",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
});
