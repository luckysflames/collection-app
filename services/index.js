import { tmdbService } from "./tmdb";
import { shikimoriMangaService, shikimoriService } from "./shikimori";
import { googleBooksService } from "./googleBooks";
import { rawgService } from "./rawg";

export const searchMedia = async (text, category, page = 1) => {
    if (!text || text.length < 1) return [];

    const lowerCategory = category.toLowerCase();

    try {
        switch (lowerCategory) {
            case "аниме":
            case "anime":
                return await shikimoriService.search(text, page);
            case "манга":
            case "manga":
                return await shikimoriMangaService.search(text, page);
            case "фильмы":
            case "movie":
                return await tmdbService.search(text, page);
            case "сериалы":
            case "tv":
                return await tmdbService.searchTV(text, page);
            case "книги":
            case "book":
                return await googleBooksService.search(text, page);
            case "игры":
            case "game":
                return await rawgService.search(text, page);
            default:
                return [];
        }
    } catch (e) {
        console.error(`Search API Error [${category}]:`, e);
        return [];
    }
};

export const fetchDetailsById = async (id) => {
    try {
        if (id.startsWith("movie-")) return await tmdbService.getDetails(id);
        if (id.startsWith("tv-")) return await tmdbService.getTVDetails(id);
        if (id.startsWith("anime-")) return await shikimoriService.getDetails(id);
        if (id.startsWith("manga-")) return await shikimoriMangaService.getDetails(id);
        if (id.startsWith("book-")) return await googleBooksService.getDetails(id);
        if (id.startsWith("game-")) return await rawgService.getDetails(id);

        throw new Error("Unknown media type");
    } catch (e) {
        console.error("Details API Error:", e);
        throw e;
    }
};
