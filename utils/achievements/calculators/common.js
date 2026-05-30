import { hasAnyTag } from "../helpers";

export const commonCalculators = {
    // --------------- ГРУППА: МАСТЕРСТВО (Числа и оценки) ---------------

    // Сколько карточек в коллекции
    collector_beginner: (cards) => cards?.length || 0,

    // Сколько карточек в коллекции с флагом isCustom
    creator_beginner: (cards) => cards?.filter((card) => card.isCustom)?.length || 0,

    // Сколько карточек в коллекции с рейтингом 1
    low_rater: (cards) => cards?.filter((card) => Number(card.userScore) === 1)?.length || 0,

    // Сколько карточек в коллекции с рейтингом 10
    high_rater: (cards) =>
        cards?.filter((card) => Number(card.userScore) === 10 || card.isBrilliant)?.length || 0,

    // Суммируем длину массивов screenshots всех карточек
    moment_collector: (cards) =>
        cards?.reduce((total, card) => total + (card.screenshots?.length || 0), 0) || 0,

    // Сколько карточек в коллекции с флагом isBrilliant
    brilliant_collector: (cards) => cards?.filter((card) => card.isBrilliant)?.length || 0,

    // -------------------------------------------------------------------

    // --------------- ГРУППА: ПОРЯДОК (Папки и структура) ---------------

    // Считаем только объекты, помеченные как папки
    archivist: (cards) => cards?.filter((card) => card.isFolder).length || 0,

    // Ищем папку, в которой список ID предметов (itemsOrder) > 10
    shelf_master: (cards) =>
        cards?.some((card) => card.isFolder && card.itemsOrder?.length > 10) ? 1 : 0,

    // -------------------------------------------------------------------

    // -------------------------- ГРУППА: ЖАНРЫ --------------------------

    // Фильтруем по жанру "Ужасы"
    genre_expert_horror: (cards) =>
        cards?.filter(
            (card) => hasAnyTag(card.genres, ["Ужасы"]) || hasAnyTag(card.subgenres, ["Ужасы"]),
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
            "гей",
        ];

        return (
            cards?.filter((card) => {
                const title = (card.title + (card.englishTitle || "")).toLowerCase();

                // Условие: название содержит основное слово И одно из ключевых
                const hasMainWord = title.includes(mainWord);
                const hasAnyKeyword = keywords.some((word) => title.includes(word));

                return hasMainWord && hasAnyKeyword;
            })?.length || 0
        );
    },

    // -------------------------------------------------------------------
};
