const TMDB_API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const RAWG_API_KEY = process.env.EXPO_PUBLIC_RAWG_API_KEY;
const GOOGLE_BOOKS_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_KEY;

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const SHIKIMORI_GRAPHQL_URL = "https://shikimori.one/api/graphql";

// Вспомогательная функция для очистки HTML-тегов
const cleanHtml = (text) => {
    if (!text) return "";

    return text
        .replace(/<[^>]*>?/gm, "") // Чистим HTML: <div>...</div>
        .replace(/\[[^\]]*\]/g, "") // Чистим BBCode: [character=123]...[/character]
        .trim(); // Убираем лишние пробелы по краям
};

// Вспомогательная функция для получения чистого ID без префикса и номера страницы
const getCleanId = (complexId, prefix) =>
    complexId.replace(prefix, "").split("-")[0];

// Универсальный метод для GraphQL запросов к Шикимори
const fetchShikimoriGraphql = async (query, variables = {}) => {
    const res = await fetch(SHIKIMORI_GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "MyMediaApp", // Shikimori требует User-Agent
        },
        body: JSON.stringify({ query, variables }),
    });
    return res.json();
};

export const searchMedia = async (text, category, page = 1) => {
    if (!text || text.length < 3) return [];

    try {
        if (category === "Аниме") {
            const query = `
            query($search: String, $page: Int) {
              animes(search: $search, limit: 15, page: $page, order: popularity) {
                id
                licenseNameRu
                russian
                name
                poster { originalUrl }
              }
            }`;

            const json = await fetchShikimoriGraphql(query, {
                search: text,
                page,
            });
            return json.data.animes.map((item) => ({
                id: `anime-${item.id}-${page}`,
                title: item.licenseNameRu || item.russian || item.name,
                image: item.poster?.originalUrl, // Получаем прямой URL без склейки
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
                    image: item.poster_path
                        ? `${TMDB_IMAGE_URL}${item.poster_path}`
                        : "https://via.placeholder.com/500x750",
                    isMovie: true,
                })) || []
            );
        }

        if (category === "Книги") {
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
                    image:
                        item.background_image ||
                        "https://via.placeholder.com/500x750",
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
            const movieId = getCleanId(id, "movie-");
            const res = await fetch(
                `${TMDB_BASE_URL}/movie/${movieId}?language=ru-RU`,
                { headers: { Authorization: `Bearer ${TMDB_API_KEY}` } },
            );
            const json = await res.json();
            return {
                type: "movie",
                budget:
                    json.budget > 0 ? `$${json.budget.toLocaleString()}` : "?",
                genres: json.genres?.map((g) => g.name) || [],
                originalTitle: json.original_title,
                description: json.overview,
                companies: json.production_companies?.map((c) => c.name) || [],
                countries: json.production_countries?.map((c) => c.name) || [],
                year: json.release_date,
                duration: json.runtime ? `${json.runtime} мин.` : null,
                movieStatus: json.status.toLowerCase(),
                score: json.vote_average?.toFixed(1) || "0.0",
                isMovie: true,
            };
        }

        if (id.startsWith("anime-")) {
            const animeId = getCleanId(id, "anime-");

            const query = `
            query($id: String) {
              animes(ids: $id) {
                id
                licenseNameRu
                russian
                english
                name
                score
                status
                episodes
                episodesAired
                airedOn { date }
                releasedOn { date }
                rating
                duration
                description
                kind
                genres { russian }
                studios { name }
              }
            }`;

            const json = await fetchShikimoriGraphql(query, { id: animeId });
            const data = json.data.animes[0];

            if (!data) throw new Error("Anime not found");

            return {
                type: "anime",
                kind: data.kind,
                score: data.score || "0.0",
                animeStatus: data.status,
                episodes: data.episodes,
                episodesAired: data.episodesAired,
                airedOn: data.airedOn?.date,
                releasedOn: data.releasedOn?.date,
                rating: data.rating,
                englishTitle: data.english, // В GraphQL Шикимори это поле может быть в другом месте, если нужно - добавим
                japaneseTitle: data.name,
                duration: data.duration ? `по ~${data.duration} мин.` : null,
                description: cleanHtml(data.description),
                genres: data.genres?.map((g) => g.russian) || [],
                studios: data.studios?.map((s) => s.name) || [],
                isAnime: true,
            };
        }

        if (id.startsWith("book-")) {
            const bookId = getCleanId(id, "book-");
            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes/${bookId}?hl=ru&key=${GOOGLE_BOOKS_KEY}`,
            );
            const json = await res.json();
            console.log(JSON.stringify(json));
            const info = json.volumeInfo;
            return {
                type: "book",
                authors: info.authors || [],
                publisher: info.publisher,
                year: info.publishedDate,
                pageCount: info.pageCount ? `${info.pageCount} стр.` : null,
                genres: info.categories || [],
                score: info.averageRating || "0.0",
                rating: info.maturityRating,
                description:
                    cleanHtml(info.description) || "Описание отсутствует",
                isBook: true,
            };
        }

        if (id.startsWith("game-")) {
            const gameId = getCleanId(id, "game-");
            const res = await fetch(
                `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`,
            );
            const json = await res.json();
            return {
                type: "game",
                originalTitle: json.name_original,
                score: json.rating?.toFixed(1) || "0.0",
                esrb: json.esrb_rating.name,
                metacritic: json.metacritic,
                year: json.released,
                duration: json.playtime ? `${json.playtime} ч.` : null,
                developers: json.developers?.map((d) => d.name) || [],
                platforms:
                    json.parent_platforms?.map((p) => p.platform.name) || [],
                genres: json.genres?.map((g) => g.name) || [],
                description: cleanHtml(
                    json.description_raw || json.description,
                ),
                isGame: true,
            };
        }
    } catch (e) {
        console.error("Details API Error:", e);
        throw e;
    }
};
