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

export const DEFAULT_FALLBACK_STATUS = "Избранное";

export const SYSTEM_STATUSES = ["Всё", "Папки", DEFAULT_FALLBACK_STATUS];

export const DEFAULT_STATUSES = {
    Movies: [
        "Всё",
        "Папки",
        "Избранное",
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
        "Избранное",
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
        "Избранное",
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
        "Избранное",
        "Смотрю",
        "В планах",
        "Просмотрено",
        "Пересматриваю",
        "Брошено",
        "Отложено",
    ],
};
