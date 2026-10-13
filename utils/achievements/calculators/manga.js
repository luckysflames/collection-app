import { hasAnyTag } from "../helpers";

const getList = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.trim()) {
        return value
            .split(/[;,]/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
};

const countMostCommonCredit = (cards, field) => {
    const counts = new Map();

    cards?.forEach((card) => {
        if (card.type !== "manga" || card.isFolder) return;

        const credits = new Set(
            getList(card[field]).map((credit) => credit.toLocaleLowerCase().trim()),
        );
        credits.forEach((credit) => {
            counts.set(credit, (counts.get(credit) || 0) + 1);
        });
    });

    return Math.max(0, ...counts.values());
};

export const mangaCalculators = {
    manga_reader: (cards) =>
        cards?.filter((card) => card.type === "manga" && !card.isFolder).length || 0,

    manga_finished_reader: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" && !card.isFolder && card.status === "Прочитано",
        ).length || 0,

    manga_currently_reading: (cards) =>
        cards?.filter((card) => card.type === "manga" && !card.isFolder && card.status === "Читаю")
            .length || 0,

    manga_long_series: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                Number(card.chapters) > 100,
        ).length || 0,

    manga_classic: (cards) =>
        cards?.filter((card) => {
            if (card.type !== "manga" || card.isFolder || !card.year) return false;
            const match = String(card.year).match(/\b(19|20)\d{2}\b/);
            return match ? Number(match[0]) < 2000 : false;
        }).length || 0,

    manga_fantasy_world: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Фэнтези"]),
        ).length || 0,

    manga_horror_fan: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Ужасы"]),
        ).length || 0,

    manga_shonen_fan: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Сёнен"]),
        ).length || 0,

    manga_author_fan: (cards) => countMostCommonCredit(cards, "authors"),

    manga_publisher_fan: (cards) => countMostCommonCredit(cards, "publishers"),

    manga_high_score: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                Number(card.score) >= 8,
        ).length || 0,

    manga_favorite_shelf: (cards) =>
        cards?.filter(
            (card) => card.type === "manga" && !card.isFolder && card.isFavorite,
        ).length || 0,

    manga_custom_creator: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                (card.isCustom || !card.id?.startsWith("manga-")),
        ).length || 0,

    manga_perfect_score: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) === 10,
        ).length || 0,

    manga_masterpiece: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                Number(card.userScore) === 10,
        ).length || 0,

    manga_brick_layer: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                Number(card.volumes) > 20,
        ).length || 0,

    manga_chapter_marathon: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                Number(card.chapters) > 500,
        ).length || 0,

    manga_low_score: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "manga" &&
                !card.isFolder &&
                card.userScore > 0 &&
                Number(card.userScore) <= 4,
        ).length || 0,
};
