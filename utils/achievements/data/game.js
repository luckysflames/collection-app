const RAW_GAME_ACHIEVEMENTS = [
    // === Группа: Основные (mastery) ===
    {
        id: "game_collector",
        groupId: "mastery",
        title: "Геймер-коллекционер",
        description: "Соберите 30 игр в коллекции",
        iconName: "Joystick",
        target: 30,
    },
    {
        id: "game_completed",
        groupId: "mastery",
        title: "Пройденный путь",
        description: "Пройдите 10 игр",
        iconName: "CheckCircle",
        target: 10,
    },

    // === Группа: Жанры (genres) ===
    {
        id: "game_rpg_lover",
        groupId: "genres",
        title: "Поклонник RPG",
        description: 'Добавьте 10 игр в жанре "RPG"',
        iconName: "Sword",
        target: 10,
    },
    {
        id: "game_action_addict",
        groupId: "genres",
        title: "По колено в гильзах",
        description: 'Добавьте 10 игр в жанре "Action" или "Экшен-платформер"',
        iconName: "Zap",
        target: 5,
    },

    // === Группа: Хронометраж (timing) ===
    {
        id: "game_time_killer",
        groupId: "timing",
        title: "Потерян для общества",
        description: "Добавьте игру с общим временем прохождения более 100 часов",
        iconName: "Clock3",
        target: 1,
    },
    {
        id: "game_retro_vibe",
        groupId: "timing",
        title: "Раньше было лучше",
        description: "Добавьте игру, выпущенную до 2015 года",
        iconName: "History",
        target: 1,
    },

    // === Группа: Рейтинги и оценки (ratings) ===
    {
        id: "game_metacritic_gold",
        groupId: "ratings",
        title: "Знак качества",
        description: "Добавьте 3 игры с рейтингом Metacritic выше 85",
        iconName: "Award",
        target: 3,
    },
    {
        id: "game_perfect_ten",
        groupId: "ratings",
        title: "Игры как искусство",
        description: "Поставьте 3 играм личную оценку 10 из 10",
        iconName: "Heart",
        target: 3,
    },

    // === Группа: Поведение и списки (behavior) ===
    {
        id: "game_active_gamer",
        groupId: "behavior",
        title: "Многозадачность",
        description: 'Имейте 3 игры со статусом "Играю" одновременно',
        iconName: "Gamepad2",
        target: 3,
    },
    {
        id: "game_custom_creator",
        groupId: "behavior",
        title: "Скрытый хит",
        description: "Создайте 3 кастомные карточки игр вручную",
        iconName: "Clapperboard",
        target: 3,
    },

    // ========================================================================================
    // === ГРУППА: ОСОБЫЕ (Секретные испытания, которые трудно получить случайно) =============
    // ========================================================================================
    {
        id: "game_platinum_god",
        groupId: "special",
        title: "На все 100%",
        description: "Соберите в коллекции 5 пиковых игр",
        iconName: "Crown",
        target: 5,
        hidden: true,
    },
    {
        id: "game_hardcore_mature",
        groupId: "special",
        title: "Детям у экрана делать нечего",
        description: "Добавьте 3 игры со строгим возрастным рейтингом (ESRB: Mature / 18+)",
        iconName: "ShieldAlert",
        target: 3,
        hidden: true,
    },
    {
        id: "game_indie_devotion",
        groupId: "special",
        title: "Поддержка малого бизнеса",
        description: "Соберите 3 игры от инди-студий",
        iconName: "HeartHandshake",
        target: 3,
        hidden: true,
    },
    {
        id: "game_multiplatform",
        groupId: "special",
        title: "Свидетель платформенных войн",
        description: "Добавьте игру, которая доступна более чем на 5 платформах",
        iconName: "Layers",
        target: 1,
        hidden: true,
    },
];

export const GAME_ACHIEVEMENTS = RAW_GAME_ACHIEVEMENTS.map((achievement) => ({
    section: "game",
    ...achievement,
}));