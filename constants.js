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

export const SECTION_MAPPING = {
    movie: "Movies", // ключи теперь латинские
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

export const FAVORITE_STATUS = "Избранное";
export const DEFAULT_FALLBACK_STATUS = "В планах";
export const SYSTEM_STATUSES = ["Всё", "Папки"];
export const STATUS_SELECTION_EXCLUDE = [...SYSTEM_STATUSES];
export const PROTECTED_STATUSES = [...STATUS_SELECTION_EXCLUDE];

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
    airedOn: "",
    releasedOn: "",
    episodes: "",
    episodesAired: "",
    studios: "",
    pageCount: "",
    maturity: "",
    authors: "",
    publisher: "",
    metacritic: "",
    esrb: "",
    developers: "",
    platforms: "",
    duration: "",
};

// Названия для кнопки управления (MainControls)
export const SORT_LABELS = {
    newest: "Сначала новые",
    oldest: "Сначала старые",
    rating_desc: "Сначала лучшие",
    rating_asc: "Сначала худшие",
    alphabet_asc: "От А до Я",
    alphabet_desc: "От Я до А",
};

// Конфигурация уровней сортировки для SortModal
export const SORT_TYPES = [
    { id: "date", label: "По дате", icon: "Clock" },
    { id: "rating", label: "По рейтингу", icon: "Star" },
    { id: "alphabet", label: "По алфавиту", icon: "CaseSensitive" },
];

// Подкатегории для SortModal
export const SORT_SUB_OPTIONS = {
    date: [
        { id: "newest", label: "Сначала новые", icon: "ArrowDownWideNarrow" },
        { id: "oldest", label: "Сначала старые", icon: "ArrowUpNarrowWide" },
    ],
    rating: [
        {
            id: "rating_desc",
            label: "Сначала лучшие",
            icon: "Star",
        },
        {
            id: "rating_asc",
            label: "Сначала худшие",
            icon: "StarOff",
        },
    ],
    alphabet: [
        { id: "alphabet_asc", label: "От А до Я", icon: "ArrowDownAZ" },
        { id: "alphabet_desc", label: "От Я до А", icon: "ArrowUpAZ" },
    ],
};

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
