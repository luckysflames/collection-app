import { useState, useRef, useCallback } from "react";
import { searchMedia } from "../services/apiService";
import { Keyboard } from "react-native";

export const useMediaSearch = (initialCategory = "game") => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const [lastSearchedQuery, setLastSearchedQuery] = useState("");

    const searchCache = useRef({});

    const getCategoryById = (id) => {
        if (id.startsWith("anime-")) return "anime";
        if (id.startsWith("game-")) return "game";
        if (id.startsWith("book-")) return "book";
        return "movie";
    };

    const handleSearch = useCallback(
        async (text, categoryOverride, isNewSearch = true) => {
            const sanitizedText = text?.trim() || "";
            if (sanitizedText.length < 1) return;

            const currentCategory = categoryOverride || activeCategory;
            const cacheKey = `${currentCategory}-${sanitizedText.toLowerCase()}`;

            if (isNewSearch) {
                setLastSearchedQuery(sanitizedText);
                Keyboard.dismiss();

                // ВАЖНО: Очищаем текущие результаты немедленно,
                // чтобы не было визуального смешивания при переключении
                setResults([]);

                if (searchCache.current[cacheKey]) {
                    const cached = searchCache.current[cacheKey];
                    // Устанавливаем данные из кэша
                    setResults(cached.results);
                    setPage(cached.page);
                    setIsEnd(cached.isEnd);
                    setLoading(false);
                    return;
                }

                setLoading(true);
                setIsEnd(false);
                setPage(1);
            } else {
                if (isEnd || loadingMore) return;
                setLoadingMore(true);
            }

            const searchPage = isNewSearch ? 1 : page + 1;

            try {
                const data = await searchMedia(
                    sanitizedText,
                    currentCategory,
                    searchPage,
                );

                // Еще одна проверка: не сменил ли пользователь категорию, пока шел запрос?
                // Сравниваем currentCategory с той, что сейчас в стейте (если она не передана принудительно)
                // Но так как мы передаем categoryOverride, мы доверяем cacheKey

                if (data.length === 0) {
                    setIsEnd(true);
                    if (searchCache.current[cacheKey]) {
                        searchCache.current[cacheKey].isEnd = true;
                    }
                } else {
                    const updatedResults = isNewSearch
                        ? data
                        : [...results, ...data];

                    // Сохраняем в кэш ПЕРЕД установкой в стейт
                    searchCache.current[cacheKey] = {
                        results: updatedResults,
                        page: searchPage,
                        isEnd: data.length < 10,
                    };

                    // Устанавливаем результаты
                    setResults(updatedResults);
                    setPage(searchPage);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [activeCategory, page, isEnd, loadingMore, results], // Добавлен results в зависимости
    );

    const clearCache = () => {
        searchCache.current = {};
        setResults([]);
    };

    return {
        query,
        setQuery,
        results,
        loading,
        loadingMore,
        activeCategory,
        setActiveCategory,
        handleSearch,
        isEnd,
        getCategoryById,
        lastSearchedQuery,
        clearCache,
    };
};
