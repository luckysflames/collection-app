const DYNAMIC_FILTER_FIELDS = [
    "genres",
    "studios",
    "developers",
    "platforms",
    "authors",
    "publishers",
    "companies",
    "countries",
];

export const isDynamicFilterField = (filterKey) =>
    DYNAMIC_FILTER_FIELDS.includes(filterKey);

import { parseList } from "./listParser";

export const splitFilterValues = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return parseList(value);
    }
    return [];
};

export const normalizeNumericValue = (value) => {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    const normalized = String(value).trim();
    if (normalized.length === 0) return null;

    const match = normalized.match(/-?\d+(\.\d+)?/);
    if (!match) return null;

    return Number(match[0]);
};

export const getItemFilterValue = (item, filterKey) => {
    if (!item) return undefined;

    switch (filterKey) {
        case "animeKind":
            return item.animeKind || item.kind;
        case "animeStatus":
            return item.animeStatus || item.status;
        case "mangaStatus":
            return item.mangaStatus;
        case "movieStatus":
            return item.movieStatus || item.status;
        default:
            return item[filterKey];
    }
};

export const matchesFilterValue = (item, filterKey, filterValue) => {
    const itemValue = getItemFilterValue(item, filterKey);

    if (filterValue === undefined) return true;

    if (typeof filterValue === "string") {
        if (itemValue === undefined || itemValue === null) {
            return false;
        }

        if (isDynamicFilterField(filterKey)) {
            const values = splitFilterValues(itemValue);
            return values.includes(String(filterValue));
        }

        return String(itemValue) === String(filterValue);
    }

    if (Array.isArray(filterValue)) {
        if (filterValue.length === 0) return true;

        if (isDynamicFilterField(filterKey)) {
            const values = splitFilterValues(itemValue);
            return filterValue.every((value) => values.includes(String(value)));
        }

        if (filterValue.length === 2) {
            const numericItemValue = normalizeNumericValue(itemValue);
            const min = normalizeNumericValue(filterValue[0]);
            const max = normalizeNumericValue(filterValue[1]);

            if (numericItemValue === null || min === null || max === null) {
                return false;
            }

            return numericItemValue >= min && numericItemValue <= max;
        }

        return filterValue.some(
            (value) => String(itemValue) === String(value),
        );
    }

    return false;
};
