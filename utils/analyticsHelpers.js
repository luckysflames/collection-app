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
 * Вычисляет топ-N значений.
 * Если sortByScore = true, то сортирует по среднему баллу.
 */
export const getTopValues = (
    items,
    extractor,
    sortByScore = false,
    limit = 5,
) => {
    const statsMap = {};

    items.forEach((item) => {
        const values = extractor(item);
        if (Array.isArray(values)) {
            values.forEach((val) => {
                if (val) {
                    if (!statsMap[val]) {
                        statsMap[val] = { count: 0, totalScore: 0 };
                    }
                    statsMap[val].count += 1;
                    statsMap[val].totalScore += item.userScore || 0;
                }
            });
        }
    });

    return Object.entries(statsMap)
        .map(([name, data]) => {
            const avgScore = data.totalScore / data.count;
            return {
                name,
                // Если режим оценки — берем среднее, если обычный — количество
                count: sortByScore
                    ? parseFloat(avgScore.toFixed(1))
                    : data.count,
                // Сохраняем реальное кол-во для доп. инфо (опционально)
                realCount: data.count,
            };
        })
        .sort((a, b) => b.count - a.count) // Сортируем по полю count (там либо баллы, либо кол-во)
        .slice(0, limit);
};

/**
 * Вычисляет статистику (теперь принимает третий аргумент sortByScore)
 */
export const calculateStats = (items, category, sortByScore = false) => {
    const filtered = items.filter(
        (item) => item.appSection === category && !item.isFolder,
    );

    if (filtered.length === 0) return null;

    const stats = {};

    // Вспомогательная функция, чтобы не дублировать sortByScore в каждом вызове
    const getTop = (extractor) =>
        getTopValues(filtered, extractor, sortByScore);

    stats.topStatuses = getTop((item) => (item.status ? [item.status] : []));

    switch (category) {
        case "movie":
            stats.topGenres = getTop((item) =>
                (item.genres || []).map(
                    (g) => g.charAt(0).toUpperCase() + g.slice(1),
                ),
            );
            stats.topCountries = getTop((item) =>
                parseCommaSeparated(item.countries),
            );
            stats.topCompanies = getTop((item) =>
                parseCommaSeparated(item.companies),
            );
            break;

        case "anime":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topKinds = getTop((item) => {
                const kind = ANIME_KINDS.find((k) => k.id === item.animeKind);
                return kind
                    ? [kind.label]
                    : item.animeKind
                      ? [item.animeKind]
                      : [];
            });
            stats.topStudios = getTop((item) =>
                parseCommaSeparated(item.studios),
            );
            break;

        case "game":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topPlatforms = getTop((item) =>
                parseCommaSeparated(item.platforms),
            );
            stats.topDevelopers = getTop((item) =>
                parseCommaSeparated(item.developers),
            );
            break;

        case "book":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topAuthors = getTop((item) =>
                parseCommaSeparated(item.authors),
            );
            stats.topPublishers = getTop((item) =>
                item.publisher ? [item.publisher] : [],
            );
            break;
    }

    return stats;
};
