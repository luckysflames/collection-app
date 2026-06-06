import React from "react";
import { ArrowUpDown, Bookmark, ChevronDown, ListFilter, Zap } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserRating } from "../../../shared/UserRating";
import { AverageRatingBlock } from "./AverageRatingBlock";

const FOLDER_SORT_LABELS = {
    manual: "Вручную (↓)",
    manual_desc: "Вручную (↑)",
    date_desc: "По дате (↓)",
    date_asc: "По дате (↑)",
    rating_desc: "По рейтингу (↓)",
    rating_asc: "По рейтингу (↑)",
    alphabet_asc: "По алфавиту (А-Я)",
    alphabet_desc: "По алфавиту (Я-А)",
    status_change_desc: "По изменениям (↓)",
    status_change_asc: "По изменениям (↑)",
};

export const FolderInfo = ({
    folder,
    count,
    toggleFavorite,
    onStatusPress,
    onAddPress,
    onSortPress,
    folderItems,
    onRatingUpdate,
    onInfoPress,
    isBrilliant,
    onBrilliantPress,
    sortType,
}) => {
    const getPlural = (number, titles) => {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[
            number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
        ];
    };

    const cardsLabel = getPlural(count, ["карточка", "карточки", "карточек"]);
    const currentSortLabel = FOLDER_SORT_LABELS[sortType] || "Неизвестно";

    return (
        <View style={styles.container}>
            {/* Название и описание */}
            <Text style={styles.folderTitle}>{folder.title}</Text>
            {folder.description ? (
                <Text style={styles.folderDescription}>{folder.description}</Text>
            ) : null}

            {/* Блок кнопок управления */}
            <View style={styles.controlsRow}>
                {/* Кнопка статуса */}
                <TouchableOpacity onPress={onStatusPress} style={styles.folderStatusBtn}>
                    <Text style={styles.folderStatusText}>{folder.status || "Без статуса"}</Text>
                    <ChevronDown color="#fff" size={16} style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <View style={styles.underControlsRow}>
                    {/* Кнопка добавления карточек */}
                    <TouchableOpacity onPress={onAddPress} style={styles.addCardsBtn}>
                        <Text style={styles.addCardsText}>+ Карточки</Text>
                    </TouchableOpacity>

                    {/* Кнопка избранного */}
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={[styles.favoriteBtn, folder.isFavorite && styles.favoriteBtnActive]}
                    >
                        <Bookmark
                            size={22}
                            color={folder.isFavorite ? "#FFD700" : "#8E94A4"}
                            fill={folder.isFavorite ? "#FFD700" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ПОЛНОЦЕННЫЙ РЕЙТИНГ С ПЕРЕДАЧЕЙ ФЛАГОВ БРИЛЛИАНТА */}
            <View style={styles.ratingSection}>
                <UserRating
                    score={folder.userScore || 0}
                    onSetScore={onRatingUpdate}
                    onInfoPress={onInfoPress}
                    isBrilliant={isBrilliant}
                    onToggleBrilliant={onBrilliantPress}
                />
            </View>

            {/* ВЫНЕСЕННЫЙ БЛОК СРЕДНЕГО РЕЙТИНГА */}
            <AverageRatingBlock items={folderItems} onApply={onRatingUpdate} />

            {/* Кнопка сортировки */}
            <View style={styles.underRaitingRow}>
                <TouchableOpacity onPress={onSortPress} style={styles.sortBtn}>
                    <ListFilter size={16} color="#7D8AFF" />
                    <Text style={styles.sortText}>Сортировка: {currentSortLabel}</Text>
                    <ChevronDown size={14} color="#8E94A4" style={{ marginLeft: 4 }} />
                </TouchableOpacity>
            </View>

            {/* Мета-бейдж */}
            <View style={styles.metaBadge}>
                <Text style={styles.metaText}>
                    • {count} {cardsLabel} •
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 18,
        alignItems: "center",
    },
    folderTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    folderDescription: {
        fontSize: 15,
        color: "#8E94A4",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    ratingSection: {
        width: "100%",
    },
    controlsRow: {
        width: "100%",
        flexDirection: "column",
        gap: 12,
        marginTop: 20,
    },
    underControlsRow: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
    },
    folderStatusBtn: {
        width: "100%",
        flexDirection: "row",
        borderColor: "#7D8AFF",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: "center",
        alignItems: "center",
    },
    folderStatusText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    addCardsBtn: {
        flex: 1,
        backgroundColor: "#7D8AFF",
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    addCardsText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    favoriteBtn: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
    },
    favoriteBtnActive: {
        backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
    underRaitingRow: {
        flexDirection: "row",
        width: "100%",
        marginTop: 20,
    },
    sortBtn: {
        flex: 1,
        flexDirection: "row",
        gap: 10,
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    sortText: {
        color: "#7D8AFF",
        fontWeight: "700",
        fontSize: 14,
    },
    metaBadge: {
        marginVertical: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderRadius: 8,
    },
    metaText: {
        fontSize: 11,
        color: "#7D8AFF",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});
