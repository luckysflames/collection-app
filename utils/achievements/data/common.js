// Глобальные разделы приложения (Верхние Табы)
export const ACHIEVEMENT_SECTIONS = {
    common: "Общие",
    anime: "Аниме",
    movie: "Фильмы",
    tv: "Сериалы",
    game: "Игры",
    book: "Книги",
};

// Внутренние подгруппы (Заголовки внутри табов)
export const ACHIEVEMENT_SUBGROUPS = {
    // Подгруппы для Общих ачивок
    mastery: "Основные",
    organization: "Порядок",
    genres: "Жанры",
    special: "Особые",
    bingo: "Бинго",

    // Подгруппы для Фильмов (и других медиа)
    timing: "Хронометраж",
    money: "Бюджеты",
    geography: "География",
    studios: "Студии",
    ratings: "Рейтинги и оценки",
    behavior: "Поведение и списки",
};

const RAW_COMMON_ACHIEVEMENTS = [
    // -------------------------- ГРУППА: МАСТЕРСТВО (Числа и оценки) -------------------------
    {
        id: "collector_beginner",
        groupId: "mastery",
        title: "Ты у меня первая",
        description: "Добавьте в коллекцию свою первую карточку",
        iconName: "LayersPlus",
        target: 1,
    },
    {
        id: "creator_beginner",
        groupId: "mastery",
        title: "Я здесь власть",
        description: "Создайте свою первую карточку",
        iconName: "Pencil",
        target: 1,
    },
    {
        id: "low_rater",
        groupId: "mastery",
        title: "С пола не ем",
        description: "Поставьте оценку 1 минимум 5 карточкам",
        iconName: "StarOff",
        target: 5,
    },
    {
        id: "high_rater",
        groupId: "mastery",
        title: "Прям заслужили?",
        description: "Поставьте оценку 10 минимум 5 карточкам",
        iconName: "Star",
        target: 30,
    },
    {
        id: "moment_collector",
        groupId: "mastery",
        title: "Ценитель мгновений",
        description: "Накопите суммарно 1000 кадров во всех карточках",
        iconName: "Images",
        target: 1000,
    },
    {
        id: "brilliant_collector",
        groupId: "mastery",
        title: "Бриллиантовая рука",
        description: "Соберите в коллекции 10 алмазов",
        iconName: "Gem",
        target: 10,
    },
    // ----------------------------------------------------------------------------------------

    // -------------------------- ГРУППА: ПОРЯДОК (Папки и структура) -------------------------
    {
        id: "archivist",
        groupId: "organization",
        title: "Архивариус",
        description: "Создайте 5 папок для организации своей коллекции",
        iconName: "Library",
        target: 30,
    },
    {
        id: "shelf_master",
        groupId: "organization",
        title: "По полочкам",
        description: "Поместите более 10 карточек внутрь одной папки",
        iconName: "FolderTree",
        target: 1,
    },
    // ----------------------------------------------------------------------------------------

    // ------------------------------------- ГРУППА: ЖАНРЫ ------------------------------------
    {
        id: "genre_expert_horror",
        groupId: "genres",
        title: "Бу, испугался?",
        description: "Соберите 10 карточек в жанре 'Ужасы'",
        iconName: "Ghost",
        target: 20,
    },
    // ----------------------------------------------------------------------------------------

    // ------------------------------ ГРУППА: ОСОБЫЕ (Секретные) ------------------------------
    {
        id: "night_owl",
        groupId: "special",
        title: "Ночной жрец",
        description: "Добавьте карточку в период с 00:00 до 05:00",
        iconName: "Moon",
        target: 1,
        hidden: true,
    },
    {
        id: "status_uncertain",
        groupId: "special",
        title: "Потом как-нибудь",
        description: "Добавьте карточку, не определившись со статусом",
        iconName: "HelpCircle",
        target: 1,
        hidden: true,
    },
    {
        id: "ban",
        groupId: "special",
        title: "Да, ещё",
        description: "Оскорбите разработчика",
        iconName: "Ban",
        target: 1,
        hidden: true,
    },
    // ----------------------------------------------------------------------------------------
];

export const COMMON_ACHIEVEMENTS = RAW_COMMON_ACHIEVEMENTS.map((achievement) => ({
    section: "common",
    ...achievement,
}));
