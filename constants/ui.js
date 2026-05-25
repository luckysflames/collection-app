// Иконки нижней навигации
export const TAB_ICONS = {
    Поиск: {
        active: require("../assets/icons/search(active).png"),
        inactive: require("../assets/icons/search(inactive).png"),
    },
    Создать: {
        active: require("../assets/icons/add(active).png"),
        inactive: require("../assets/icons/add(inactive).png"),
    },
    Настройки: {
        active: require("../assets/icons/settings(active).png"),
        inactive: require("../assets/icons/settings(inactive).png"),
    },
    Коллекция: {
        active: require("../assets/icons/collection(active).png"),
        inactive: require("../assets/icons/collection(inactive).png"),
    },
};

// Иконки и лейблы переключателей категорий
export const SUB_CATEGORIES = [
    {
        id: "game",
        label: "Игры",
        active: require("../assets/icons/game(active).png"),
        inactive: require("../assets/icons/game(inactive).png"),
    },
    {
        id: "movie",
        label: "Фильмы",
        active: require("../assets/icons/movie(active).png"),
        inactive: require("../assets/icons/movie(inactive).png"),
    },
    {
        id: "tv",
        label: "Сериалы",
        active: require("../assets/icons/tv(active).png"),
        inactive: require("../assets/icons/tv(inactive).png"),
    },
    {
        id: "anime",
        label: "Аниме",
        active: require("../assets/icons/anime(active).png"),
        inactive: require("../assets/icons/anime(inactive).png"),
    },
    {
        id: "book",
        label: "Книги",
        active: require("../assets/icons/book(active).png"),
        inactive: require("../assets/icons/book(inactive).png"),
    },
];

export const DEFAULT_CATEGORY_ORDER = SUB_CATEGORIES.map((category) => category.id);

export const getOrderedCategories = (categoryOrder = DEFAULT_CATEGORY_ORDER) =>
    categoryOrder
        .map((categoryId) =>
            SUB_CATEGORIES.find((category) => category.id === categoryId),
        )
        .filter(Boolean);

// Технический маппинг (id к названию коллекции)
export const SECTION_MAPPING = {
    movie: "Movies",
    book: "Books",
    game: "Games",
    anime: "Anime",
    tv: "TV",
};

// Список разделов
export const SECTIONS = [
    { id: "movie", label: "Фильмы" },
    { id: "anime", label: "Аниме" },
    { id: "tv", label: "Сериалы" },
    { id: "book", label: "Книги" },
    { id: "game", label: "Игры" },
];

// Список внешних сервисов
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
