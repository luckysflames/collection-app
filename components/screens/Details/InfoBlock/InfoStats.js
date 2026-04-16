import React from "react";
import { View, Text } from "react-native";

import { styles } from "./InfoBlock.styles";
import { formatDate } from "./utils";

const StatSubItem = ({ label, value }) => (
    <View style={styles.subItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value || "—"}</Text>
    </View>
);

export const InfoStats = ({ displayData }) => {
    if (!displayData) return null;

    // Универсальная логика для даты/периода
    const getPeriod = () => {
        if (displayData.type === "anime") {
            return `${formatDate(displayData.airedOn)} — ${formatDate(displayData.releasedOn) || "..."}`;
        }
        return formatDate(displayData.year) || "—";
    };

    const getAirStatus = () => {
        const s =
            displayData.airingStatus ||
            displayData.movieStatus ||
            displayData.status;
        if (!s) return "—";
        if (s === "released" || s === "finished") return "Вышло";
        if (s === "ongoing") return "Онгоинг";
        return s;
    };

    return (
        <View style={styles.statsGrid}>
            {/* Верхняя строка: Дата и (Бюджет для фильмов или Страницы для книг) */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <StatSubItem
                    label={
                        displayData.type === "anime"
                            ? "Период выхода"
                            : "Дата выхода"
                    }
                    value={getPeriod()}
                />

                {displayData.type === "movie" && (
                    <StatSubItem label="Бюджет" value={displayData.budget} />
                )}
                {displayData.type === "game" && (
                    <StatSubItem
                        label="Метакритик"
                        value={displayData.metacritic}
                    />
                )}
                {displayData.type === "book" && (
                    <StatSubItem label="Объем" value={displayData.pageCount} />
                )}
            </View>

            <View style={styles.statRowSeparator} />

            {/* Нижняя сетка */}
            <View style={styles.statSubGrid}>
                {/* Эпизоды только для аниме */}
                {displayData.type === "anime" && (
                    <StatSubItem
                        label="Эпизоды"
                        value={`${displayData.episodesAired || "?"} / ${displayData.episodes || "?"}`}
                    />
                )}

                {/* Длительность / Время прохождения */}
                {displayData.type !== "book" && (
                    <StatSubItem
                        label={
                            displayData.type === "game"
                                ? "Время"
                                : "Длительность"
                        }
                        value={displayData.duration}
                    />
                )}

                {/* Статус (упростили логику) */}
                {displayData.type === "game" ? (
                    <StatSubItem label="ESRB" value={displayData.esrb} />
                ) : displayData.type === "book" ? (
                    <StatSubItem
                        label="maturity"
                        value={displayData.maturityRating}
                    />
                ) : (
                    <StatSubItem label="Статус" value={getAirStatus()} />
                )}
            </View>
        </View>
    );
};
