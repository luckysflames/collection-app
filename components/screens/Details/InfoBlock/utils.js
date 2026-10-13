import { COUNTRIES_MAP, COUNTRIES_MAP_FULL_NAME_MAP } from "../../../../constants/countries";
import { ANIME_KINDS, MANGA_KINDS } from "../../../../constants/forms";

export const formatDate = (date) => (date ? date.split("-").reverse().join(".") : "?");
export const formatRating = (rating) => (rating ? rating.replace("_", "-").toUpperCase() : "?");

export const formatKind = (kind) => {
    if (!kind) return "?";
    const foundKind = ANIME_KINDS.find((item) => item.id === kind.toLowerCase());
    return foundKind ? foundKind.label : kind.toUpperCase();
};

export const formatMangaKind = (kind) => {
    if (!kind) return "?";
    const foundKind = MANGA_KINDS.find((item) => item.id === kind.toLowerCase());
    return foundKind ? foundKind.label : kind.toUpperCase();
};

// 1. ДЛЯ СЕРИАЛОВ (Работает строго с двухбуквенными кодами "US", "RU")
export const formatTVCountries = (countries) => {
    if (!countries) return "Неизвестно";

    if (Array.isArray(countries)) {
        if (countries.length === 0) return "Неизвестно";
        return countries
            .map((code) => {
                const upper = String(code).toUpperCase().trim();
                return COUNTRIES_MAP[upper] || code;
            })
            .join(", ");
    }

    const upperCode = String(countries).toUpperCase().trim();
    return COUNTRIES_MAP[upperCode] || countries;
};

// 2. ДЛЯ ФИЛЬМОВ (Работает строго с полными английскими названиями "United States")
export const formatMovieCountries = (countries) => {
    if (!countries) return "Неизвестно";

    if (Array.isArray(countries)) {
        if (countries.length === 0) return "Неизвестно";
        return countries
            .map((name) => {
                const lower = String(name).toLowerCase().trim();
                return COUNTRIES_MAP_FULL_NAME_MAP[lower] || name;
            })
            .join(", ");
    }

    const lowerName = String(countries).toLowerCase().trim();
    return COUNTRIES_MAP_FULL_NAME_MAP[lowerName] || countries;
};
