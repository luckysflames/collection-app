const RAW_MOVIE_ACHIEVEMENTS = [
    // === Группа: Жанровые и тематические испытания (genres) ===
    {
        id: "movie_adrenaline_junkie",
        groupId: "genres",
        title: "Адреналиновый наркоман",
        description: 'Добавьте 30 фильмов с жанрами "Экшен" или "Триллер"',
        iconName: "Zap",
        target: 30,
    },
    {
        id: "movie_tear_jerker",
        groupId: "genres",
        title: "Запасайтесь салфетками",
        description: 'Соберите 30 фильмов с жанром "Мелодрама" или "Драма"',
        iconName: "HeartCrack",
        target: 30,
    },
    {
        id: "movie_detective",
        groupId: "genres",
        title: "Элементарно, Ватсон",
        description: 'Добавьте 30 фильмов с жанром "Детектив" или "Криминал"',
        iconName: "Eye",
        target: 30,
    },
    {
        id: "movie_laughter_therapy",
        groupId: "genres",
        title: "Смехотерапия",
        description: "Добавьте 30 комедий в свою коллекцию",
        iconName: "Smile",
        target: 30,
    },

    // === Группа: Время и Хронометраж (timing) ===
    {
        id: "movie_short_and_sweet",
        groupId: "timing",
        title: "Быстро и безболезненно",
        description: "Добавьте 5 фильмов длительностью менее 85 минут",
        iconName: "Timer",
        target: 5,
    },
    {
        id: "movie_fresh_meat",
        groupId: "timing",
        title: "Ещё краска не высохла",
        description: "Добавьте 3 фильма текущего или прошлого года выпуска",
        iconName: "Sparkles",
        target: 3,
    },

    // === Группа: Экономика и Масштабы (money) ===
    {
        id: "movie_blockbuster_lord",
        groupId: "money",
        title: "Ни стыда, ни бюджета",
        description: "Добавьте 5 фильмов с бюджетом более $150 000 000",
        iconName: "Coins",
        target: 5,
    },

    // === Группа: География (geography) ===
    {
        id: "movie_hollywood_addict",
        groupId: "geography",
        title: "Made in USA",
        description: "Добавьте 20 фильмов производства United States of America",
        iconName: "Flag",
        target: 20,
    },
    {
        id: "movie_euro_trip",
        groupId: "geography",
        title: "Евротур",
        description: "Соберите фильмы из 4 разных европейских стран",
        iconName: "Globe2",
        target: 4,
    },

    // === Группа: Студии (studios) ===
    {
        id: "movie_mouse_house",
        groupId: "studios",
        title: "В заложниках у мыши",
        description: 'Добавьте 5 фильмов от студии "Walt Disney Pictures" или "Pixar"',
        iconName: "Castle",
        target: 5,
    },
    {
        id: "movie_warner_bros",
        groupId: "studios",
        title: "Братья Уорнеры",
        description: 'Добавьте 5 фильмов студии "Warner Bros. Pictures"',
        iconName: "ShieldAlert",
        target: 5,
    },

    // === Группа: Оценки и Критика (ratings) ===
    {
        id: "movie_masterpiece",
        groupId: "ratings",
        title: "Глас народа",
        description: "Добавьте 5 фильмов с общим рейтингом TMDB выше 8.0",
        iconName: "Award",
        target: 5,
    },
    {
        id: "movie_generous_soul",
        groupId: "ratings",
        title: "Щедрая душа",
        description: "Поставьте 20 фильмам максимальную оценку",
        iconName: "Heart",
        target: 20,
    },

    // === Группа: Поведение и Списки (behavior) ===
    {
        id: "movie_hoarder",
        groupId: "behavior",
        title: "Синдром Плюшкина",
        description: 'Имейте в списке "В планах" более 50 фильмов одновременно',
        iconName: "FolderHeart",
        target: 50,
    },
    {
        id: "movie_elite_club",
        groupId: "behavior",
        title: "Золотой фонд",
        description: 'Добавьте 10 фильмов в "Избранное"',
        iconName: "Star",
        target: 10,
    },
    {
        id: "movie_custom_creator",
        groupId: "behavior",
        title: "Сам себе режиссер",
        description: "Создайте 3 кастомные карточки фильмов вручную",
        iconName: "Clapperboard",
        target: 3,
    },

    // ========================================================================================
    // === ГРУППА: ОСОБЫЕ (Секретные испытания, которые трудно получить случайно) =============
    // ========================================================================================
    {
        id: "movie_time_killer",
        groupId: "special",
        title: "Испытание мочевого пузыря",
        description: "Добавьте 5 фильмов длительностью более 180 минут",
        iconName: "Clock3",
        target: 5, // Поднял с 3 до 5, раз уж она стала элитной секреткой
        hidden: true,
    },
    {
        id: "movie_century_surfer",
        groupId: "special",
        title: "Гость из прошлого",
        description: "Добавьте фильм, выпущенный до 1980 года",
        iconName: "History",
        target: 1,
        hidden: true,
    },
    {
        id: "movie_indie_enjoyer",
        groupId: "special",
        title: "Две коробки пиццы и камера",
        description: "Соберите 3 фильма с бюджетом меньше $2 000 000 (но больше 0)",
        iconName: "DollarSign",
        target: 3,
        hidden: true,
    },
    {
        id: "movie_exotic_cinema",
        groupId: "special",
        title: "Киногурман",
        description: "Добавьте фильм, снятый НЕ в США, НЕ в Европе и НЕ в России",
        iconName: "Compass",
        target: 1,
        hidden: true,
    },
    {
        id: "movie_trash_collector",
        groupId: "special",
        title: "Ценитель прекрасного мусора",
        description: "Осмельтесь добавить фильм с рейтингом TMDB ниже 5.0",
        iconName: "Trash2",
        target: 1,
        hidden: true,
    },
    {
        id: "movie_tough_critic",
        groupId: "special",
        title: "Не ублажить",
        description: "Поставьте 3 фильмам личную оценку 4 балла или ниже",
        iconName: "ThumbsDown",
        target: 3,
        hidden: true,
    },
];

export const MOVIE_ACHIEVEMENTS = RAW_MOVIE_ACHIEVEMENTS.map((achievement) => ({
    section: "movie",
    ...achievement,
}));
