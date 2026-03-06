import React, { useState, useCallback } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    FlatList,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import debounce from "lodash.debounce";
import { Ionicons } from "@expo/vector-icons";
import { MediaCard } from "../components/MediaCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TMDB_API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDQwZTBlNzQ0MDhlNTdiZTVhZDExNGY4MmNmNmVjNCIsIm5iZiI6MTc3MjcxMDQ2OC4xMjUsInN1YiI6IjY5YTk2YTQ0MTY0ZTYwMmU3YTY3NDM5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WfGXhKlgAx9fQl9xWgM87-pKbCgS9OyuhDiUwDpNd9M";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export default function SearchScreen({ navigation }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Аниме");
    const insets = useSafeAreaInsets();

    const searchMedia = async (text, categoryOverride) => {
        // Берем категорию либо из аргумента (для чипсов), либо из стейта
        const currentCategory = categoryOverride || activeCategory;

        if (!text || text.length < 3) return;

        setLoading(true);
        setResults([]); // Очищаем старые результаты перед новым поиском

        try {
            let formattedData = [];
            console.log(`Ищем: ${text} в категории: ${currentCategory}`);

            if (currentCategory === "Аниме") {
                console.log("Запрос к Jikan (Аниме)...");
                const response = await fetch(
                    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=15`,
                );

                if (response.status === 429) {
                    console.warn(
                        "Jikan: Слишком много запросов (Rate Limit). Подожди секунду.",
                    );
                    return;
                }

                const json = await response.json();
                console.log("ПОЛНЫЙ ОТВЕТ СЕРВЕРА:", JSON.stringify(json));

                if (json.data) {
                    formattedData = json.data.map((item) => ({
                        id: `anime-${item.mal_id}`,
                        title: item.title_english || item.title,
                        duration: item.type || "TV",
                        category: item.score ? `★ ${item.score}` : "Anime",
                        image:
                            item.images.jpg.large_image_url ||
                            item.images.jpg.image_url,
                        description: item.synopsis,
                    }));
                }
            } else if (currentCategory === "Фильмы") {
                const response = await fetch(
                    `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(text)}&language=ru-RU`,
                    {
                        headers: {
                            Authorization: `Bearer ${TMDB_API_KEY.trim()}`,
                        },
                    },
                );
                const json = await response.json();
                if (json.results) {
                    formattedData = json.results.map((item) => ({
                        id: `movie-${item.id}`,
                        title: item.title,
                        duration: item.release_date
                            ? item.release_date.split("-")[0]
                            : "N/A",
                        category: item.vote_average
                            ? `★ ${item.vote_average.toFixed(1)}`
                            : "Movie",
                        image: item.poster_path
                            ? `${TMDB_IMAGE_URL}${item.poster_path}`
                            : "https://via.placeholder.com/500x750",
                        description: item.overview,
                    }));
                }
            }
            setResults(formattedData);
        } catch (error) {
            console.error("Ошибка поиска:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Чипсы категорий */}
            <View style={styles.categoryToggle}>
                {["Аниме", "Фильмы"].map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => {
                            setActiveCategory(cat);
                            // Если в строке уже что-то есть, сразу ищем в новой категории
                            if (query.length >= 3) searchMedia(query, cat);
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
                    onSubmitEditing={() => searchMedia(query)}
                />
                <TouchableOpacity onPress={() => searchMedia(query)}>
                    <Ionicons name="search" size={22} color="#7D8AFF" />
                </TouchableOpacity>
            </View>

            {loading && (
                <ActivityIndicator color="#7D8AFF" style={{ marginTop: 20 }} />
            )}

            <FlatList
                data={results}
                renderItem={({ item }) => (
                    <MediaCard
                        item={item}
                        onPress={() =>
                            navigation.navigate("Details", {
                                item,
                                category: activeCategory,
                            })
                        }
                    />
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
                ListEmptyComponent={() =>
                    !loading &&
                    query.length > 2 && (
                        <Text
                            style={{
                                color: "#8E94A4",
                                textAlign: "center",
                                marginTop: 20,
                                paddingHorizontal: 20,
                            }}
                        >
                            Вы не нажали кнопочку или по Вашему запросу ничего
                            не найдено
                        </Text>
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
});
