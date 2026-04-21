// InfoStats.js
import React from "react";
import { View, Text } from "react-native";
import { styles } from "./InfoBlock.styles";
import { formatDate } from "./utils";
import {
    ANIME_STATUSES,
    MOVIE_STATUSES,
    ANIME_RATINGS,
    ESRB_RATINGS,
    BOOK_MATURITY_RATINGS,
} from "../../../../constants";

const StatSubItem = ({ label, value }) => (
    <View style={styles.subItem}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value || "—"}</Text>
    </View>
);

export const InfoStats = ({ displayData }) => {
    if (!displayData) return null;

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
                return `${val} мин.`;
            case "anime":
                return `по ~${val} мин.`;
            case "game":
                return `${val} ч.`;
            default:
                return val;
        }
    };

    const formatBudget = (val) => {
        if (!val || val === "?" || val === "—") return "—";
        // Убираем пробелы и запятые (могут быть от toLocaleString)
        const cleaned = val.toString().replace(/[\s,]/g, "");
        // Если уже есть знак $, оставляем, если нет — добавляем
        return cleaned.includes("$") ? cleaned : `$${cleaned}`;
    };

    const formatPages = (val) => {
        if (!val || val === "?" || val === "—") return "—";
        return `${val} стр.`;
    };

    const getPeriod = () => {
        if (displayData.type === "anime") {
            return `${formatDate(displayData.airedOn)} — ${formatDate(displayData.releasedOn) || "..."}`;
        }
        return formatDate(displayData.year) || "—";
    };

    const getAirStatus = () => {
        if (displayData.type === "anime") {
            return getLabelById(
                displayData.animeStatus || displayData.status,
                ANIME_STATUSES,
            );
        }
        if (displayData.type === "movie") {
            return getLabelById(
                displayData.movieStatus || displayData.status,
                MOVIE_STATUSES,
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
                        displayData.type === "anime"
                            ? "Период выхода"
                            : "Дата выхода"
                    }
                    value={getPeriod()}
                />

                {displayData.type === "movie" && (
                    <StatSubItem
                        label="Бюджет"
                        value={formatBudget(displayData.budget)}
                    />
                )}
                {displayData.type === "game" && (
                    <StatSubItem
                        label="Метакритик"
                        value={displayData.metacritic}
                    />
                )}
                {displayData.type === "book" && (
                    <StatSubItem
                        label="Объем"
                        value={formatPages(displayData.pageCount)}
                    />
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

                {displayData.type !== "book" && (
                    <StatSubItem
                        label={
                            displayData.type === "game"
                                ? "Время"
                                : "Длительность"
                        }
                        value={formatDuration(
                            displayData.duration,
                            displayData.type,
                        )}
                    />
                )}

                {displayData.type === "game" ? (
                    <StatSubItem label="ESRB" value={displayData.esrb} />
                ) : displayData.type === "book" ? (
                    <StatSubItem
                        label="Возраст"
                        value={displayData.maturityRating}
                    />
                ) : (
                    <StatSubItem label="Статус" value={getAirStatus()} />
                )}
            </View>
        </View>
    );
};
