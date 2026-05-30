const RAW_TV_ACHIEVEMENTS = [
    // === Группа: Основные (mastery) ===
    {
        id: "tv_series_collector",
        groupId: "mastery",
        title: "Диванный эксперт",
        description: "Добавьте 30 сериалов в коллекцию",
        iconName: "Tv",
        target: 30,
    },
    {
        id: "tv_binge_watcher",
        groupId: "mastery",
        title: "Сериальный маньяк",
        description: 'Переведите 20 сериалов в статус "Просмотрено"',
        iconName: "CheckCircle2",
        target: 20,
    },

    // === Группа: Жанры (genres) ===
    {
        id: "tv_adventure_time",
        groupId: "genres",
        title: "В поисках приключений",
        description: 'Добавьте 10 сериалов с жанрами "Боевик и Приключения" или "НФ и Фэнтези"',
        iconName: "Compass",
        target: 10,
    },

    // === Группа: Хронометраж / Формат (timing) ===
    {
        id: "tv_miniseries_lover",
        groupId: "timing",
        title: "На один вечер",
        description: "Добавьте 3 сериала, у которых всего не более 10 эпизодов",
        iconName: "Timer",
        target: 3,
    },
    {
        id: "tv_fresh_release",
        groupId: "timing",
        title: "Прямо с пылу с жару",
        description: "Добавьте 3 сериала текущего или прошлого года выпуска",
        iconName: "Sparkles",
        target: 3,
    },

    // === Группа: Рейтинги и оценки (ratings) ===
    {
        id: "tv_high_score",
        groupId: "ratings",
        title: "Выбор критиков",
        description: "Добавьте 5 сериалов с общим рейтингом TMDB выше 8.0",
        iconName: "Award",
        target: 5,
    },
    {
        id: "tv_perfect_ten",
        groupId: "ratings",
        title: "Шедевр поколения",
        description: "Поставьте сериалу максимальную оценку",
        iconName: "Heart",
        target: 1,
    },

    // === Группа: Поведение и списки (behavior) ===
    {
        id: "tv_hoarder",
        groupId: "behavior",
        title: "Когда-нибудь посмотрю",
        description: 'Имейте в списке "В планах" более 15 сериалов одновременно',
        iconName: "FolderHeart",
        target: 15,
    },
    {
        id: "tv_custom_creator",
        groupId: "behavior",
        title: "Собственный продакшн",
        description: "Создайте кастомную карточку сериала вручную",
        iconName: "Clapperboard",
        target: 1,
    },

    // ========================================================================================
    // === ГРУППА: ОСОБЫЕ (Секретные испытания, которые трудно получить случайно) =============
    // ========================================================================================
    {
        id: "tv_marathon_boss",
        groupId: "special",
        title: "Жизнь на паузе",
        description: "Добавьте сериал, в котором суммарно более 100 эпизодов",
        iconName: "Clock3",
        target: 1,
        hidden: true,
    },
    {
        id: "tv_long_live",
        groupId: "special",
        title: "Санта-Барбара",
        description: "Добавьте сериал, у которого выпущено 8 или более сезонов",
        iconName: "History",
        target: 1,
        hidden: true,
    },
    {
        id: "tv_streaming_addict",
        groupId: "special",
        title: "Подписка окупается",
        description: 'Соберите 5 сериалов производства "Amazon Studios" или "Netflix"',
        iconName: "Tv2",
        target: 5,
        hidden: true,
    },
    {
        id: "tv_legendary_finish",
        groupId: "special",
        title: "Конец эпохи",
        description: 'Добавьте 3 полностью завершенных сериала',
        iconName: "CalendarX",
        target: 3,
        hidden: true,
    },
];

export const TV_ACHIEVEMENTS = RAW_TV_ACHIEVEMENTS.map((achievement) => ({
    section: "tv",
    ...achievement,
}));
