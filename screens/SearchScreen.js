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
                console.log("Запрос к Shikimori (Аниме)... Строка:", text);
                try {
                    const response = await fetch(
                        `https://shikimori.one/api/animes?search=${encodeURIComponent(text)}&limit=15&order=ranked`,
                    );
                    const data = await response.json();

                    if (data && data.length > 0) {
                        formattedData = data.map((item) => ({
                            id: `anime-${item.id}`, // Используем их ID
                            title: item.russian || item.name, // Приоритет русскому названию
                            year: item.aired_on
                                ? item.aired_on.split("-")[0]
                                : "N/A",
                            duration: item.kind
                                ? item.kind.toUpperCase()
                                : "TV",
                            category: item.score ? `★ ${item.score}` : "Anime",
                            image: `https://shikimori.one${item.image.original}`, // Склеиваем URL картинки
                            description:
                                "Нажмите, чтобы прочитать описание на экране деталей...",

                            // Данные для DetailsScreen
                            filmLength: item.episodes
                                ? item.episodes * 24
                                : null,
                            countries: ["Япония"],
                            // У Shikimori в кратком поиске нет жанров, их получим в деталях ниже
                            genres: [],
                        }));
                    }
                } catch (e) {
                    console.error("Ошибка Shikimori:", e);
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
                // console.log("ПОЛНЫЙ ОТВЕТ СЕРВЕРА:", JSON.stringify(json));
                if (json.results) {
                    formattedData = json.results.map((item) => ({
                        id: `movie-${item.id}`,
                        title: item.title,
                        year: item.release_date
                            ? item.release_date.split("-")[0]
                            : "N/A",
                        // TMDB в поиске не отдает страны и длительность (нужен отдельный запрос по ID),
                        // поэтому пока ставим "Movie" или оставляем пустым
                        countries: [],
                        filmLength: null,
                        category: item.vote_average
                            ? `★ ${item.vote_average.toFixed(1)}`
                            : "Movie",
                        image: item.poster_path
                            ? `${TMDB_IMAGE_URL}${item.poster_path}`
                            : "https://via.placeholder.com/500x750",
                        description: item.overview,
                        // TMDB отдает только genre_ids (цифры), названия без доп. запроса не получить
                        // Мы можем либо захардкодить маппер, либо оставить пока так
                        genres: [],
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
                                category: item.id.startsWith("anime-")
                                    ? "Аниме"
                                    : "Фильмы",
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
                        <TouchableOpacity
                            style={{ alignItems: "center" }}
                            onPress={() =>
                                navigation.navigate("AddCard", {
                                    currentSection: "Фильмы",
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
