import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Mic } from "lucide-react-native";
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

export const InfoStats = ({
    displayData,
    status,
    selectedStudio,
    onStudioPress,
    getStudioButtonText,
}) => {
    if (!displayData) return null;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const isAnime = displayData.type === "anime";
    const isAnimeMovie =
        isAnime && (displayData.animeKind === "movie" || displayData.episodes === 1);

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
            {/* ВЕРХНЯЯ ПЛАШКА: Кнопка выбора озвучки */}
            {isAnime && (
                <TouchableOpacity
                    onPress={onStudioPress}
                    activeOpacity={0.8}
                    style={styles.topBanner}
                >
                    <View style={styles.studioContent}>
                        <Mic size={16} color={selectedStudio ? theme.accent : theme.textDark} />
                        <Text
                            style={[styles.studioText, selectedStudio && styles.studioTextActive]}
                            numberOfLines={1}
                        >
                            {getStudioButtonText(status, selectedStudio)}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* ОСНОВНОЙ БЛОК СТАТИСТИКИ */}
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

            {/* НИЖНЯЯ ПЛАШКА: Исходный вид анонса эпизода */}
            {nextEpisodeText && (
                <View style={styles.bottomBanner}>
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
        topBanner: {
            backgroundColor: theme.accentMuted,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            marginBottom: -12,
            paddingTop: 10,
            paddingBottom: 18,
            paddingHorizontal: 15,
            zIndex: 1,
            elevation: 1,
        },
        studioContent: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        studioText: {
            color: theme.textDark,
            fontSize: 12,
            fontWeight: "600",
            flexShrink: 1,
        },
        studioTextActive: {
            color: theme.text,
        },
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
        bottomBanner: {
            backgroundColor: theme.accent,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            marginTop: -15,
            paddingTop: 20,
            paddingBottom: 10,
            zIndex: 1,
            elevation: 1,
        },
        nextEpisodeValue: {
            fontSize: 11,
            fontWeight: "600",
            color: theme.text,
            textAlign: "center",
        },
    });
