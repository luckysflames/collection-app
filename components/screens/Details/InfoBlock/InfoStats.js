import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDate } from "./utils";
import {
    ANIME_STATUSES,
    MOVIE_STATUSES,
    ANIME_RATINGS,
    ESRB_RATINGS,
    BOOK_MATURITY_RATINGS,
} from "../../../../constants/index";

const StatSubItem = ({ label, value }) => (
    <View style={styles.subItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value || "—"}</Text>
    </View>
);

export const InfoStats = ({ displayData }) => {
    if (!displayData) return null;

    const isAnimeMovie =
        displayData.type === "anime" &&
        (displayData.animeKind === "movie" || displayData.episodes === 1);

    // Универсальный помощник для поиска человеческого названия по ID
    const getLabelById = (id, options) => {
        if (!id) return "—";
        const found = options.find((opt) => opt.id === id);
        return found ? found.label : id; // Если не нашли в списке, вернем сам ID
    };

    // --- ФОРМАТИРОВАНИЕ ЗНАЧЕНИЙ ---

    const formatDuration = (val, type) => {
        if (!val || val === "?" || val === "—") return "—";
        switch (type) {
            case "movie":
            case "tv":
                return `${val} мин.`;
            case "anime":
                if (isAnimeMovie) {
                    return `${val} мин.`;
                } else {
                    return `по ~${val} мин.`;
                }
            case "game":
                return `${val} ч.`;
            default:
                return val;
        }
    };

    const formatBudget = (val) => {
        if (!val || val === "?" || val === "—") return "—";

        // 1. Очищаем строку от старых разделителей и знака $, оставляя только цифры
        const onlyNumbers = val.toString().replace(/[^0-9]/g, "");

        if (!onlyNumbers) return "—";

        // 2. Форматируем число с разделением точек (через немецкую локаль 'de-DE')
        const formattedNumber = new Intl.NumberFormat("de-DE").format(Number(onlyNumbers));

        // 3. Возвращаем с красивым префиксом доллара
        return `$${formattedNumber}`;
    };

    const formatPages = (val) => {
        if (!val || val === "?" || val === "—") return "—";
        return `${val} стр.`;
    };

    const getPeriod = () => {
        if (displayData.type === "anime") {
            if (isAnimeMovie) {
                // Для аниме-фильма берем только дату начала (премьеру)
                return formatDate(displayData.airedOn) || "—";
            }
            // Для сериала — классический период
            const start = formatDate(displayData.airedOn);
            const end = formatDate(displayData.releasedOn);
            if (!start && !end) return "—";
            return `${start || "..."} — ${end || "..."}`;
        }

        if (displayData.type === "tv") {
            const start = formatDate(displayData.first_air_date);
            const end = formatDate(displayData.last_air_date);
            if (!start && !end) return "—";
            return `${start || "..."} — ${end || "..."}`;
        }

        // Для обычных фильмов, игр и книг
        return formatDate(displayData.year) || "—";
    };

    const getAirStatus = () => {
        if (displayData.type === "anime") {
            return getLabelById(displayData.animeStatus || displayData.status, ANIME_STATUSES);
        }
        if (displayData.type === "movie" || displayData.type === "tv") {
            return (
                getLabelById(displayData.movieStatus || displayData.status, MOVIE_STATUSES) ||
                displayData.movieStatus ||
                displayData.status ||
                "—"
            );
        }
        return displayData.status || "—";
    };

    return (
        <View style={styles.statsGrid}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <StatSubItem
                    label={
                        (displayData.type === "anime" || displayData.type === "tv") && !isAnimeMovie
                            ? "Период выхода"
                            : "Дата выхода"
                    }
                    value={getPeriod()}
                />

                {displayData.type === "movie" && (
                    <StatSubItem label="Бюджет" value={formatBudget(displayData.budget)} />
                )}
                {displayData.type === "game" && (
                    <StatSubItem label="Метакритик" value={displayData.metacritic} />
                )}
                {displayData.type === "book" && (
                    <StatSubItem label="Объем" value={formatPages(displayData.pageCount)} />
                )}
                {displayData.type === "tv" && (
                    <View style={{ flex: 0.5 }}>
                        <StatSubItem
                            label="Сезонов"
                            value={displayData.seasonsCount || "?"}
                        />
                    </View>
                )}
            </View>

            <View style={styles.statRowSeparator} />

            <View style={styles.statSubGrid}>
                {displayData.type === "anime" && (
                    <StatSubItem
                        label="Эпизоды"
                        value={`${displayData.episodesAired || "?"} / ${displayData.episodes || "?"}`}
                    />
                )}
                {displayData.type === "tv" && (
                    <StatSubItem
                        label="Эпизодов"
                        value={displayData.episodesCount || "?"}
                    />
                )}
                {displayData.type !== "book" && (
                    <StatSubItem
                        label={displayData.type === "game" ? "Время" : "Длительность"}
                        value={formatDuration(displayData.duration, displayData.type)}
                    />
                )}

                {displayData.type === "game" ? (
                    <StatSubItem label="ESRB" value={displayData.esrb} />
                ) : displayData.type === "book" ? (
                    <StatSubItem
                        label="Возраст"
                        value={
                            BOOK_MATURITY_RATINGS.find((r) => r.id === displayData.maturityRating)
                                ?.label || "Для всех"
                        }
                    />
                ) : (
                    <StatSubItem label="Статус" value={getAirStatus()} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    subItem: { flex: 1 },
    statLabel: {
        color: "#8E94A4",
        fontSize: 11,
        marginBottom: 4,
        textTransform: "uppercase",
    },
    statValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
    statsGrid: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    statSubGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    statRowSeparator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginVertical: 4,
    },
});
