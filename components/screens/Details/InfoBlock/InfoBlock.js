import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TitlesModal } from "./TitlesModal";
import {
    AnimeExtra,
    AnimeQuickData,
    BookExtra,
    BookQuickData,
    GameExtra,
    GameQuickData,
    MovieExtra,
    MovieQuickData,
    TVExtra,
    TVQuickData,
} from "./Sections";
import { InfoStats } from "./InfoStats";
import { Bookmark, Folder, Info } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const InfoBlock = ({
    displayData,
    status,
    isInCollection,
    isFavorite,
    folderLabel,
    isAnyFolderSelected,
    onStatusPress,
    onFolderPress,
    onToggleFavorite,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [modalVisible, setModalVisible] = useState(false);

    // Выбираем, что рисовать под блоком основной информации
    const renderExtraInfo = () => {
        switch (displayData.type) {
            case "anime":
                return <AnimeExtra data={displayData} />;
            case "movie":
                return <MovieExtra data={displayData} />;
            case "tv":
                return <TVExtra data={displayData} />;
            case "game":
                return <GameExtra data={displayData} />;
            case "book":
                return <BookExtra data={displayData} />;
            default:
                return null;
        }
    };

    // Выбираем, что рисовать в быстрой информации под названием
    const renderQuickInfo = () => {
        switch (displayData.type) {
            case "anime":
                return <AnimeQuickData data={displayData} />;
            case "movie":
                return <MovieQuickData data={displayData} />;
            case "tv":
                return <TVQuickData data={displayData} />;
            case "game":
                return <GameQuickData data={displayData} />;
            case "book":
                return <BookQuickData data={displayData} />;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>{displayData.title}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Info color={theme.accent} size={25} />
                </TouchableOpacity>
            </View>

            {renderQuickInfo()}

            <TouchableOpacity
                onPress={onStatusPress}
                style={status || isInCollection ? styles.statusBadge : styles.statusBadgeCollect}
            >
                <Text style={styles.statusText}>
                    {status ?? (isInCollection ? "Без статуса" : "Добавить в коллекцию")}
                </Text>
            </TouchableOpacity>

            <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={onFolderPress}>
                    <Folder color={isAnyFolderSelected ? theme.accent : theme.textDark} size={18} />
                    <Text
                        style={[
                            styles.actionBtnText,
                            isAnyFolderSelected && { color: theme.accent },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {folderLabel}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={onToggleFavorite}>
                    <Bookmark
                        size={18}
                        color={isFavorite ? theme.yellow : theme.textDark}
                        fill={isFavorite ? theme.yellow : "transparent"}
                    />
                    <Text style={[styles.actionBtnText, isFavorite && { color: theme.yellow }]}>
                        {isFavorite ? "В избранном" : "Избранное"}
                    </Text>
                </TouchableOpacity>
            </View>

            <InfoStats displayData={displayData} />

            {renderExtraInfo()}

            <View style={styles.genreRow}>
                {displayData.genres?.map((g, i) => (
                    <View key={i} style={styles.badge}>
                        <Text style={styles.badgeText}>{g}</Text>
                    </View>
                ))}
            </View>

            <TitlesModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                data={displayData}
                isInCollection={isInCollection}
            />
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { marginBottom: 10 },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            gap: 10,
        },
        title: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            flex: 1,
        },
        statusBadge: {
            borderColor: theme.accent,
            borderWidth: 2,
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
        },
        statusBadgeCollect: {
            backgroundColor: theme.accent,
            padding: 12,
            borderRadius: 12,
            marginBottom: 20,
        },
        statusText: {
            color: theme.text,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 15,
        },
        actionButtonsRow: {
            flexDirection: "row",
            gap: 10,
            marginBottom: 20,
            marginTop: -5,
            alignItems: "center",
        },
        actionBtn: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.main,
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderRadius: 12,
            gap: 8,
        },
        actionBtnText: {
            color: theme.textDark,
            fontSize: 13,
            fontWeight: "600",
            flexShrink: 1,
        },
        genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
        badge: {
            backgroundColor: theme.accentMuted,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
        },
        badgeText: { color: theme.accent, fontSize: 12, fontWeight: "600" },
    });
