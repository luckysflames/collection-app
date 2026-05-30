import { hasAnyTag } from "../helpers";

export const movieCalculators = {
    // === Группа: Жанровые и тематические испытания ===

    // "Экшен" или "Триллер"
    movie_adrenaline_junkie: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Экшен", "Триллер"]),
        ).length || 0,

    // "Мелодрама" или "Драма"
    movie_tear_jerker: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Мелодрама", "Драма"]),
        ).length || 0,

    // "Детектив" или "Криминал"
    movie_detective: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Детектив", "Криминал"]),
        ).length || 0,

    // "Комедия"
    movie_laughter_therapy: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" && !card.isFolder && hasAnyTag(card.genres, ["Комедия"]),
        ).length || 0,

    // === Группа: Время и Хронометраж (Марафонцы) ===

    // Длительность более 180 минут
    movie_time_killer: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.duration &&
                Number(card.duration) > 180,
        ).length || 0,

    // Длительность менее 85 минут
    movie_short_and_sweet: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.duration &&
                Number(card.duration) < 85,
        ).length || 0,

    // Выпущен до 1980 года (Безопасный split)
    movie_century_surfer: (cards) =>
        cards?.filter((card) => {
            if (card.type !== "movie" || card.isFolder || !card.year) return false;
            const releaseYear = parseInt(card.year?.split("-")?.[0], 10);
            return releaseYear && releaseYear < 1980;
        }).length || 0,

    // Текущий или прошлый год выпуска (Безопасный split)
    movie_fresh_meat: (cards) => {
        const currentYear = new Date().getFullYear();
        return (
            cards?.filter((card) => {
                if (card.type !== "movie" || card.isFolder || !card.year) return false;
                const releaseYear = parseInt(card.year?.split("-")?.[0], 10);
                return releaseYear === currentYear || releaseYear === currentYear - 1;
            }).length || 0
        );
    },

    // === Группа: Экономика и Масштабы (Деньги) ===

    // Бюджет более $150 000 000 (Учитываем, что может прийти строка "?")
    movie_blockbuster_lord: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                typeof card.budget === "number" &&
                card.budget > 150000000,
        ).length || 0,

    // Бюджет меньше $2 000 000 (но больше 0)
    movie_indie_enjoyer: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                typeof card.budget === "number" &&
                card.budget < 2000000 &&
                card.budget > 0,
        ).length || 0,

    // === Группа: География (Кинопутешественники) ===

    // Производство United States of America
    movie_hollywood_addict: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.countries, ["United States of America"]),
        ).length || 0,

    // Фильмы из 4 РАЗНЫХ европейских стран
    movie_euro_trip: (cards) => {
        const europeanCountries = [
            "United Kingdom",
            "France",
            "Germany",
            "Italy",
            "Spain",
            "Netherlands",
            "Belgium",
            "Sweden",
            "Denmark",
            "Norway",
            "Finland",
            "Ireland",
            "Austria",
            "Switzerland",
            "Poland",
            "Czech Republic",
            "Portugal",
            "Greece",
            "Hungary",
        ];

        const foundCountries = new Set();
        cards?.forEach((card) => {
            if (card.type === "movie" && !card.isFolder && card.countries) {
                card.countries.forEach((country) => {
                    if (europeanCountries.includes(country)) {
                        foundCountries.add(country);
                    }
                });
            }
        });
        return foundCountries.size;
    },

    // НЕ в США, НЕ в Европе, НЕ в России
    movie_exotic_cinema: (cards) => {
        const westernAndRuCountries = [
            "United States of America",
            "Russia",
            "Russian Federation",
            "United Kingdom",
            "France",
            "Germany",
            "Italy",
            "Spain",
            "Netherlands",
            "Belgium",
            "Sweden",
            "Denmark",
            "Norway",
            "Finland",
            "Ireland",
            "Austria",
            "Switzerland",
            "Poland",
            "Czech Republic",
            "Portugal",
            "Greece",
            "Hungary",
        ];

        return (
            cards?.filter((card) => {
                if (
                    card.type !== "movie" ||
                    card.isFolder ||
                    !card.countries ||
                    card.countries.length === 0
                ) {
                    return false;
                }
                return !card.countries.some((country) => westernAndRuCountries.includes(country));
            }).length || 0
        );
    },

    // === Группа: Студии (Монстры индустрии) ===

    // 'Walt Disney Pictures' или 'Pixar' (Используем поле card.companies)
    movie_mouse_house: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.companies, ["Walt Disney Pictures", "Pixar"]),
        ).length || 0,

    // 'Warner Bros. Pictures'
    movie_warner_bros: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                hasAnyTag(card.companies, [
                    "Warner Bros. Pictures",
                    "Warner Bros. Pictures Плюс",
                    "Warner Bros.",
                ]),
        ).length || 0,

    // === Группа: Оценки и Критика (Мнения) ===

    // Рейтинг TMDB (score) выше 8.0
    movie_masterpiece: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.score &&
                parseFloat(card.score) > 8.0,
        ).length || 0,

    // Рейтинг TMDB (score) ниже 5.0 (но выше 0)
    movie_trash_collector: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.score &&
                parseFloat(card.score) < 5.0 &&
                parseFloat(card.score) > 0,
        ).length || 0,

    // Личная оценка 4 балла или ниже
    movie_tough_critic: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) <= 4,
        ).length || 0,

    // Личная оценка ровно 10
    movie_generous_soul: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) === 10,
        ).length || 0,

    // === Группа: Поведение и Списки ===

    // В списке "В планах" более 50 фильмов одновременно
    movie_hoarder: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                (card.status === "В планах"),
        ).length || 0,

    // Добавьте 10 фильмов в "Избранное"
    movie_elite_club: (cards) =>
        cards?.filter((card) => card.type === "movie" && !card.isFolder && card.isFavorite)
            .length || 0,

    // Создано вручную (кастомные карточки)
    movie_custom_creator: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "movie" &&
                !card.isFolder &&
                (card.isCustom || !card.id?.startsWith("movie-")),
        ).length || 0,
};
