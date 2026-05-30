export const getCleanId = (complexId, prefix) =>
    String(complexId || "")
        .replace(prefix, "")
        .split("-")[0];

export const toArray = (value) => {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string" && value.length > 0) return [value];
    return [];
};

export const normalizeTextItem = (item) => String(item || "").toLowerCase();

export const hasAnyTag = (item, tags) => {
    const normalized = toArray(item).map(normalizeTextItem);
    return tags.some((tag) => normalized.includes(normalizeTextItem(tag)));
};

export const checkIdsPresence = (cards, achievement, prefix = "anime-") => {
    if (!cards || !achievement.requiredIds) return 0;

    const watchedIds = new Set(
        cards
            .filter(
                (card) =>
                    !card.isFolder &&
                    (card.status === "Просмотрено" ||
                        card.status === "Пройдено" ||
                        card.status === "Прочитано"),
            )
            .map((card) => getCleanId(card.id, prefix)),
    );

    return achievement.requiredIds.filter((id) => watchedIds.has(id)).length;
};
