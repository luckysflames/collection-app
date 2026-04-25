/**
 * --- ИКОНКИ И НАВИГАЦИЯ ---
 */

export const TAB_ICONS = {
    Поиск: {
        active: require("./assets/icons/search(active).png"),
        inactive: require("./assets/icons/search(inactive).png"),
    },
    Создать: {
        active: require("./assets/icons/add(active).png"),
        inactive: require("./assets/icons/add(inactive).png"),
    },
    Настройки: {
        active: require("./assets/icons/settings(active).png"),
        inactive: require("./assets/icons/settings(inactive).png"),
    },
    Коллекция: {
        active: require("./assets/icons/collection(active).png"),
        inactive: require("./assets/icons/collection(inactive).png"),
    },
};

export const SUB_CATEGORIES = [
    {
        id: "game",
        label: "Игры",
        active: require("./assets/icons/game(active).png"),
        inactive: require("./assets/icons/game(inactive).png"),
    },
    {
        id: "movie",
        label: "Фильмы",
        active: require("./assets/icons/movie(active).png"),
        inactive: require("./assets/icons/movie(inactive).png"),
    },
    {
        id: "anime",
        label: "Аниме",
        active: require("./assets/icons/anime(active).png"),
        inactive: require("./assets/icons/anime(inactive).png"),
    },
    {
        id: "book",
        label: "Книги",
        active: require("./assets/icons/book(active).png"),
        inactive: require("./assets/icons/book(inactive).png"),
    },
];

/**
 * --- СЕКЦИИ И МАППИНГ ---
 */

export const SECTION_MAPPING = {
    movie: "Movies",
    book: "Books",
    game: "Games",
    anime: "Anime",
};

export const SECTIONS = [
    { id: "movie", label: "Фильмы" },
    { id: "anime", label: "Аниме" },
    { id: "book", label: "Книги" },
    { id: "game", label: "Игры" },
];

/**
 * --- СТАТУСЫ И ПРАВИЛА ---
 */

export const FAVORITE_STATUS = "Избранное";
export const DEFAULT_FALLBACK_STATUS = "В планах";

export const SYSTEM_STATUSES = ["Всё", "Папки"];
export const STATUS_SELECTION_EXCLUDE = [...SYSTEM_STATUSES];
export const PROTECTED_STATUSES = [...SYSTEM_STATUSES, FAVORITE_STATUS];

export const DEFAULT_STATUS_BY_SECTION = {
    Movies: "Смотрю",
    Anime: "Смотрю",
    Books: "Читаю",
    Games: "Играю",
};

export const DEFAULT_STATUSES = {
    Movies: [
        "Всё",
        "Папки",
        FAVORITE_STATUS,
        "Смотрю",
        "В планах",
        "Просмотрено",
        "Пересматриваю",
        "Брошено",
        "Отложено",
    ],
    Books: [
        "Всё",
        "Папки",
        FAVORITE_STATUS,
        "Читаю",
        "В планах",
        "Прочитано",
        "Перечитываю",
        "Брошено",
        "Отложено",
    ],
    Games: [
        "Всё",
        "Папки",
        FAVORITE_STATUS,
        "Играю",
        "В планах",
        "Прошёл",
        "Переигрываю",
        "Брошено",
        "Отложено",
    ],
    Anime: [
        "Всё",
        "Папки",
        FAVORITE_STATUS,
        "Смотрю",
        "В планах",
        "Просмотрено",
        "Пересматриваю",
        "Брошено",
        "Отложено",
    ],
};

/**
 * --- ФОРМЫ И ДАННЫЕ ---
 */

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
    movieStatus: "released",
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
    maturity: "not_mature",
    authors: "",
    publisher: "",
    metacritic: "",
    esrb: "e",
    developers: "",
    platforms: "",
    duration: "",
    userScore: 0,
};

/**
 * --- СОРТИРОВКА ---
 */

export const SORT_LABELS = {
    newest: "Сначала новые",
    oldest: "Сначала старые",
    rating_desc: "Сначала лучшие",
    rating_asc: "Сначала худшие",
    alphabet_asc: "От А до Я",
    alphabet_desc: "От Я до А",
};

export const SORT_TYPES = [
    { id: "date", label: "По дате", icon: "Clock" },
    { id: "rating", label: "По рейтингу", icon: "Star" },
    { id: "alphabet", label: "По алфавиту", icon: "CaseSensitive" },
];

export const SORT_SUB_OPTIONS = {
    date: [
        { id: "newest", label: "Сначала новые", icon: "ArrowDownWideNarrow" },
        { id: "oldest", label: "Сначала старые", icon: "ArrowUpNarrowWide" },
    ],
    rating: [
        { id: "rating_desc", label: "Сначала лучшие", icon: "Star" },
        { id: "rating_asc", label: "Сначала худшие", icon: "StarOff" },
    ],
    alphabet: [
        { id: "alphabet_asc", label: "От А до Я", icon: "ArrowDownAZ" },
        { id: "alphabet_desc", label: "От Я до А", icon: "ArrowUpAZ" },
    ],
};

/**
 * --- ВНЕШНИЕ СЕРВИСЫ ---
 */

export const API_SERVICES = [
    {
        name: "RAWG API",
        desc: "Крупнейшая база видеоигр. Скриншоты, даты выхода и платформы.",
        url: "https://rawg.io/apidocs",
        icon: "game-controller-outline",
    },
    {
        name: "TMDB API",
        desc: "Информация о фильмах и сериалах: постеры, трейлеры и рейтинги.",
        url: "https://www.themoviedb.org",
        icon: "film-outline",
    },
    {
        name: "Shikimori",
        desc: "Энциклопедия аниме и манги с огромным комьюнити.",
        url: "https://shikimori.one",
        icon: "leaf-outline",
    },
    {
        name: "Google Books",
        desc: "Поиск книг по названию, автору или ISBN по всему миру.",
        url: "https://books.google.com",
        icon: "book-outline",
    },
];

/**
 * --- ОГРАНИЧЕННЫЕ ЗНАЧЕНИЯ ПОЛЕЙ ---
 */

// Рейтинги аниме (из Shikimori)
export const ANIME_RATINGS = [
    { id: "g", label: "G" },
    { id: "pg", label: "PG" },
    { id: "pg_13", label: "PG-13" },
    { id: "r", label: "R" },
    { id: "r_plus", label: "R+" },
    { id: "rx", label: "Rx" },
];

// Типы аниме (kind)
export const ANIME_KINDS = [
    { id: "tv", label: "ТВ" },
    { id: "movie", label: "Фильм" },
    { id: "ova", label: "OVA" },
    { id: "ona", label: "ONA" },
    { id: "special", label: "Спешл" },
    { id: "music", label: "Клип" },
];

// Статусы аниме
export const ANIME_STATUSES = [
    { id: "ongoing", label: "Онгоинг" },
    { id: "released", label: "Вышло" },
    { id: "anounced", label: "Анонсировано" },
];

// Статусы фильмов
export const MOVIE_STATUSES = [
    { id: "rumored", label: "Слухи" },
    { id: "planned", label: "Планируется" },
    { id: "in_production", label: "В производстве" },
    { id: "post_production", label: "Пост-продакшн" },
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

// Возрастные рейтинги для книг
export const BOOK_MATURITY_RATINGS = [
    { id: "not_mature", label: "Для всех" },
    { id: "teen", label: "Для подростков (13+)" },
    { id: "mature", label: "Взрослые (18+)" },
];

/**
 * --- ФИЛЬТРЫ (зависят от типа раздела) ---
 */

export const FILTER_CONFIG = {
    movie: [
        {
            id: "movieStatus",
            label: "Статус",
            type: "select",
            options: MOVIE_STATUSES,
            icon: "Activity",
        },
        {
            id: "year",
            label: "Год выпуска",
            type: "range",
            min: 1900,
            max: new Date().getFullYear() + 5,
            icon: "Calendar",
        },
        {
            id: "budget",
            label: "Бюджет ($)",
            type: "range",
            min: 0,
            max: 1000000000,
            icon: "DollarSign",
        },
        {
            id: "duration",
            label: "Длительность (мин)",
            type: "range",
            min: 0,
            max: 600,
            icon: "Clock",
        },
    ],
    anime: [
        {
            id: "animeKind",
            label: "Тип",
            type: "select",
            options: ANIME_KINDS,
            icon: "Shapes",
        },
        {
            id: "animeStatus",
            label: "Статус",
            type: "select",
            options: ANIME_STATUSES,
            icon: "Activity",
        },
        {
            id: "rating",
            label: "Возрастной рейтинг",
            type: "select",
            options: ANIME_RATINGS,
            icon: "Banana",
        },
        {
            id: "year",
            label: "Год выпуска",
            type: "range",
            min: 1917,
            max: new Date().getFullYear() + 5,
            icon: "Calendar",
        },
        {
            id: "episodes",
            label: "Эпизодов",
            type: "range",
            min: 1,
            max: 200,
            icon: "Tv",
        },
        {
            id: "duration",
            label: "Длител. эпизода (мин)",
            type: "range",
            min: 1,
            max: 120,
            icon: "Timer",
        },
    ],
    book: [
        {
            id: "maturity",
            label: "Возрастной рейтинг",
            type: "select",
            options: BOOK_MATURITY_RATINGS,
            icon: "Banana",
        },
        {
            id: "year",
            label: "Год выпуска",
            type: "range",
            min: 1450,
            max: new Date().getFullYear() + 5,
            icon: "Calendar",
        },
        {
            id: "pageCount",
            label: "Объём (стр)",
            type: "range",
            min: 0,
            max: 5000,
            icon: "BookOpen",
        },
    ],
    game: [
        {
            id: "esrb",
            label: "ESRB рейтинг",
            type: "select",
            options: ESRB_RATINGS,
            icon: "ShieldCheck",
        },
        {
            id: "year",
            label: "Год выпуска",
            type: "range",
            min: 1970,
            max: new Date().getFullYear() + 5,
            icon: "Calendar",
        },
        {
            id: "metacritic",
            label: "Metacritic",
            type: "range",
            min: 0,
            max: 100,
            icon: "Star",
        },
        {
            id: "duration",
            label: "Время прохождения (ч)",
            type: "range",
            min: 0,
            max: 500,
            icon: "Gamepad2",
        },
    ],
};

export const CATEGORY_CONFIG = {
    movie: [
        { title: "Топ страны", key: "topCountries" },
        { title: "Топ производства", key: "topCompanies" },
    ],
    anime: [
        { title: "Топ типы", key: "topKinds" },
        { title: "Топ студии", key: "topStudios" },
    ],
    game: [
        { title: "Топ платформы", key: "topPlatforms" },
        { title: "Топ разработчики", key: "topDevelopers" },
    ],
    book: [
        { title: "Топ авторы", key: "topAuthors" },
        { title: "Топ издатели", key: "topPublishers" },
    ],
};