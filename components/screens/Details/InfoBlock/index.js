import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./InfoBlock.styles";
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
} from "./Sections";
import { InfoStats } from "./InfoStats";
import { Bookmark, Folder, Info, Star } from "lucide-react-native";

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
    const [modalVisible, setModalVisible] = useState(false);

    // Выбираем, что рисовать под блоком основной информации
    const renderExtraInfo = () => {
        switch (displayData.type) {
            case "anime":
                return <AnimeExtra data={displayData} />;
            case "movie":
                return <MovieExtra data={displayData} />;
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
            {/* Общий заголовок для всех типов */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>{displayData.title}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Info color="#7D8AFF" size={25} />
                </TouchableOpacity>
            </View>

            {/* Быстрая информация */}
            {renderQuickInfo()}

            {/* Кнопка статуса */}
            <TouchableOpacity
                onPress={onStatusPress}
                style={
                    status || isInCollection
                        ? styles.statusBadge
                        : styles.statusBadgeCollect
                }
            >
                <Text style={styles.statusText}>
                    {status ??
                        (isInCollection
                            ? "Без статуса"
                            : "Добавить в коллекцию")}
                </Text>
            </TouchableOpacity>

            {/* --- НОВЫЙ БЛОК КНОПОК ПОД СТАТУСОМ --- */}
            {/* {isInCollection && ( */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={onFolderPress}
                    >
                        <Folder
                            color={isAnyFolderSelected ? "#7D8AFF" : "#8E94A4"}
                            size={18}
                        />
                        <Text
                            style={[
                                styles.actionBtnText,
                                isAnyFolderSelected && { color: "#7D8AFF" },
                            ]}
                        >
                            {folderLabel}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionBtn,
                            isFavorite && styles.actionBtnActive,
                        ]}
                        onPress={onToggleFavorite}
                    >
                        <Bookmark
                            size={18}
                            color={isFavorite ? "#FFD700" : "#8E94A4"}
                            fill={isFavorite ? "#FFD700" : "transparent"}
                        />
                        <Text
                            style={[
                                styles.actionBtnText,
                                isFavorite && { color: "#FFD700" },
                            ]}
                        >
                            {isFavorite ? "В избранном" : "Избранное"}
                        </Text>
                    </TouchableOpacity>
                </View>
            {/* )} */}

            {/* Блок с основной информацией */}
            <InfoStats displayData={displayData} />

            {/* Дополнительные поля */}
            {renderExtraInfo()}

            {/* Жанры (общие для всех) */}
            <View style={styles.genreRow}>
                {displayData.genres?.map((g, i) => (
                    <View key={i} style={styles.badge}>
                        <Text style={styles.badgeText}>{g}</Text>
                    </View>
                ))}
            </View>

            {/* Модальное окно с доп. названиями */}
            <TitlesModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                data={displayData}
            />
        </View>
    );
};
