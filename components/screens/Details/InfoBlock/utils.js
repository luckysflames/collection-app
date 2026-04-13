export const formatDate = (date) =>
    date ? date.split("-").reverse().join(".") : "?";

export const formatRating = (rating) =>
    rating ? rating.replace("_", "-").toUpperCase() : "?";

export const formatKind = (kind) => {
    const types = {
        tv: "Сериал",
        movie: "Фильм",
        ova: "OVA",
        ona: "ONA",
        special: "Спешл",
    };
    return types[kind] || kind?.toUpperCase();
};
