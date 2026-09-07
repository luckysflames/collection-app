import React from "react";
import { Bookmark, ChevronDown, ListFilter } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserRating } from "../../../shared/UserRating";
import { AverageRatingBlock } from "./AverageRatingBlock";
import { FOLDER_SORT_LABELS } from "../../../../constants";
import { useTheme } from "../../../../hooks/useTheme";

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
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

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
            <Text style={styles.folderTitle}>{folder.title}</Text>
            {folder.description ? (
                <Text style={styles.folderDescription}>{folder.description}</Text>
            ) : null}

            <View style={styles.controlsRow}>
                <TouchableOpacity onPress={onStatusPress} style={styles.folderStatusBtn}>
                    <Text style={styles.folderStatusText}>{folder.status || "Без статуса"}</Text>
                </TouchableOpacity>

                <View style={styles.underControlsRow}>
                    <TouchableOpacity onPress={onAddPress} style={styles.addCardsBtn}>
                        <Text style={styles.addCardsText}>+ Карточки</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={[styles.favoriteBtn, folder.isFavorite && styles.favoriteBtnActive]}
                    >
                        <Bookmark
                            size={22}
                            color={folder.isFavorite ? theme.yellow : theme.textDark}
                            fill={folder.isFavorite ? theme.yellow : theme.main}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.ratingSection}>
                <UserRating
                    score={folder.userScore || 0}
                    onSetScore={onRatingUpdate}
                    onInfoPress={onInfoPress}
                    isBrilliant={isBrilliant}
                    onToggleBrilliant={onBrilliantPress}
                />
            </View>

            <AverageRatingBlock items={folderItems} onApply={onRatingUpdate} />

            <View style={styles.underRaitingRow}>
                <TouchableOpacity onPress={onSortPress} style={styles.sortBtn}>
                    <ListFilter size={16} color={theme.accent} />
                    <Text style={styles.sortText}>Сортировка: {currentSortLabel}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.metaBadge}>
                <Text style={styles.metaText}>
                    • {count} {cardsLabel} •
                </Text>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            width: "100%",
            paddingHorizontal: 18,
            alignItems: "center",
        },
        folderTitle: {
            fontSize: 28,
            fontWeight: "800",
            color: theme.text,
            textAlign: "center",
            letterSpacing: -0.5,
        },
        folderDescription: {
            fontSize: 15,
            color: theme.textDark,
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
            borderColor: theme.accent,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1.5,
            justifyContent: "center",
            alignItems: "center",
        },
        folderStatusText: {
            color: theme.text,
            fontWeight: "700",
            fontSize: 14,
        },
        addCardsBtn: {
            flex: 1,
            backgroundColor: theme.accent,
            paddingVertical: 12,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
        },
        addCardsText: {
            color: theme.text,
            fontWeight: "700",
            fontSize: 14,
        },
        favoriteBtn: {
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.main,
            borderRadius: 12,
        },
        favoriteBtnActive: {
            backgroundColor: theme.yellowMuted,
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
            backgroundColor: theme.accentMuted,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        sortText: {
            color: theme.accent,
            fontWeight: "700",
            fontSize: 14,
        },
        metaBadge: {
            marginVertical: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: theme.accentMuted,
            borderRadius: 8,
        },
        metaText: {
            fontSize: 11,
            color: theme.text,
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: 1,
        },
    });
