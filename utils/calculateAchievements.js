import { ACHIEVEMENTS_DATA } from "../constants/index";

// Вспомогательная функция для получения чистого ID без префикса и номера страницы
const getCleanId = (complexId, prefix) =>
    complexId.replace(prefix, "").split("-")[0];

// Пример использования: const animeId = getCleanId(id, "anime-");

const toArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.length > 0) return [value];
    return [];
};

const normalizeTextItem = (item) => String(item || "").toLowerCase();

const hasAnyTag = (item, tags) => {
    const normalized = toArray(item).map(normalizeTextItem);
    return tags.some((tag) => normalized.includes(normalizeTextItem(tag)));
};

// Функция для поиска карточек по заданным в requiredIds айдишникам
const checkIdsPresence = (cards, achievement) => {
    if (!cards || !achievement.requiredIds) return 0;

    // Собираем все просмотренные ID один раз
    const watchedIds = new Set(
        cards
            .filter((card) => !card.isFolder && card.status === "Просмотрено")
            .map((card) => getCleanId(card.id, "anime-")),
    );

    // Считаем, сколько нужных ID есть в просмотренных
    return achievement.requiredIds.filter((id) => watchedIds.has(id)).length;
};

const ACHIEVEMENT_CALCULATORS = {
    // --------------- ГРУППА: МАСТЕРСТВО (Числа и оценки) ---------------

    // Сколько карточек в коллекции
    collector_beginner: (cards) => cards?.length || 0,

    // Сколько карточек в коллекции с флагом isCustom
    creator_beginner: (cards) =>
        cards?.filter((card) => card.isCustom)?.length || 0,

    // Сколько карточек в коллекции с рейтингом 1
    low_rater: (cards) =>
        cards?.filter((card) => Number(card.userScore) === 1)?.length || 0,

    // Сколько карточек в коллекции с рейтингом 10
    high_rater: (cards) =>
        cards?.filter(
            (card) => Number(card.userScore) === 10 || card.isBrilliant,
        )?.length || 0,

    // Суммируем длину массивов screenshots всех карточек
    moment_collector: (cards) =>
        cards?.reduce(
            (total, card) => total + (card.screenshots?.length || 0),
            0,
        ) || 0,

    // Сколько карточек в коллекции с флагом isBrilliant
    brilliant_collector: (cards) =>
        cards?.filter((card) => card.isBrilliant)?.length || 0,

    // -------------------------------------------------------------------

    // --------------- ГРУППА: ПОРЯДОК (Папки и структура) ---------------

    // Считаем только объекты, помеченные как папки
    archivist: (cards) => cards?.filter((card) => card.isFolder).length || 0,

    // Ищем папку, в которой список ID предметов (itemsOrder) > 10
    shelf_master: (cards) =>
        cards?.some((card) => card.isFolder && card.itemsOrder?.length > 10)
            ? 1
            : 0,

    // -------------------------------------------------------------------

    // ------------------------- ГРУППА: СТУДИИ --------------------------

    // Ищет карточки с нужным именем студии в массиве

    madhouse_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Madhouse"]))
            ?.length || 0,
    a1Pictures_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["A-1 pictures"]))
            ?.length || 0,
    studioPierrot_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Studio pierrot"]))
            ?.length || 0,
    WitStudio_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Wit studio"]))
            ?.length || 0,
    cloverworks_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Cloverworks"]))
            ?.length || 0,
    mappa_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Mappa"]))?.length ||
        0,

    // -------------------------------------------------------------------

    // ------------------------- ГРУППА: КОНТЕНТ  ------------------------

    // Проверяем поле origin ("origin": "manga")
    manga_legacy: (cards) =>
        cards?.filter((card) => !card.isFolder && card.origin === "manga")
            ?.length || 0,

    // Проверяем тип аниме (OVA или ONA)
    spinoff_lover: (cards) => {
        return cards?.some(
            (card) =>
                !card.isFolder &&
                (card.animeKind === "ova" || card.animeKind === "ona"),
        )
            ? 1
            : 0;
    },

    // Ищем хотя бы один тайтл, у которого в связях есть одновременно и prequel, и sequel
    family_tree: (cards) => {
        return cards?.some((card) => {
            if (card.isFolder || !card.related) return false;
            const kinds = card.related.map((r) => r.relationKind);
            return kinds.includes("prequel") && kinds.includes("sequel");
        })
            ? 1
            : 0;
    },

    // Ищем карточку, у которой в массиве screenshots больше 30 элементов
    screenshot_master: (cards) =>
        cards?.some((card) => (card.screenshots?.length || 0) > 30) ? 1 : 0,

    // -------------------------------------------------------------------

    // -------------------------- ГРУППА: ЖАНРЫ --------------------------

    // Фильтруем по жанру "Ужасы"
    genre_expert_horror: (cards) =>
        cards?.filter(
            (card) =>
                hasAnyTag(card.genres, ["Ужасы"]) ||
                hasAnyTag(card.subgenres, ["Ужасы"]),
        )?.length || 0,

    // Фильтруем по жанру "Гарем"
    harem_king: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Гарем"]),
        )?.length || 0,

    // Фильтр по жанру "Сёнен"
    forever_young: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Сёнен"]),
        )?.length || 0,

    // Фильтр по жанру "Удостоено наград"
    awards: (cards) =>
        cards?.filter(
            (card) =>
                !card.isFolder && hasAnyTag(card.genres, ["Удостоено наград"]),
        )?.length || 0,

    // Ищем карточку с жанром "Этти"
    fap_fap: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]),
        )?.length || 0,

    // Ищем карточку с жанром "Этти" (другой target)
    more_boobies: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]),
        )?.length || 0,

    // -------------------------------------------------------------------

    // ---------------- ГРУППА: ОСОБЫЕ ЗАСЛУГИ (Скрытые) -----------------

    // Ищет карточку, у которой время создания между 00:00 и 05:00
    night_owl: (cards) =>
        cards?.some((card) => {
            const timestamp = card.createdAt || card.lastStatusChangeAt;
            if (!timestamp) return false;
            const hour = new Date(timestamp).getHours();
            return hour >= 0 && hour < 5;
        })
            ? 1
            : 0,

    // Ищем карточку, где статус явно равен null
    status_uncertain: (cards) =>
        cards?.some((card) => !card.isFolder && card.status === null) ? 1 : 0,

    // Ищем карточку, у которой в названии имя разработчика + оскорбление
    ban: (cards) => {
        const mainWord = "денис";
        const keywords = [
            "хуй",
            "хуесос",
            "хуйня",
            "долбаёб",
            "долбаеб",
            "пидор",
            "пидорас",
        ];

        return (
            cards?.filter((card) => {
                const title = (
                    card.title + (card.englishTitle || "")
                ).toLowerCase();

                // Условие: название содержит основное слово И одно из ключевых
                const hasMainWord = title.includes(mainWord);
                const hasAnyKeyword = keywords.some((word) =>
                    title.includes(word),
                );

                return hasMainWord && hasAnyKeyword;
            })?.length || 0
        );
    },

    // -------------------------------------------------------------------
};

export const calculateAchievements = (allCards) => {
    return ACHIEVEMENTS_DATA.map((achievement) => {
        let current = 0;

        // 1. Сначала проверяем, есть ли специфичный калькулятор для этого ID
        if (ACHIEVEMENT_CALCULATORS[achievement.id]) {
            current = ACHIEVEMENT_CALCULATORS[achievement.id](allCards);
        }
        // 2. ЕСЛИ специфичного нет, но есть список ID — используем универсальную функцию
        else if (achievement.requiredIds) {
            current = checkIdsPresence(allCards, achievement);
        }

        const isCompleted = current >= achievement.target;

        return {
            ...achievement,
            current: isCompleted ? achievement.target : current, // Чтобы не было 15/10
            isCompleted,
            // Если скрыта и не выполнена — подменяем текст
            displayTitle:
                achievement.hidden && !isCompleted
                    ? "Секретное достижение"
                    : achievement.title,
            displayDesc:
                achievement.hidden && !isCompleted
                    ? "Постарайся, постарайся"
                    : achievement.description,
            displayIconName:
                achievement.hidden && !isCompleted
                    ? "Lock"
                    : achievement.iconName,
        };
    });
};
