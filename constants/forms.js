export const INITIAL_FORM_STATE = {
    type: "movie",
    title: "",
    extraTitles: [""],
    year: "",
    genres: "",
    description: "",
    status: "Без статуса",
    image: null,
    budget: "",
    movieStatus: "ended",
    countries: "",
    companies: "",
    originalTitle: "",
    englishTitle: "",
    japaneseTitle: "",
    animeKind: "tv",
    rating: "pg_13",
    animeStatus: "ongoing",
    airedOn: "",
    releasedOn: "",
    episodes: "",
    episodesAired: "",
    studios: "",
    pageCount: "",
    maturityRating: "not_mature",
    authors: "",
    publisher: "",
    metacritic: "",
    esrb: "e",
    developers: "",
    platforms: "",
    duration: "",
    seasons: "",
    userScore: 0,
};

// Рейтинги аниме (из Shikimori)
export const ANIME_RATINGS = [
    { id: "none", label: "Без рейтинга" },
    { id: "g", label: "G" }, // 0+
    { id: "pg", label: "PG" }, // 6+
    { id: "pg_13", label: "PG-13" }, // 13+
    { id: "r", label: "R" }, // 17+
    { id: "r_plus", label: "R+" }, // 21+
    { id: "rx", label: "Rx" }, // hentai
];

// Типы аниме (kind)
export const ANIME_KINDS = [
    { id: "tv", label: "ТВ" },
    { id: "movie", label: "Фильм" },
    { id: "ova", label: "OVA" },
    { id: "ona", label: "ONA" },
    { id: "special", label: "Спешл" },
    { id: "tv_special", label: "ТВ-Спешл" },
    { id: "music", label: "Клип" },
    { id: "pv", label: "Промо" },
    { id: "cm", label: "Реклама" },
];

// Статусы аниме
export const ANIME_STATUSES = [
    { id: "ongoing", label: "Онгоинг" },
    { id: "released", label: "Вышло" },
    { id: "anons", label: "Анонсировано" },
];

// Статусы фильмов
export const MOVIE_STATUSES = [
    { id: "rumored", label: "Слухи" },
    { id: "planned", label: "Планируется" },
    { id: "in production", label: "В производстве" },
    { id: "post production", label: "Пост-продакшн" },
    { id: "ended", label: "Вышло" },
    { id: "released", label: "Вышло" },
    { id: "canceled", label: "Отменено" },
];

// Рейтинги ESRB для игр
export const ESRB_RATINGS = [
    { id: "ec", label: "EC (Early Childhood)" },
    { id: "e", label: "E (Everyone)" },
    { id: "e10", label: "E10+ (Everyone 10+)" },
    { id: "t", label: "T (Teen)" },
    { id: "m", label: "M (Mature 17+)" },
    { id: "ao", label: "AO (Adults Only 18+)" },
    { id: "rp", label: "RP (Rating Pending)" },
];

// Список игровых платформ для выбора при заполнении карточки
export const GAME_PLATFORMS = [
    { id: "PC", label: "PC" },
    { id: "PlayStation 5", label: "PlayStation 5" },
    { id: "PlayStation 4", label: "PlayStation 4" },
    { id: "Xbox Series X|S", label: "Xbox Series X|S" },
    { id: "Xbox One", label: "Xbox One" },
    { id: "Nintendo Switch", label: "Nintendo Switch" },
    { id: "Nintendo Wii", label: "Nintendo Wii" },
    { id: "Mobile", label: "Mobile" },
    { id: "Steam Deck", label: "Steam Deck" },
    { id: "Web", label: "Web" },
];

// Возрастные рейтинги для книг
export const BOOK_MATURITY_RATINGS = [
    { id: "not_mature", label: "Для всех" },
    { id: "teen", label: "Для подростков (12+)" },
    { id: "mature", label: "Взрослые (18+)" },
];
