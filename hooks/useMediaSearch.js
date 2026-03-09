import { useState } from "react";
import { searchMedia } from "../services/apiService";

export const useMediaSearch = (initialCategory = "Игры") => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);

    const getCategoryById = (id) => {
        if (id.startsWith("anime-")) return "Аниме";
        if (id.startsWith("game-")) return "Игры";
        if (id.startsWith("book-")) return "Книги";
        return "Фильмы";
    };
    
    const handleSearch = async (text, categoryOverride, isNewSearch = true) => {
        const currentCategory = categoryOverride || activeCategory;
        const searchPage = isNewSearch ? 1 : page + 1;

        if (isNewSearch) {
            setLoading(true);
            setResults([]);
            setIsEnd(false);
            setPage(1);
        } else {
            setLoadingMore(true);
        }

        try {
            const data = await searchMedia(text, currentCategory, searchPage);

            if (data.length === 0) {
                setIsEnd(true);
            } else {
                setResults((prev) => (isNewSearch ? data : [...prev, ...data]));
                setPage(searchPage);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
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
    };
};
