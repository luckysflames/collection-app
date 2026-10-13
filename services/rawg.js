import { cleanHtml, getCleanId } from "./helpers";

const RAWG_API_KEY = process.env.EXPO_PUBLIC_RAWG_API_KEY;

export const rawgService = {
    async search(text, page) {
        const res = await fetch(
            `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(text)}&page_size=15&page=${page}&search_precise=true`,
        );
        const json = await res.json();
        return (
            json.results?.map((item) => ({
                id: `game-${item.id}-${page}`,
                title: item.name,
                image: item.background_image || null,
                isGame: true,
            })) || []
        );
    },

    async getDetails(id) {
        const gameId = getCleanId(id, "game-");
        const res = await fetch(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
        const json = await res.json();
        return {
            type: "game",
            originalTitle: json.name_original,
            score: ((json.rating || 0) * 2).toFixed(1) || "0.0",
            esrb: json.esrb_rating?.name || "N/A",
            metacritic: json.metacritic,
            year: json.released,
            duration: json.playtime || null,
            developers: json.developers?.map((d) => d.name) || [],
            platforms: json.parent_platforms?.map((p) => p.platform.name) || [],
            genres: json.genres?.map((g) => g.name) || [],
            description: cleanHtml(json.description_raw || json.description),
            isGame: true,
        };
    },
};
