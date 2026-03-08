const TMDB_API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDQwZTBlNzQ0MDhlNTdiZTVhZDExNGY4MmNmNmVjNCIsIm5iZiI6MTc3MjcxMDQ2OC4xMjUsInN1YiI6IjY5YTk2YTQ0MTY0ZTYwMmU3YTY3NDM5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WfGXhKlgAx9fQl9xWgM87-pKbCgS9OyuhDiUwDpNd9M";
export const fetchDetailsById = async (id) => {
    try {
        if (id.startsWith("movie-")) {
            const movieId = id.replace("movie-", "");
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movieId}?language=ru-RU`,
                {
                    headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
                },
            );
            const json = await res.json();
            return {
                filmLength: json.runtime,
                countries: json.production_countries?.map((c) => c.name) || [],
                genres: json.genres?.map((g) => g.name) || [],
                year: json.release_date?.split("-")[0],
                description: json.overview,
            };
        }

        if (id.startsWith("anime-")) {
            const animeId = id.replace("anime-", "");
            const res = await fetch(
                `https://shikimori.one/api/animes/${animeId}`,
            );
            const json = await res.json();
            return {
                filmLength:
                    json.duration ||
                    (json.episodes && json.episodes_aired
                        ? json.episodes * json.episodes_aired
                        : null),
                countries: ["Япония"],
                genres: json.genres?.map((g) => g.russian || g.name) || [],
                year: json.aired_on?.split("-")[0],
                description: json.description_html
                    ? json.description_html.replace(/<[^>]*>?/gm, "")
                    : json.description,
            };
        }

        return null;
    } catch (e) {
        console.error("Ошибка в apiService:", e);
        throw e;
    }
};
