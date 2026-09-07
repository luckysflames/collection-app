import {
    ANIME_KINDS,
    ANIME_RATINGS,
    ANIME_STATUSES,
    BOOK_MATURITY_RATINGS,
    ESRB_RATINGS,
    MOVIE_STATUSES,
} from "./forms";

export const SORT_LABELS = {
    date_desc: "Сначала новые",
    date_asc: "Сначала старые",
    rating_desc: "Сначала лучшие",
    rating_asc: "Сначала худшие",
    alphabet_asc: "От А до Я",
    alphabet_desc: "От Я до А",
    status_change_desc: "Сначала новые изменения",
    status_change_asc: "Сначала старые изменения",
};

export const FOLDER_SORT_LABELS = {
    manual: "Вручную (↓)",
    manual_desc: "Вручную (↑)",
    date_desc: "По дате (↓)",
    date_asc: "По дате (↑)",
    rating_desc: "По рейтингу (↓)",
    rating_asc: "По рейтингу (↑)",
    alphabet_asc: "По алфавиту (А-Я)",
    alphabet_desc: "По алфавиту (Я-А)",
    status_change_desc: "По изменениям (↓)",
    status_change_asc: "По изменениям (↑)",
};

export const SORT_TYPES = [
    { id: "date", label: "По дате", icon: "Clock" },
    { id: "rating", label: "По рейтингу", icon: "Star" },
    { id: "alphabet", label: "По алфавиту", icon: "CaseSensitive" },
    { id: "manual", label: "Ручной порядок", icon: "Check" },
    {
        id: "status_change",
        label: "По изменению статуса",
        icon: "CalendarClock",
    },
];

export const SORT_SUB_OPTIONS = {
    date: [
        {
            id: "date_desc",
            label: "Сначала новые",
            icon: "ArrowDownWideNarrow",
        },
        { id: "date_asc", label: "Сначала старые", icon: "ArrowUpNarrowWide" },
    ],
    rating: [
        { id: "rating_desc", label: "Сначала лучшие", icon: "Star" },
        { id: "rating_asc", label: "Сначала худшие", icon: "StarOff" },
    ],
    alphabet: [
        { id: "alphabet_asc", label: "От А до Я", icon: "ArrowDownAZ" },
        { id: "alphabet_desc", label: "От Я до А", icon: "ArrowUpAZ" },
    ],
    manual: [
        { id: "manual", label: "Прямой порядок", icon: "ArrowUpNarrowWide" },
        { id: "manual_desc", label: "Обратный порядок", icon: "ArrowDownWideNarrow" },
    ],
    status_change: [
        {
            id: "status_change_desc",
            label: "Сначала новые изменения",
            icon: "ArrowDownWideNarrow",
        },
        {
            id: "status_change_asc",
            label: "Сначала старые изменения",
            icon: "ArrowUpNarrowWide",
        },
    ],
};

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
            id: "maturityRating",
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
    tv: [
        { title: "Топ страны", key: "topCountries" },
        { title: "Топ производства", key: "topCompanies" },
    ],
};
