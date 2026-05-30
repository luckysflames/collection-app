const DYNAMIC_FILTER_FIELDS = [
    "genres",
    "studios",
    "developers",
    "platforms",
    "authors",
    "companies",
    "countries",
];

export const isDynamicFilterField = (filterKey) =>
    DYNAMIC_FILTER_FIELDS.includes(filterKey);

export const splitFilterValues = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
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
        const [min, max] = filterValue;
        const numericValue = normalizeNumericValue(itemValue);
        if (numericValue === null) return false;

        return numericValue >= min && numericValue <= max;
    }

    return false;
};
