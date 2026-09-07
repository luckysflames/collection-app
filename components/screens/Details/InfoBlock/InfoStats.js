import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatDate } from "./utils";
import { ANIME_STATUSES, MOVIE_STATUSES, BOOK_MATURITY_RATINGS } from "../../../../constants/index";
import { useTheme } from "../../../../hooks/useTheme";

const StatSubItem = ({ label, value, styles }) => (
    <View style={styles.subItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value || "—"}</Text>
    </View>
);

export const InfoStats = ({ displayData }) => {
    if (!displayData) return null;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const isAnimeMovie =
        displayData.type === "anime" &&
        (displayData.animeKind === "movie" || displayData.episodes === 1);

    const getLabelById = (id, options) => {
        if (!id) return "—";
        const found = options.find((opt) => opt.id === id);
        return found ? found.label : id;
    };

    const formatDuration = (val, type) => {
        if (!val || val === "?" || val === "—") return "—";
        switch (type) {
            case "movie":
            case "tv":
                return `${val} мин.`;
            case "anime":
                return isAnimeMovie ? `${val} мин.` : `по ~${val} мин.`;
            case "game":
                return `${val} ч.`;
            default:
                return val;
        }
    };

    const formatBudget = (val) => {
        if (!val || val === "?" || val === "—") return "—";
        const onlyNumbers = val.toString().replace(/[^0-9]/g, "");
        if (!onlyNumbers) return "—";
        const formattedNumber = new Intl.NumberFormat("de-DE").format(Number(onlyNumbers));
        return `$${formattedNumber}`;
    };

    const formatPages = (val) => {
        if (!val || val === "?" || val === "—") return "—";
        return `${val} стр.`;
    };

    const getPeriod = () => {
        if (displayData.type === "anime") {
            if (isAnimeMovie) return formatDate(displayData.airedOn) || "—";
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
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <StatSubItem
                    styles={styles}
                    label={
                        (displayData.type === "anime" || displayData.type === "tv") && !isAnimeMovie
                            ? "Период выхода"
                            : "Дата выхода"
                    }
                    value={getPeriod()}
                />

                {displayData.type === "movie" && (
                    <StatSubItem
                        styles={styles}
                        label="Бюджет"
                        value={formatBudget(displayData.budget)}
                    />
                )}
                {displayData.type === "game" && (
                    <StatSubItem
                        styles={styles}
                        label="Метакритик"
                        value={displayData.metacritic}
                    />
                )}
                {displayData.type === "book" && (
                    <StatSubItem
                        styles={styles}
                        label="Объем"
                        value={formatPages(displayData.pageCount)}
                    />
                )}
                {displayData.type === "tv" && (
                    <View style={{ flex: 0.5 }}>
                        <StatSubItem
                            styles={styles}
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
                        styles={styles}
                        label="Эпизоды"
                        value={`${displayData.episodesAired || "?"} / ${displayData.episodes || "?"}`}
                    />
                )}
                {displayData.type === "tv" && (
                    <StatSubItem
                        styles={styles}
                        label="Эпизодов"
                        value={displayData.episodesCount || "?"}
                    />
                )}
                {displayData.type !== "book" && (
                    <StatSubItem
                        styles={styles}
                        label={displayData.type === "game" ? "Время" : "Длительность"}
                        value={formatDuration(displayData.duration, displayData.type)}
                    />
                )}

                {displayData.type === "game" ? (
                    <StatSubItem styles={styles} label="ESRB" value={displayData.esrb} />
                ) : displayData.type === "book" ? (
                    <StatSubItem
                        styles={styles}
                        label="Возраст"
                        value={
                            BOOK_MATURITY_RATINGS.find((r) => r.id === displayData.maturityRating)
                                ?.label || "Для всех"
                        }
                    />
                ) : (
                    <StatSubItem styles={styles} label="Статус" value={getAirStatus()} />
                )}
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        subItem: { flex: 1 },
        statLabel: {
            color: theme.accent,
            fontSize: 11,
            fontWeight: "bold",
            marginBottom: 4,
            textTransform: "uppercase",
        },
        statValue: { color: theme.text, fontSize: 14, fontWeight: "600" },
        statsGrid: {
            backgroundColor: theme.main,
            borderRadius: 15,
            padding: 15,
            marginBottom: 15,
        },
        statSubGrid: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
        },
        statRowSeparator: {
            height: 1,
            marginVertical: 4,
        },
    });
