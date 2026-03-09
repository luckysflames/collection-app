import { useState } from "react";
import { searchMedia } from "../services/apiService";

export const useMediaSearch = (initialCategory = "Игры") => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const handleSearch = async (text, categoryOverride) => {
        const currentCategory = categoryOverride || activeCategory;
        if (!text || text.length < 3) return;

        setLoading(true);
        setResults([]);

        try {
            const data = await searchMedia(text, currentCategory);
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryById = (id) => {
        if (id.startsWith("anime-")) return "Аниме";
        if (id.startsWith("game-")) return "Игры";
        if (id.startsWith("book-")) return "Книги";
        return "Фильмы";
    };

    return {
        query,
        setQuery,
        results,
        loading,
        activeCategory,
        setActiveCategory,
        handleSearch,
        getCategoryById,
    };
};
