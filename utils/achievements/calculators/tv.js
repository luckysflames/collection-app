import { hasAnyTag } from "../helpers";

export const tvCalculators = {
    // Количество сериалов в секции
    tv_series_collector: (cards) =>
        cards?.filter((card) => card.type === "tv" && !card.isFolder).length || 0,

    // Просмотренные до конца (проверяем по твоему кастомному полю status)
    tv_binge_watcher: (cards) =>
        cards?.filter(
            (card) => card.type === "tv" && !card.isFolder && card.status === "Просмотрено",
        ).length || 0,

    // Жанры Экшен / Приключения / Фэнтези
    tv_adventure_time: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Боевик и Приключения", "НФ и Фэнтези"]),
        ).length || 0,

    // Мини-сериалы (не более 10 серий)
    tv_miniseries_lover: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                card.episodesCount &&
                Number(card.episodesCount) <= 10,
        ).length || 0,

    // Новинки (текущий или прошлый год)
    tv_fresh_release: (cards) => {
        const currentYear = new Date().getFullYear();
        return (
            cards?.filter((card) => {
                if (card.type !== "tv" || card.isFolder || !card.first_air_date) return false;
                const releaseYear = parseInt(card.first_air_date.split("-")[0], 10);
                return releaseYear === currentYear || releaseYear === currentYear - 1;
            }).length || 0
        );
    },

    // Рейтинг TMDB > 8.0
    tv_high_score: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" && !card.isFolder && card.score && parseFloat(card.score) > 8.0,
        ).length || 0,

    // Личная оценка = 10
    tv_perfect_ten: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) === 10,
        ).length || 0,

    // В планах > 15
    tv_hoarder: (cards) =>
        cards?.filter((card) => card.type === "tv" && !card.isFolder && card.status === "В планах")
            .length || 0,

    // Кастомные карточки
    tv_custom_creator: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                (card.isCustom || !card.id?.startsWith("tv-")),
        ).length || 0,

    // СЕКРЕТНЫЕ: Эпизодов > 100
    tv_marathon_boss: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                card.episodesCount &&
                Number(card.episodesCount) > 100,
        ).length || 0,

    // СЕКРЕТНЫЕ: Сезонов >= 8
    tv_long_live: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                card.seasonsCount &&
                Number(card.seasonsCount) >= 8,
        ).length || 0,

    // СЕКРЕТНЫЕ: Стриминги Amazon или Netflix
    tv_streaming_addict: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                hasAnyTag(card.companies, ["Amazon Studios", "Amazon MGM Studios", "Netflix"]),
        ).length || 0,

    // СЕКРЕТНЫЕ: Полностью завершенные сериалы
    tv_legendary_finish: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "tv" &&
                !card.isFolder &&
                card.movieStatus === "ended" &&
                card.movieStatus === "released",
        ).length || 0,
};
