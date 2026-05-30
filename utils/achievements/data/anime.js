const RAW_ANIME_ACHIEVEMENTS = [
    // ------------------------------------ ГРУППА: СТУДИИ ------------------------------------
    {
        id: "madhouse_fan",
        groupId: "studio",
        title: "Фанат Madhouse",
        description: "Соберите 5 карточек от студии Madhouse",
        iconName: "Clapperboard",
        target: 30,
    },
    {
        id: "a1Pictures_fan",
        groupId: "studio",
        title: "Фанат A-1 Pictures",
        description: "Соберите 5 карточек от студии A-1 pictures",
        iconName: "Clapperboard",
        target: 30,
    },
    {
        id: "studioPierrot_fan",
        groupId: "studio",
        title: "Фанат Studio Pierrot",
        description: "Соберите 5 карточек от студии Studio Pierrot",
        iconName: "Clapperboard",
        target: 30,
    },
    {
        id: "WitStudio_fan",
        groupId: "studio",
        title: "Фанат Wit Studio",
        description: "Соберите 5 карточек от студии Wit Studio",
        iconName: "Clapperboard",
        target: 30,
    },
    {
        id: "cloverworks_fan",
        groupId: "studio",
        title: "Фанат CloverWorks",
        description: "Соберите 5 карточек от студии CloverWorks",
        iconName: "Clapperboard",
        target: 30,
    },
    {
        id: "mappa_fan",
        groupId: "studio",
        title: "Фанат MAPPA",
        description: "Соберите 5 карточек от студии MAPPA",
        iconName: "Clapperboard",
        target: 30,
    },
    // ----------------------------------------------------------------------------------------

    // ------------------------------------ ГРУППА: КОНТЕНТ -----------------------------------
    {
        id: "manga_legacy",
        groupId: "content",
        title: "Бумажный след",
        description: "Соберите 10 аниме, основанных на манге",
        iconName: "BookOpenText",
        target: 10,
    },
    {
        id: "spinoff_lover",
        groupId: "content",
        title: "Спин-офф не помеха",
        description: "Добавьте в коллекцию OVA",
        iconName: "GitBranch",
        target: 1,
    },
    {
        id: "family_tree",
        groupId: "content",
        title: "Родословная",
        description: "Соберите полную цепочку: предыстория и продолжение",
        iconName: "History",
        target: 1,
    },
    {
        id: "screenshot_master",
        groupId: "content",
        title: "Фотоальбом",
        description: "Добавьте карточку, у которой больше 30 скриншотов",
        iconName: "Camera",
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
    {
        id: "harem_king",
        groupId: "genres",
        title: "Хозяин гарема",
        description: "Соберите 15 карточек с жанром 'Гарем'",
        iconName: "Heart",
        target: 15,
    },
    {
        id: "forever_young",
        groupId: "genres",
        title: "Такой, как все",
        description: "Соберите 15 карточек в жанре 'Сёнен'",
        iconName: "Users",
        target: 15,
    },
    {
        id: "awards",
        groupId: "genres",
        title: "Гурман",
        description: "Соберите 15 карточек, которые были удостоены наград",
        iconName: "Medal",
        target: 15,
    },
    {
        id: "fap_fap",
        groupId: "genres",
        title: "Ага, дрочишь?",
        description: "Добавьте в коллекцию карточку в жанре 'Этти'",
        iconName: "Banana",
        target: 1,
        hidden: true,
    },
    {
        id: "more_boobies",
        groupId: "genres",
        title: "Больше сисек",
        description: "Добавьте в коллекцию 3 карточки в жанре 'Этти'",
        iconName: "Cherry",
        target: 10,
        hidden: true,
    },
    // ----------------------------------------------------------------------------------------

    // ------------------------------- ГРУППА: БИНГО (Секретные) ------------------------------
    {
        id: "hokage",
        groupId: "bingo",
        title: "Хокаге",
        description: 'Полностью посмотрите "Наруто"',
        iconName: "Leaf",
        target: 21,
        requiredIds: [
            "20",
            "761",
            "2248",
            "442",
            "1074",
            "936",
            "2144",
            "1735",
            "2472",
            "4437",
            "7367",
            "6325",
            "8246",
            "10659",
            "10589",
            "10686",
            "13667",
            "19511",
            "16870",
            "53236",
            "54688",
        ],
        hidden: true,
    },
    {
        id: "monogatari",
        groupId: "bingo",
        title: "Чёрный",
        description: 'Полностью посмотрите "Моногатари"',
        iconName: "Donut",
        target: 14,
        requiredIds: [
            "9260",
            "31757",
            "31758",
            "15689",
            "5081",
            "11597",
            "17074",
            "28025",
            "31181",
            "32268",
            "35247",
            "57864",
            "59612",
            "61968",
        ],
        hidden: true,
    },
    {
        id: "pawn",
        groupId: "bingo",
        title: "Манипулятор",
        description: 'Посмотрите "Класс превосходства", "Безумный азарт" и "Игра друзей"',
        iconName: "ChessPawn",
        target: 8,
        requiredIds: [
            // Класс превосходства
            "35507",
            "51096",
            "51180",
            "59708",
            // Безумный азарт
            "34933",
            "37086",
            "50339",
            // Игра друзей
            "50273",
        ],
        hidden: true,
    },
    {
        id: "bad_guy",
        groupId: "bingo",
        title: "Хулиган",
        description:
            'Посмотрите "Токийские мстители", "Ветролом" и "Западные ворота парка Икэбукуро"',
        iconName: "HandFist",
        target: 7,
        requiredIds: [
            // Токийские мстители
            "42249",
            "50608",
            "54918",
            "59088",
            // Ветролом
            "54900",
            "59160",
            // Западные ворота парка Икэбукуро
            "40359",
        ],
        hidden: true,
    },
    {
        id: "yokai",
        groupId: "bingo",
        title: "Ёкай",
        description:
            'Посмотрите "Бездомный бог", "Очень приятно, Бог" и "Туалетный мальчик Ханако"',
        iconName: "Flame",
        target: 7,
        requiredIds: [
            // Бездомный бог
            "20507",
            "30503",
            // Очень приятно, Бог
            "14713",
            "25681",
            // Туалетный мальчик Ханако
            "39534",
            "53924",
            "61339",
        ],
        hidden: true,
    },
    {
        id: "survivor",
        groupId: "bingo",
        title: "Выживший",
        description: 'Посмотрите "Созданный в бездне", "Обещанный Неверленд" и "Иллюзия рая"',
        iconName: "Skull",
        target: 9,
        requiredIds: [
            // Созданный в бездне
            "34599",
            "37514",
            "37515",
            "40897",
            "36862",
            "41084",
            // Обещанный Неверленд
            "37779",
            "39617",
            // Иллюзия рая
            "53393",
        ],
        hidden: true,
    },
    {
        id: "adventurer",
        groupId: "bingo",
        title: "Авантюрист",
        description:
            'Посмотрите "Провожающая в последний путь Фрирен", "Подземелье вкусностей" и "Ателье колдовских колпаков"',
        iconName: "Sparkles",
        target: 4,
        requiredIds: [
            // Провожающая в последний путь Фрирен
            "52991",
            "59978",
            // "63816", anons
            // Подземелье вкусностей
            "52701",
            // "59068", anons
            // Ателье колдовских колпаков
            "51553",
        ],
        hidden: true,
    },
    {
        id: "half_monster",
        groupId: "bingo",
        title: "Полумонстр",
        description: 'Посмотрите "Токийский гуль", "Паразит: Учение о жизни" и "Кайдзю №8"',
        iconName: "Dna",
        target: 8,
        requiredIds: [
            // Токийский гуль
            "22319",
            "27899",
            "36511",
            "37799",
            // Паразит: Учение о жизни
            "22535",
            // Кайдзю №8
            "52588",
            "59489",
            "59177",
            // "63136", anons
        ],
        hidden: true,
    },
    {
        id: "trigger_soul",
        groupId: "bingo",
        title: "Много пафоса",
        description: 'Посмотрите "Милый во Франксе", "Гуррен-Лаганн" и "Убей или умри"',
        iconName: "Zap",
        target: 5,
        requiredIds: [
            // Милый во Франксе
            "35849",
            // Гуррен-Лаганн
            "2001",
            "4107",
            "4565",
            // Убей или умри
            "18679",
        ],
        hidden: true,
    },
    {
        id: "harem_victim",
        groupId: "bingo",
        title: "Жертва гарема",
        description: 'Посмотрите "Пять невест", "Мы не можем учиться!" и "Притворная любовь"',
        iconName: "Heart",
        target: 7,
        requiredIds: [
            // Пять невест
            "38101",
            "39783",
            "48548",
            // Мы не можем учиться!
            "38186",
            "40004",
            // Притворная любовь
            "18897",
            "27787",
        ],
        hidden: true,
    },
    {
        id: "aesthetic_ghibli",
        groupId: "bingo",
        title: "Эстет",
        description: 'Посмотрите "Унесённые призраками", "Ходячий замок" и "Принцесса Мононоке"',
        iconName: "Brush",
        target: 3,
        requiredIds: [
            // Унесённые призраками
            "199",
            // Ходячий замок
            "431",
            // Принцесса Мононоке
            "164",
        ],
        hidden: true,
    },
    {
        id: "truck_kun",
        groupId: "bingo",
        title: "Грузовик",
        description:
            'Посмотрите "Реинкарнация безработного", "Re:Zero" и "О моём переождении в слизь"',
        iconName: "Truck",
        target: 20,
        requiredIds: [
            // Реинкарнация безработного
            "39535",
            "45576",
            "51179",
            "45576",
            "59193",
            // Re:Zero
            "31240",
            "36286",
            "38414",
            "39587",
            "42203",
            "54857",
            "61316",
            // О моём переождении в слизь
            "37430",
            "39551",
            "41488",
            "41487",
            "49877",
            "53580",
            "59971",
            "59970",
            // "63129", anons
        ],
        hidden: true,
    },
    {
        id: "dreamer_shinkai",
        groupId: "bingo",
        title: "Мечтатель",
        description: 'Посмотрите "Твоё имя", "Дитя погоды" и "Судзумэ, закрывающая двери"',
        iconName: "CloudSun",
        target: 3,
        requiredIds: [
            // Твоё имя
            "32281",
            // Дитя погоды
            "38826",
            // Судзумэ, закрывающая двери
            "50594",
        ],
        hidden: true,
    },
    {
        id: "insanity_style",
        groupId: "bingo",
        title: "Где кукуха?",
        description: 'Посмотрите "Дандадан", "Моб Психо 100" и "Фури-кури"',
        iconName: "Orbit",
        target: 10,
        requiredIds: [
            // Дандадан
            "57334",
            "60543",
            // "62516", anons
            // Моб Психо 100
            "32182",
            "37510",
            "50172",
            // Фури-кури
            "227",
            "33010",
            "35842",
            "51304",
            "51305",
        ],
        hidden: true,
    },
    {
        id: "brutal_seinen",
        groupId: "bingo",
        title: "Брутал",
        description: 'Посмотрите "Хеллсинг", "Пираты «Чёрной лагуны»" и "Гангрейв"',
        iconName: "Sword",
        target: 4,
        requiredIds: [
            // Хеллсинг
            "270",
            // Пираты «Чёрной лагуны»
            "889",
            "1519",
            // Гангрейв
            "267",
        ],
        hidden: true,
    },
    {
        id: "simpulya",
        groupId: "bingo",
        title: "Симпуля",
        description:
            'Посмотрите "Вермейл в золотом", "Раб спецотряда демонического города" и "Храм: Никто не может жить в одиночестве"',
        iconName: "Rose",
        target: 4,
        requiredIds: [
            // Вермейл в золотом
            "51213",
            // Раб спецотряда демонического города
            "50392",
            "58505",
            // Храм: Никто не может жить в одиночестве
            "54275",
        ],
        hidden: true,
    },
    {
        id: "clear_world",
        groupId: "bingo",
        title: "Мир понятен",
        description: 'Посмотрите "Первородный грех Такопи", "Созданный в бездне" и "Нарутару"',
        iconName: "Brain",
        target: 8,
        requiredIds: [
            // Первородный грех Такопи
            "60489",
            // Созданный в бездне
            "34599",
            "37514",
            "37515",
            "40897",
            "36862",
            "41084",
            // Нарутару
            "838",
        ],
        hidden: true,
    },
    {
        id: "plot",
        groupId: "bingo",
        title: "Сюжет, да-да, рисовка",
        description:
            'Посмотрите "Маг-целитель: Новый старт", "Демоны старшей школы" и "Изобрази отвращение и покажи мне свои трусики"',
        iconName: "Binoculars",
        target: 9,
        requiredIds: [
            // Маг-целитель: Новый старт
            "40750",
            // Демоны старшей школы
            "11617",
            "15451",
            "24703",
            "34281",
            // Изобрази отвращение и покажи мне свои трусики
            "37021",
            "38163",
            "55629",
            "62155",
        ],
        hidden: true,
    },
    {
        id: "new_gen",
        groupId: "bingo",
        title: "Ньюген",
        description:
            'Посмотрите "Магическая битва", "Клинок, рассекающий демонов" и "Поднятие уровня в одиночку"',
        iconName: "Baby",
        target: 12,
        requiredIds: [
            // Магическая битва
            "40748",
            "48561",
            "51009",
            "57658",
            // Клинок, рассекающий демонов
            "38000",
            "40456",
            "47778",
            "51019",
            "55701",
            "59192",
            // "62546", anons
            // "62547", anons
            // Поднятие уровня в одиночку
            "52299",
            "58567",
        ],
        hidden: true,
    },
    // ----------------------------------------------------------------------------------------
];

export const ANIME_ACHIEVEMENTS = RAW_ANIME_ACHIEVEMENTS.map((achievement) => ({
    section: "anime",
    ...achievement,
}));
