import { parseList } from "./listParser";

const splitString = (str) => {
    const items = parseList(str);

    return items.filter(Boolean).map((s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    });
};

// Извлекаем только числовое значение, убираем любые единицы (мин., стр., ч., $)
const extractNumeric = (value) => {
    if (!value) return "";

    // 1. Приводим к строке и заменяем запятую на точку, чтобы "1,5" стало "1.5"
    const normalized = String(value).replace(",", ".");

    // 2. Ищем число (целое или с плавающей точкой)
    const match = normalized.match(/\d+(\.\d+)?/);

    return match ? match[0] : "";
};

export const prepareDataForSave = (formData, itemType) => {
    // Определяем тип максимально надежно
    const type = formData.type || itemType;

    const baseData = {
        type: type, // Обязательно сохраняем тип в объекте
        title: formData.title,
        description: formData.description,
        image: formData.image,
        genres: splitString(formData.genres),
        status: formData.status,
        isFavorite: formData.status === "Избранное",
        isCustom: true,
    };

    let extendedData = {};

    switch (type) {
        case "movie":
            extendedData = {
                year: formData.year,
                budget: extractNumeric(formData.budget) || "", // Только цифры
                movieStatus: formData.movieStatus,
                countries: splitString(formData.countries),
                companies: splitString(formData.companies),
                duration: extractNumeric(formData.duration) || "", // Только цифры
                originalTitle: formData.originalTitle,
            };
            break;
        case "tv":
            extendedData = {
                year: formData.year,
                budget: extractNumeric(formData.budget) || "",
                movieStatus: formData.movieStatus,
                countries: splitString(formData.countries),
                companies: splitString(formData.companies),
                duration: extractNumeric(formData.duration) || "",
                originalTitle: formData.originalTitle,
                seasonsCount: extractNumeric(formData.seasons) || "",
                episodesCount: extractNumeric(formData.episodes) || "",
            };
            break;
        case "anime":
            extendedData = {
                englishTitle: formData.englishTitle,
                japaneseTitle: formData.japaneseTitle,
                animeKind: formData.animeKind || formData.kind,
                rating: formData.rating,
                airedOn: formData.airedOn,
                releasedOn: formData.releasedOn,
                episodes: extractNumeric(formData.episodes) || "", // Только цифры
                episodesAired: extractNumeric(formData.episodesAired) || "", // Только цифры
                studios: splitString(formData.studios),
                duration: extractNumeric(formData.duration) || "", // Только цифры
                animeStatus: formData.animeStatus,
            };
            break;
        case "book":
            extendedData = {
                year: formData.year,
                pageCount: extractNumeric(formData.pageCount) || "", // Только цифры
                maturityRating: formData.maturityRating,
                authors: splitString(formData.authors),
                publisher: formData.publisher,
            };
            break;
        case "game":
            extendedData = {
                year: formData.year,
                metacritic: extractNumeric(formData.metacritic) || "", // Только цифры
                esrb: formData.esrb,
                developers: splitString(formData.developers),
                platforms: splitString(formData.platforms),
                duration: extractNumeric(formData.duration) || "", // Только цифры
            };
            break;
    }

    return { ...baseData, ...extendedData };
};
