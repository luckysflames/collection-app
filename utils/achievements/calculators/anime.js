import { hasAnyTag } from "../helpers";

export const animeCalculators = {
    // ------------------------- ГРУППА: СТУДИИ --------------------------

    // Ищет карточки с нужным именем студии в массиве

    madhouse_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Madhouse"]))?.length || 0,
    a1Pictures_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["A-1 pictures"]))?.length || 0,
    studioPierrot_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Studio pierrot"]))?.length || 0,
    WitStudio_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Wit studio"]))?.length || 0,
    cloverworks_fan: (cards) =>
        cards?.filter((card) => hasAnyTag(card.studios, ["Cloverworks"]))?.length || 0,
    mappa_fan: (cards) => cards?.filter((card) => hasAnyTag(card.studios, ["Mappa"]))?.length || 0,

    // -------------------------------------------------------------------

    // ------------------------- ГРУППА: КОНТЕНТ  ------------------------

    // Проверяем поле origin ("origin": "manga")
    manga_legacy: (cards) =>
        cards?.filter((card) => !card.isFolder && card.origin === "manga")?.length || 0,

    // Проверяем тип аниме (OVA или ONA)
    spinoff_lover: (cards) => {
        return cards?.some(
            (card) => !card.isFolder && (card.animeKind === "ova" || card.animeKind === "ona"),
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

    screenshot_master: (cards) => {
        return cards?.some(
            (card) => card.screenshots?.length === 30,
        )
            ? 1
            : 0;
    },
    // -------------------------------------------------------------------

    // -------------------------- ГРУППА: ЖАНРЫ --------------------------

    // Фильтруем по жанру "Гарем"
    harem_king: (cards) =>
        cards?.filter((card) => !card.isFolder && hasAnyTag(card.genres, ["Гарем"]))?.length || 0,

    // Фильтр по жанру "Сёнен"
    forever_young: (cards) =>
        cards?.filter((card) => !card.isFolder && hasAnyTag(card.genres, ["Сёнен"]))?.length || 0,

    // Фильтр по жанру "Удостоено наград"
    awards: (cards) =>
        cards?.filter((card) => !card.isFolder && hasAnyTag(card.genres, ["Удостоено наград"]))
            ?.length || 0,

    // Ищем карточку с жанром "Этти"
    fap_fap: (cards) =>
        cards?.filter((card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]))?.length || 0,

    // Ищем карточку с жанром "Этти" (другой target)
    more_boobies: (cards) =>
        cards?.filter((card) => !card.isFolder && hasAnyTag(card.genres, ["Этти"]))?.length || 0,

    // -------------------------------------------------------------------
};
