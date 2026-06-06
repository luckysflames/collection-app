import { ANIME_KINDS } from "../../../../constants/forms";

export const formatDate = (date) => (date ? date.split("-").reverse().join(".") : "?");

export const formatRating = (rating) => (rating ? rating.replace("_", "-").toUpperCase() : "?");

export const formatKind = (kind) => {
    if (!kind) return "?";

    // Ищем соответствие в твоем глобальном массиве констант
    const foundKind = ANIME_KINDS.find((item) => item.id === kind.toLowerCase());

    // Если нашли — возвращаем красивый label, если нет — исходный текст в верхнем регистре
    return foundKind ? foundKind.label : kind.toUpperCase();
};
