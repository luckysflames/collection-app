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

const formatDayOfWeekWithTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";

    const dayIndex = date.getDay();

    const daysMap = {
        0: "каждое воскресенье",
        1: "каждый понедельник",
        2: "каждый вторник",
        3: "каждую среду",
        4: "каждый четверг",
        5: "каждую пятницу",
        6: "каждую субботу",
    };

    const timeStr = date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const dayName = daysMap[dayIndex] || "";
    return `${dayName} в ${timeStr}`;
};

export const InfoStats = ({ displayData }) => {
    if (!displayData) return null;

    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const isAnimeMovie =
        displayData.type === "anime" &&
        (displayData.animeKind === "movie" || displayData.episodes === 1);

    const getNextEpisodeInfo = (isoString) => {
        if (!isoString || typeof isoString !== "string") return null;

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return null;

        const scheduleWithTime = formatDayOfWeekWithTime(date);
        if (!scheduleWithTime) return null;

        return `Выходит ${scheduleWithTime}`;
    };

    const nextEpisodeText = getNextEpisodeInfo(displayData?.nextEpisodeAt);

    const getLabelById = (id, options) => {
        if (!id) return "—";
        const found = options.find((opt) => opt.id === id);
        return found ? found.label : id;
    };

    const formatDuration = (val, type) => {
        if (!val || val === "?" || val === "—") return "?";
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
        <View style={styles.container}>
            <View style={styles.statsGrid}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <StatSubItem
                        styles={styles}
                        label={
                            (displayData.type === "anime" || displayData.type === "tv") &&
                            !isAnimeMovie
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
                                BOOK_MATURITY_RATINGS.find(
                                    (r) => r.id === displayData.maturityRating,
                                )?.label || "Для всех"
                            }
                        />
                    ) : (
                        <StatSubItem styles={styles} label="Статус" value={getAirStatus()} />
                    )}
                </View>
            </View>

            {displayData.type === "anime" && Boolean(nextEpisodeText) && (
                <View style={styles.nextEpisodeBanner}>
                    <Text style={styles.nextEpisodeValue} numberOfLines={1}>
                        {nextEpisodeText}
                    </Text>
                </View>
            )}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginBottom: 15,
        },
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
            zIndex: 2,
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
        nextEpisodeBanner: {
            backgroundColor: theme.accent,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            marginTop: -12,
            paddingTop: 18,
            paddingBottom: 10,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1,
            elevation: 1,
        },
        nextEpisodeValue: {
            flex: 1,
            fontSize: 11,
            fontWeight: "500",
            color: theme.text,
            textAlign: "center",
        },
    });
