import React from "react";
import { Bookmark, ChevronDown, Zap } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { UserRating } from "../../../shared/UserRating";
import { AverageRatingBlock } from "./AverageRatingBlock";

export const FolderInfo = ({
    folder,
    count,
    toggleFavorite,
    onStatusPress,
    onAddPress,
    folderItems,
    onRatingUpdate,
    onInfoPress,
}) => {
    const getPlural = (number, titles) => {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[
            number % 100 > 4 && number % 100 < 20
                ? 2
                : cases[number % 10 < 5 ? number % 10 : 5]
        ];
    };

    const cardsLabel = getPlural(count, ["карточка", "карточки", "карточек"]);

    return (
        <View style={styles.container}>
            {/* Название и описание */}
            <Text style={styles.folderTitle}>{folder.title}</Text>

            {folder.description ? (
                <Text style={styles.folderDescription}>
                    {folder.description}
                </Text>
            ) : null}

            <View style={styles.controlsRow}>
                {/* Кнопка статуса */}
                <TouchableOpacity
                    onPress={onStatusPress}
                    style={styles.folderStatusBtn}
                >
                    <Text style={styles.folderStatusText}>
                        {folder.status || "Без статуса"}
                    </Text>
                    <ChevronDown
                        color="#fff"
                        size={16}
                        style={{ marginLeft: 6 }}
                    />
                </TouchableOpacity>

                <View style={styles.underControlsRow}>
                    {/* Кнопка добавления карточек */}
                    <TouchableOpacity
                        onPress={onAddPress}
                        style={styles.addCardsBtn}
                    >
                        <Text style={styles.addCardsText}>+ Карточки</Text>
                    </TouchableOpacity>

                    {/* Кнопка избранного */}
                    <TouchableOpacity
                        onPress={toggleFavorite}
                        style={[
                            styles.favoriteBtn,
                            folder.isFavorite && styles.favoriteBtnActive,
                        ]}
                    >
                        <Bookmark
                            size={22}
                            color={folder.isFavorite ? "#FFD700" : "#8E94A4"}
                            fill={folder.isFavorite ? "#FFD700" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ПОЛНОЦЕННЫЙ РЕЙТИНГ */}
            <View style={styles.ratingSection}>
                <UserRating
                    score={folder.userScore || 0}
                    onSetScore={onRatingUpdate} // Теперь это рабочая функция обновления
                    onInfoPress={onInfoPress}
                />
            </View>

            {/* ВЫНЕСЕННЫЙ БЛОК СРЕДНЕГО РЕЙТИНГА */}
            <AverageRatingBlock items={folderItems} onApply={onRatingUpdate} />

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
        // У UserRating внутри уже есть marginTop: 25,
        // так что здесь дополнительные отступы могут не понадобиться
    },

    avgContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    avgLabel: {
        color: "#8E94A4",
        fontSize: 12,
    },
    avgBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 4,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    avgValue: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
        marginLeft: 4,
    },
    avgApplyText: {
        color: "#7D8AFF",
        fontSize: 10,
        fontWeight: "700",
        textTransform: "uppercase",
        marginLeft: 8,
    },
    controlsRow: {
        width: "100%",
        alignItems: "stretch",
        gap: 12,
        marginTop: 20,
    },
    underControlsRow: {
        flexDirection: "row",
        gap: 12,
    },
    folderStatusBtn: {
        flex: 1,
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
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    addCardsText: {
        color: "#7D8AFF",
        fontWeight: "700",
        fontSize: 14,
    },
    favoriteBtn: {
        aspectRatio: 1 / 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    favoriteBtnActive: {
        backgroundColor: "rgba(255, 215, 0, 0.08)",
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
