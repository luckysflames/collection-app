import { ACHIEVEMENTS_DATA } from "../constants/index";

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

const createCardMap = (cards) => {
    const map = new Map();
    cards?.forEach((card) => {
        if (card?.id != null) {
            map.set(String(card.id), card);
        }
    });
    return map;
};

const calcSeriesFinisher = (cards) => {
    if (!cards?.length) return 0;
    const cardById = createCardMap(cards);
    const checkedIds = new Set(); // Чтобы не считать один и тот же тайтл дважды
    let completedFranchises = 0;

    cards.forEach((card) => {
        if (checkedIds.has(card.id) || card.status !== "Просмотрено") return;

        // Собираем всю семью (текущий + связанные)
        const family = [
            card,
            ...toArray(card.related)
                .map((r) => cardById.get(String(r.id)))
                .filter(Boolean),
        ];

        // Проверяем, что ВСЕ найденные члены семьи имеют статус "Просмотрено"
        const isFullFamilyWatched = family.every(
            (member) => member.status === "Просмотрено",
        );

        if (isFullFamilyWatched) {
            completedFranchises += 1;
            family.forEach((f) => checkedIds.add(f.id)); // Помечаем всю ветку как обработанную
        }
    });

    return completedFranchises;
};

const ACHIEVEMENT_CALCULATORS = {
    collector_beginner: (cards) => cards?.length || 0,
    series_finisher: calcSeriesFinisher,
    genre_expert_horror: (cards) =>
        cards?.filter(
            (card) =>
                hasAnyTag(card.genres, ["Ужасы", "Horror"]) ||
                hasAnyTag(card.subgenres, ["Ужасы", "Horror"]),
        )?.length || 0,
    night_owl: (cards) =>
        cards?.some((card) => {
            const timestamp = card.createdAt || card.lastStatusChangeAt;
            if (!timestamp) return false;
            const hour = new Date(timestamp).getHours();
            return hour >= 0 && hour < 5;
        })
            ? 1
            : 0,
    high_rater: (cards) =>
        cards?.filter(
            (card) => Number(card.userScore) === 10 || card.isBrilliant,
        )?.length || 0,
    studio_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Madhouse"]))
            ?.length || 0,
    screenshot_master: (cards) =>
        cards?.some((card) => (card.screenshots?.length || 0) > 30) ? 1 : 0,
    brilliant_collector: (cards) =>
        cards?.filter((card) => card.isBrilliant)?.length || 0,
    // Считаем только объекты, помеченные как папки
    archivist: (cards) => cards?.filter((card) => card.isFolder).length || 0,

    // Ищем папку, в которой список ID предметов (itemsOrder) > 10
    shelf_master: (cards) =>
        cards?.some((card) => card.isFolder && card.itemsOrder?.length > 10)
            ? 1
            : 0,

    // Фильтруем по жанру "Гарем"
    harem_king: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Гарем"]),
        )?.length || 0,

    // Проверяем поле origin (из твоего бэкапа: "origin": "manga")
    manga_legacy: (cards) =>
        cards?.filter((card) => !card.isFolder && card.origin === "manga")
            ?.length || 0,

    // Секретка: ищем карточку, где статус явно равен null
    status_uncertain: (cards) =>
        cards?.some((card) => !card.isFolder && card.status === null) ? 1 : 0,
    // Проверяем тип аниме (OVA) или наличие связи "side_story" в массиве related
    spinoff_lover: (cards) => {
        return cards?.some(
            (card) =>
                !card.isFolder &&
                (card.animeKind === "ova" ||
                    card.related?.some(
                        (r) =>
                            r.relationKind === "side_story" ||
                            r.relationKind === "ova",
                    )),
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

    // Фильтр по жанру Сёнен
    forever_young: (cards) =>
        cards?.filter(
            (card) =>
                !card.isFolder && hasAnyTag(card.genres, ["Сёнен", "Shounen"]),
        )?.length || 0,

    // Суммируем длину массивов screenshots всех карточек
    moment_collector: (cards) =>
        cards?.reduce(
            (total, card) => total + (card.screenshots?.length || 0),
            0,
        ) || 0,

    // Секретка: проверяем вхождение слов в названии
    no_personal_life: (cards) => {
        const keywords = [
            "учиться",
            "учёба",
            "экзамен",
            "learn",
            "study",
            "exam",
        ];
        return (
            cards?.filter((card) => {
                if (card.isFolder) return false;
                const title = (
                    card.title + (card.englishTitle || "")
                ).toLowerCase();
                return keywords.some((word) => title.includes(word));
            })?.length || 0
        );
    },

    fap_fap: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]),
        )?.length || 0,

    more_boobies: (cards) =>
        cards?.filter(
            (card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]),
        )?.length || 0,
};

export const calculateAchievements = (allCards) => {
    return ACHIEVEMENTS_DATA.map((achievement) => {
        const current =
            ACHIEVEMENT_CALCULATORS[achievement.id]?.(allCards) || 0;
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
                    ? "Условия неизвестны..."
                    : achievement.description,
            displayIconName:
                achievement.hidden && !isCompleted
                    ? "Lock"
                    : achievement.iconName,
        };
    });
};
