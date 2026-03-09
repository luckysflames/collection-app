const TMDB_API_KEY =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4MDQwZTBlNzQ0MDhlNTdiZTVhZDExNGY4MmNmNmVjNCIsIm5iZiI6MTc3MjcxMDQ2OC4xMjUsInN1YiI6IjY5YTk2YTQ0MTY0ZTYwMmU3YTY3NDM5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WfGXhKlgAx9fQl9xWgM87-pKbCgS9OyuhDiUwDpNd9M";
const RAWG_API_KEY = "4a270ac5de644430902fb6609603359b";
const GOOGLE_BOOKS_KEY = "AIzaSyDUOOaFsxvegjpuz12P4QJAvw_NAzVGOww";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const cleanHtml = (text) => text?.replace(/<[^>]*>?/gm, "") || "";

export const searchMedia = async (text, category, page = 1) => {
    if (!text || text.length < 3) return [];

    try {
        if (category === "Аниме") {
            // Shikimori использует параметр page
            const res = await fetch(
                `https://shikimori.one/api/animes?search=${encodeURIComponent(text)}&limit=15&page=${page}&order=ranked`,
            );
            const data = await res.json();
            return data.map((item) => ({
                id: `anime-${item.id}-${page}`, // Добавляем page в id для уникальности ключей
                title: item.russian || item.name,
                year: item.aired_on?.split("-")[0] || "N/A",
                category: item.score ? `★ ${item.score}` : "Anime",
                image: `https://shikimori.one${item.image.original}`,
                description: "Нажмите для подробностей...",
                isAnime: true,
            }));
        }

        if (category === "Фильмы") {
            const res = await fetch(
                `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(text)}&language=ru-RU&page=${page}`,
                { headers: { Authorization: `Bearer ${TMDB_API_KEY.trim()}` } },
            );
            const json = await res.json();
            return (
                json.results?.map((item) => ({
                    id: `movie-${item.id}-${page}`,
                    title: item.title,
                    year: item.release_date?.split("-")[0] || "N/A",
                    category: item.vote_average
                        ? `★ ${item.vote_average.toFixed(1)}`
                        : "Movie",
                    image: item.poster_path
                        ? `${TMDB_IMAGE_URL}${item.poster_path}`
                        : "https://via.placeholder.com/500x750",
                    description: item.overview,
                    isMovie: true,
                })) || []
            );
        }

        if (category === "Книги") {
            // Google Books использует startIndex (page * maxResults)
            const maxResults = 15;
            const startIndex = (page - 1) * maxResults;
            const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(text)}&maxResults=${maxResults}&startIndex=${startIndex}&hl=ru&key=${GOOGLE_BOOKS_KEY}`;
            const res = await fetch(url);
            const json = await res.json();
            return (
                json.items?.map((item) => ({
                    id: `book-${item.id}-${page}`,
                    title: item.volumeInfo.title,
                    year: item.volumeInfo.publishedDate?.split("-")[0] || "N/A",
                    category: "Книга",
                    image:
                        item.volumeInfo.imageLinks?.thumbnail?.replace(
                            "http:",
                            "https:",
                        ) || "https://via.placeholder.com/500x750",
                    description: cleanHtml(item.volumeInfo.description),
                    isBook: true,
                })) || []
            );
        }

        if (category === "Игры") {
            const res = await fetch(
                `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(text)}&page_size=15&page=${page}&search_precise=true`,
            );
            const json = await res.json();
            return (
                json.results?.map((item) => ({
                    id: `game-${item.id}-${page}`,
                    title: item.name,
                    year: item.released?.split("-")[0] || "N/A",
                    category: item.rating ? `★ ${item.rating}` : "Game",
                    image:
                        item.background_image ||
                        "https://via.placeholder.com/500x750",
                    description: "Нажмите для подробностей...",
                    isGame: true,
                })) || []
            );
        }
    } catch (e) {
        console.error("Search API Error:", e);
        return [];
    }
};

export const fetchDetailsById = async (id) => {
    try {
        if (id.startsWith("movie-")) {
            const res = await fetch(
                `${TMDB_BASE_URL}/movie/${id.replace("movie-", "")}?language=ru-RU`,
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
                isMovie: true,
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
                isAnime: true,
            };
        }

        if (id.startsWith("book-")) {
            const bookId = id.replace("book-", "");
            // Убираем лишние префиксы, если они попали в ID при пагинации
            const cleanId = bookId.split("-")[0];

            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${cleanId}?hl=ru&key=${GOOGLE_BOOKS_KEY}`,
            );
            const json = await res.json();

            // ПРОВЕРКА: Если API вернуло ошибку (например, 404)
            if (!json || json.error || !json.volumeInfo) {
                console.error(
                    "Google Books Details Error:",
                    json?.error?.message || "No volumeInfo",
                );
                return {
                    description: "Информация временно недоступна",
                    year: "N/A",
                    genres: [],
                    countries: ["Неизвестен"],
                };
            }

            const info = json.volumeInfo;

            return {
                // Используем опциональную цепочку ?. и проверку на существование
                filmLength: info?.pageCount ? `${info.pageCount} стр.` : null,
                countries: info?.authors || [
                    info?.publisher || "Автор не указан",
                ],
                genres: info?.categories || [],
                year: info?.publishedDate?.split("-")[0],
                description:
                    info?.description?.replace(/<[^>]*>?/gm, "") ||
                    "Описание отсутствует",
                isBook: true,
            };
        }

        if (id.startsWith("game-")) {
            const gameId = id.replace("game-", "");
            const res = await fetch(
                `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`,
            );
            const json = await res.json();
            return {
                filmLength: json.playtime ? `${json.playtime} ч.` : null,
                countries: json.developers?.map((d) => d.name) || [],
                genres: json.genres?.map((g) => g.name) || [],
                year: json.released?.split("-")[0],
                description:
                    json.description_raw ||
                    json.description?.replace(/<[^>]*>?/gm, ""),
                isGame: true,
            };
        }
    } catch (e) {
        console.error("Details API Error:", e);
        throw e;
    }
};
