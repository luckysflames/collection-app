import { ANIME_KINDS } from "../constants/index";

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
 * Вычисляет топ-N значений на основе среднего балла.
 * Если onlyRated = true, сортируем по рейтингу.
 * Если false (обычный режим), сортируем по количеству.
 */
export const getTopValues = (
    items,
    extractor,
    onlyRated = false,
    limit = 16,
) => {
    const statsMap = {};

    items.forEach((item) => {
        if (onlyRated && !item.isBrilliant && (!item.userScore || item.userScore === 0)) {
            return;
        }

        const values = extractor(item);
        if (Array.isArray(values)) {
            values.forEach((val) => {
                if (val) {
                    if (!statsMap[val]) {
                        statsMap[val] = { count: 0, totalScore: 0 };
                    }
                    statsMap[val].count += 1;
                    statsMap[val].totalScore += item.isBrilliant ? 11 : (item.userScore || 0);
                }
            });
        }
    });

    return Object.entries(statsMap)
        .map(([name, data]) => ({
            name,
            avgScore: data.totalScore / data.count,
            realCount: data.count,
        }))
        .sort((a, b) => {
            if (onlyRated) {
                // СОРТИРОВКА ПО СРЕДНЕМУ БАЛЛУ
                // Если баллы равны, смотрим на количество
                return b.avgScore - a.avgScore || b.realCount - a.realCount;
            }
            // ОБЫЧНАЯ СОРТИРОВКА ПО КОЛИЧЕСТВУ
            return b.realCount - a.realCount;
        })
        .slice(0, limit)
        .map((item) => ({
            name: item.name,
            // ВАЖНО: всегда возвращаем количество для отображения справа
            count: item.realCount,
            // Доп. инфо для отладки или будущих фич
            avgScore: parseFloat(item.avgScore.toFixed(1)),
            isScoreBased: onlyRated,
        }));
};

/**
 * Вычисляет статистику (теперь принимает третий аргумент sortByScore)
 */
export const calculateStats = (items, category, onlyRated = false) => {
    const filtered = items.filter(
        (item) => item.appSection === category && !item.isFolder,
    );

    if (filtered.length === 0) return null;

    const stats = {};

    const getTop = (extractor) => getTopValues(filtered, extractor, onlyRated);

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
