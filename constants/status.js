export const FAVORITE_STATUS = "Избранное";
export const DEFAULT_FALLBACK_STATUS = "В планах";

export const SYSTEM_STATUSES = ["Всё", "Папки"];
export const STATUS_SELECTION_EXCLUDE = [...SYSTEM_STATUSES];
export const PROTECTED_STATUSES = [
    ...SYSTEM_STATUSES,
    FAVORITE_STATUS,
    "Просмотрено",
    "Прочитано",
    "Пройдено",
    "Смотрю",
    "Читаю",
    "Играю",
    "В планах",
];

export const DEFAULT_STATUS_BY_SECTION = {
    Movies: "Смотрю",
    Anime: "Смотрю",
    Manga: "Читаю",
    TV: "Смотрю",
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
        "Пройдено",
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
        "Брошено",
        "Отложено",
    ],
    Manga: [
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
    TV: [
        "Всё",
        "Папки",
        FAVORITE_STATUS,
        "Смотрю",
        "В планах",
        "Просмотрено",
        "Брошено",
        "Отложено",
    ],
};

export const ANIME_ORIGIN_MAP = {
    original: "Оригинал",
    manga: "Манга",
    web_manga: "Веб-манга",
    four_koma_manga: "4-кома (манга)",
    novel: "Новелла",
    web_novel: "Веб-новелла",
    visual_novel: "Визуальная новелла",
    light_novel: "Ранобэ (Light Novel)",
    game: "Игра",
    card_game: "Карточная игра",
    music: "Музыка",
    radio: "Радио",
    book: "Книга",
    picture_book: "Книжка с картинками",
    mixed_media: "Смешанные медиа",
    other: "Другое",
    unknown: "Неизвестно",
};
