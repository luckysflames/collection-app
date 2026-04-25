import { ANIME_KINDS } from "../constants";

/**
 * Извлекает числовое значение из строки
 */
export const extractNumeric = (value) => {
    if (!value) return null;
    const match = String(value).match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
};

/**
 * Парсит строку с разделителями и возвращает массив
 */
export const parseCommaSeparated = (value) => {
    if (!value) return [];
    return String(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

/**
 * Вычисляет топ-N значений из массива/строк
 */
export const getTopValues = (items, extractor, limit = 5) => {
    const counts = {};

    items.forEach((item) => {
        const values = extractor(item);
        if (Array.isArray(values)) {
            values.forEach((val) => {
                if (val) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            });
        }
    });

    return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([name, count]) => ({ name, count }));
};

/**
 * Вычисляет статистику для одного типа карт
 */
export const calculateStats = (items, category) => {
    const filtered = items.filter(
        (item) => item.appSection === category && !item.isFolder,
    );

    if (filtered.length === 0) {
        return null;
    }

    const stats = {};

    stats.topStatuses = getTopValues(filtered, (item) =>
        item.status ? [item.status] : [],
    );

    switch (category) {
        case "movie": {
            // Топ жанры, страны, компании
            stats.topGenres = getTopValues(filtered, (item) =>
                (item.genres || []).map(
                    (genre) => genre.charAt(0).toUpperCase() + genre.slice(1),
                ),
            );

            stats.topCountries = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.countries),
            );

            stats.topCompanies = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.companies),
            );

            break;
        }

        case "anime": {
            // Топ жанры, типы, студии
            stats.topGenres = getTopValues(
                filtered,
                (item) => item.genres || [],
            );

            stats.topKinds = getTopValues(filtered, (item) => {
                if (!item.animeKind) return [];
                const kindLabel = ANIME_KINDS.find(
                    (k) => k.id === item.animeKind,
                )?.label;
                return kindLabel ? [kindLabel] : [item.animeKind];
            });

            stats.topStudios = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.studios),
            );

            break;
        }

        case "game": {
            // Топ жанры, платформы, разработчики
            stats.topGenres = getTopValues(
                filtered,
                (item) => item.genres || [],
            );

            stats.topPlatforms = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.platforms),
            );

            stats.topDevelopers = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.developers),
            );

            break;
        }

        case "book": {
            // Топ жанры, авторы, издатели
            stats.topGenres = getTopValues(
                filtered,
                (item) => item.genres || [],
            );

            stats.topAuthors = getTopValues(filtered, (item) =>
                parseCommaSeparated(item.authors),
            );

            stats.topPublishers = getTopValues(filtered, (item) =>
                item.publisher ? [item.publisher] : [],
            );

            break;
        }

        default:
            break;
    }

    return stats;
};
