import { getCleanId } from "./helpers";

const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const headers = { Authorization: `Bearer ${TMDB_API_KEY?.trim()}` };

export const tmdbService = {
    // === ФИЛЬМЫ ===
    async search(text, page) {
        const res = await fetch(
            `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(text)}&language=ru-RU&page=${page}`,
            { headers },
        );
        const json = await res.json();
        return (
            json.results?.map((item) => ({
                id: `movie-${item.id}-${page}`,
                title: item.title,
                image: item.poster_path
                    ? `${TMDB_IMAGE_URL}${item.poster_path}`
                    : "https://via.placeholder.com/500x750",
                isMovie: true,
            })) || []
        );
    },

    async getDetails(id) {
        const movieId = getCleanId(id, "movie-");
        const res = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?language=ru-RU`, { headers });
        const json = await res.json();
        return {
            type: "movie",
            budget: json.budget > 0 ? json.budget : "?",
            genres: json.genres?.map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1)) || [],
            originalTitle: json.original_title,
            description: json.overview,
            companies: json.production_companies?.map((c) => c.name) || [],
            countries: json.production_countries?.map((c) => c.name) || [],
            year: json.release_date,
            duration: json.runtime || null,
            movieStatus: json.status.toLowerCase(),
            score: json.vote_average?.toFixed(1) || "0.0",
            isMovie: true,
        };
    },

    // === СЕРИАЛЫ ===
    async searchTV(text, page) {
        const res = await fetch(
            `${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(text)}&language=ru-RU&page=${page}`,
            { headers },
        );
        const json = await res.json();
        return (
            json.results?.map((item) => ({
                id: `tv-${item.id}-${page}`,
                title: item.name,
                image: item.poster_path
                    ? `${TMDB_IMAGE_URL}${item.poster_path}`
                    : "https://via.placeholder.com/500x750",
                isTV: true,
            })) || []
        );
    },

    async getTVDetails(id) {
        const tvId = getCleanId(id, "tv-");
        const res = await fetch(`${TMDB_BASE_URL}/tv/${tvId}?language=ru-RU`, { headers });
        const json = await res.json();
        return {
            type: "tv",
            genres: json.genres?.map((g) => g.name.charAt(0).toUpperCase() + g.name.slice(1)) || [],
            originalTitle: json.original_name,
            description: json.overview,
            companies: json.production_companies?.map((c) => c.name) || [],
            countries: json.origin_country || [],
            first_air_date: json.first_air_date,
            last_air_date: json.last_air_date,
            duration: json.episode_run_time?.[0] || null,
            seasonsCount: json.number_of_seasons || 0,
            episodesCount: json.number_of_episodes || 0,
            movieStatus: json.status.toLowerCase(),
            score: json.vote_average?.toFixed(1) || "0.0",
            isTV: true,
        };
    },
};
