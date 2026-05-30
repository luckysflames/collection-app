import { hasAnyTag } from "../helpers";

export const gameCalculators = {
    // Всего игр в разделе
    game_collector: (cards) =>
        cards?.filter((card) => card.type === "game" && !card.isFolder).length || 0,

    // Пройдено игр
    game_completed: (cards) =>
        cards?.filter(
            (card) => card.type === "game" && !card.isFolder && card.status === "Пройдено",
        ).length || 0,

    // Жанр RPG
    game_rpg_lover: (cards) =>
        cards?.filter(
            (card) => card.type === "game" && !card.isFolder && hasAnyTag(card.genres, ["RPG"]),
        ).length || 0,

    // Жанр Action / Экшен-платформер
    game_action_addict: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Action", "Экшен-платформер", "Боевик"]),
        ).length || 0,

    // Время прохождения > 100 часов
    game_time_killer: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                card.duration &&
                Number(card.duration) > 100,
        ).length || 0,

    // Ретро-вайб (Релиз до 2015 года)
    game_retro_vibe: (cards) =>
        cards?.filter((card) => {
            if (card.type !== "game" || card.isFolder || !card.year) return false;
            // Вытаскиваем последние 4 цифры года независимо от формата (ДД.ММ.ГГГГ или ГГГГ-ММ-ДД)
            const match = card.year.toString().match(/\b(19|20)\d{2}\b/);
            if (!match) return false;
            const releaseYear = parseInt(match[0], 10);
            return releaseYear < 2015;
        }).length || 0,

    // Metacritic > 85
    game_metacritic_gold: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                card.metacritic &&
                Number(card.metacritic) >= 85,
        ).length || 0,

    // Личная оценка = 10
    game_perfect_ten: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) === 10,
        ).length || 0,

    // Статус "Играю" одновременно
    game_active_gamer: (cards) =>
        cards?.filter((card) => card.type === "game" && !card.isFolder && card.status === "Играю")
            .length || 0,

    // Кастомные карточки
    game_custom_creator: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                (card.isCustom || !card.id?.startsWith("game-")),
        ).length || 0,

    // СЕКРЕТНЫЕ: Идеальное прохождение (Платина)
    game_platinum_god: (cards) =>
        cards?.filter((card) => card.type === "game" && !card.isFolder && card.isBrilliant === true)
            .length || 0,

    // СЕКРЕТНЫЕ: Рейтинг Mature / 18+
    game_hardcore_mature: (cards) =>
        cards?.filter((card) => {
            if (card.type !== "game" || card.isFolder || !card.esrb) return false;
            const rating = card.esrb.toLowerCase();
            return rating.includes("mature") || rating.includes("18") || rating.includes("m");
        }).length || 0,

    // СЕКРЕТНЫЕ: Любимые инди- и ААА-разработчики
    game_indie_devotion: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                hasAnyTag(card.developers, [
                    "Team Cherry",
                    "Sucker Punch Productions",
                    "Supergiant Games",
                    "FromSoftware",
                ]),
        ).length || 0,

    // СЕКРЕТНЫЕ: Мультиплатформа (> 5 платформ доступно)
    game_multiplatform: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "game" &&
                !card.isFolder &&
                Array.isArray(card.platforms) &&
                card.platforms.length >= 5,
        ).length || 0,
};
