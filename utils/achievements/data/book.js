const RAW_BOOK_ACHIEVEMENTS = [
    // === Группа: Основные (mastery) ===
    {
        id: "book_reader",
        groupId: "mastery",
        title: "Книжный червь",
        description: "Добавьте 50 книг в коллекцию",
        iconName: "BookOpenText",
        target: 50,
    },
    {
        id: "book_finished_legend",
        groupId: "mastery",
        title: "До корки",
        description: "Прочитайте 30 книг",
        iconName: "CheckCircle2",
        target: 30,
    },

    // === Группа: Жанры (genres) ===
    {
        id: "book_fantasy_world",
        groupId: "genres",
        title: "Побег от реальности",
        description: 'Добавьте 5 книг в жанре "Фэнтези" или "Магический реализм"',
        iconName: "Sparkles",
        target: 5,
    },

    // === Группа: Хронометраж / Объем (timing) ===
    {
        id: "book_longreader",
        groupId: "timing",
        title: "Длинные тома",
        description: "Добавьте 15 книг с объемом более 300 страниц",
        iconName: "Bookmark",
        target: 15,
    },
    {
        id: "book_classic_era",
        groupId: "timing",
        title: "Проверка временем",
        description: "Добавьте книгу, выпущенную до 2000 года",
        iconName: "History",
        target: 1,
    },

    // === Группа: Рейтинги и оценки / Авторы (ratings) ===
    {
        id: "book_author_fan",
        groupId: "ratings",
        title: "Поклонник автора",
        description: "Соберите в коллекции 5 книг одного и того же автора",
        iconName: "Feather",
        target: 5,
    },
    {
        id: "book_perfect_score",
        groupId: "ratings",
        title: "Золотая полка",
        description: "Поставьте книге максимальную оценку",
        iconName: "Heart",
        target: 1,
    },

    // === Группа: Поведение и списки (behavior) ===
    {
        id: "book_currently_reading",
        groupId: "behavior",
        title: "Параллельное чтение",
        description: 'Имейте 3 книги со статусом "Читаю" одновременно',
        iconName: "BookOpen",
        target: 3,
    },
    {
        id: "book_custom_creator",
        groupId: "behavior",
        title: "Самиздат",
        description: "Создайте 3 кастомные карточки книг вручную",
        iconName: "Clapperboard",
        target: 3,
    },

    // ========================================================================================
    // === ГРУППА: ОСОБЫЕ (Секретные испытания, которые трудно получить случайно) =============
    // ========================================================================================
    {
        id: "book_brick_layer",
        groupId: "special",
        title: "Осторожно, можно уронить на ногу",
        description: "Добавьте монументальный труд объемом более 800 страниц",
        iconName: "Layers",
        target: 1,
        hidden: true,
    },
    {
        id: "book_indie_publisher",
        groupId: "special",
        title: "Литературный эстет",
        description:
            "Соберите 3 книги от независимых или краудфандинговых издательств",
        iconName: "Compass",
        target: 3,
        hidden: true,
    },
    {
        id: "book_mature_audiences",
        groupId: "special",
        title: "Только для взрослых",
        description:
            "Добавьте 3 книги с возрастным рейтингом для зрелой аудитории",
        iconName: "ShieldAlert",
        target: 3,
        hidden: true,
    },
];

export const BOOK_ACHIEVEMENTS = RAW_BOOK_ACHIEVEMENTS.map((achievement) => ({
    section: "book",
    ...achievement,
}));
