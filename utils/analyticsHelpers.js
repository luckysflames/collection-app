import { ANIME_KINDS, MANGA_KINDS } from "../constants/index";
import { parseList } from "./listParser";

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
export const parseCommaSeparated = (value) => parseList(value);

/**
 * Переводит часы в строку формата "X дн Y ч" или "Y ч"
 */
export const formatHoursToDaysAndHours = (totalHours) => {
    if (!totalHours || totalHours <= 0) return "0 ч";

    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    const parts = [];
    if (days > 0) parts.push(`${days} дн`);
    if (hours > 0 || days === 0) parts.push(`${hours} ч`);

    return parts.join(" ");
};

const formatMangaReadingTime = (totalMinutes) => {
    if (totalMinutes < 60) return `${Math.round(totalMinutes)} мин.`;
    return formatHoursToDaysAndHours(Math.round(totalMinutes / 60));
};

const MANGA_GENRE_READING_ADJUSTMENTS = {
    "экшен": -0.75,
    "боевые искусства": -0.75,
    "приключения": -0.5,
    "спорт": -0.5,
    "сенен": -0.5,
    "комедия": -0.25,
    "детектив": 1.5,
    "тайна": 1.5,
    "психологическое": 1.5,
    "драма": 1,
    "исторический": 1,
    "повседневность": 0.75,
    "дзосей": 0.75,
    "сэйнэн": 0.5,
    "трагедия": 0.5,
    "триллер": 0.5,
};

const estimateMangaMinutesPerChapter = (item) => {
    const mangaKind = String(item.mangaKind || "").toLowerCase();
    const baseMinutes =
        mangaKind === "novel" || mangaKind === "light_novel"
            ? 15
            : mangaKind === "one_shot"
              ? 20
              : 5;
    const genres = parseCommaSeparated(item.genres).map((genre) =>
        genre.toLocaleLowerCase("ru").replace(/ё/g, "е").trim(),
    );
    const genreAdjustment = genres.reduce(
        (total, genre) => total + (MANGA_GENRE_READING_ADJUSTMENTS[genre] || 0),
        0,
    );

    return Math.min(20, Math.max(3, baseMinutes + genreAdjustment));
};

/**
 * Вычисляет количество минут для одной карточки на основе её категории.
 */
export const calculateItemMinutes = (item) => {
    if (!item || !item.appSection) return 0;

    const targetCategory = item.appSection.toLowerCase();

    switch (targetCategory) {
        case "movie":
            return extractNumeric(item.duration) || 0;

        case "tv":
            const episodesTV = extractNumeric(item.episodesCount) || 0;
            const durationPerEpTV = extractNumeric(item.duration) || 40;
            return episodesTV * durationPerEpTV;

        case "anime":
            const episodes =
                extractNumeric(item.episodes) || extractNumeric(item.episodesAired) || 0;
            const durationPerEp = extractNumeric(item.duration) || 24;
            return episodes * durationPerEp;

        case "book":
            const pages = extractNumeric(item.pageCount) || 0;
            return Math.round(pages * 1.5);

        case "manga": {
            const chapters = extractNumeric(item.chapters) || 0;
            return Math.round(chapters * estimateMangaMinutesPerChapter(item));
        }

        case "game":
            const hours = extractNumeric(item.duration) || 0;
            return hours * 60;

        default:
            return 0;
    }
};

/**
 * Считает суммарное время для всей переданной коллекции (с форматированием)
 */
export const calculateCollectionTime = (items) => {
    if (!Array.isArray(items))
        return { totalHours: 0, completedHours: 0, totalDisplay: "0 ч", completedDisplay: "0 ч" };

    const filtered = items.filter((item) => !item.isFolder);
    const completedStatuses = ["Просмотрено", "Прочитано", "Пройдено"];

    let totalMinutesAll = 0;
    let totalMinutesCompleted = 0;

    filtered.forEach((item) => {
        const minutes = calculateItemMinutes(item);
        totalMinutesAll += minutes;

        if (completedStatuses.includes(item.status)) {
            totalMinutesCompleted += minutes;
        }
    });

    const totalHours = Math.round(totalMinutesAll / 60);
    const completedHours = Math.round(totalMinutesCompleted / 60);

    return {
        totalHours,
        completedHours,
        totalDisplay: formatHoursToDaysAndHours(totalHours),
        completedDisplay: formatHoursToDaysAndHours(completedHours),
    };
};

/**
 * Вычисляет топ-N значений на основе среднего балла.
 */
export const getTopValues = (items, extractor, onlyRated = false, limit = 16) => {
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
                    statsMap[val].totalScore += item.isBrilliant ? 11 : item.userScore || 0;
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
                return b.avgScore - a.avgScore || b.realCount - a.realCount;
            }
            return b.realCount - a.realCount;
        })
        .slice(0, limit)
        .map((item) => ({
            name: item.name,
            count: item.realCount,
            avgScore: parseFloat(item.avgScore.toFixed(1)),
            isScoreBased: onlyRated,
        }));
};

/**
 * Вычисляет статистику категории
 */
export const calculateStats = (items, category, onlyRated = false) => {
    if (!category || typeof category !== "string") return null;

    const targetCategory = category.toLowerCase();

    const filtered = items.filter((item) => {
        const itemSection = item.appSection ? item.appSection.toLowerCase() : "";
        return itemSection === targetCategory && !item.isFolder;
    });

    if (filtered.length === 0) return null;

    const totalMinutesAll = filtered.reduce((acc, item) => acc + calculateItemMinutes(item), 0);

    const completedStatuses = ["Просмотрено", "Прочитано", "Пройдено"];
    const totalMinutesCompleted = filtered
        .filter((i) => completedStatuses.includes(i.status))
        .reduce((acc, item) => acc + calculateItemMinutes(item), 0);

    const totalHours = Math.round(totalMinutesAll / 60);
    const completedHours = Math.round(totalMinutesCompleted / 60);

    const stats = {
        timeStats: {
            totalHours,
            completedHours,
            totalDisplay:
                targetCategory === "manga"
                    ? formatMangaReadingTime(totalMinutesAll)
                    : formatHoursToDaysAndHours(totalHours),
            completedDisplay:
                targetCategory === "manga"
                    ? formatMangaReadingTime(totalMinutesCompleted)
                    : formatHoursToDaysAndHours(completedHours),
        },
    };

    const getTop = (extractor) => getTopValues(filtered, extractor, onlyRated);

    stats.topStatuses = getTop((item) => (item.status ? [item.status] : []));

    switch (targetCategory) {
        case "movie":
        case "tv":
            stats.topGenres = getTop((item) =>
                (item.genres || []).map((g) => g.charAt(0).toUpperCase() + g.slice(1)),
            );
            stats.topCountries = getTop((item) => parseCommaSeparated(item.countries));
            stats.topCompanies = getTop((item) => parseCommaSeparated(item.companies));
            break;

        case "anime":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topKinds = getTop((item) => {
                const kind = ANIME_KINDS.find((k) => k.id === item.animeKind);
                return kind ? [kind.label] : item.animeKind ? [item.animeKind] : [];
            });
            stats.topStudios = getTop((item) => parseCommaSeparated(item.studios));
            break;

        case "manga":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topKinds = getTop((item) => {
                const kind = MANGA_KINDS.find((option) => option.id === item.mangaKind);
                return kind ? [kind.label] : item.mangaKind ? [item.mangaKind] : [];
            });
            stats.topAuthors = getTop((item) => parseCommaSeparated(item.authors));
            stats.topPublishers = getTop((item) => parseCommaSeparated(item.publishers));
            break;

        case "game":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topPlatforms = getTop((item) => parseCommaSeparated(item.platforms));
            stats.topDevelopers = getTop((item) => parseCommaSeparated(item.developers));
            break;

        case "book":
            stats.topGenres = getTop((item) => item.genres || []);
            stats.topAuthors = getTop((item) => parseCommaSeparated(item.authors));
            stats.topPublishers = getTop((item) => (item.publisher ? [item.publisher] : []));
            break;
    }

    return stats;
};
