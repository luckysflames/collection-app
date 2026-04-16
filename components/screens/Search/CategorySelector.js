import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
} from "react-native";
import { SUB_CATEGORIES } from "../../../constants";

const { width } = Dimensions.get("window");

// const CATEGORIES = [
//     {
//         id: "Игры",
//         icon: "controller-classic",
//         color: "#7D8AFF",
//         // Если у вас есть ассеты картинок как в дашборде, можно использовать их
//         // Но здесь оставим MaterialCommunityIcons для надежности
//     },
//     { id: "Фильмы", icon: "movie-roll", color: "#FF7D7D" },
//     { id: "Аниме", icon: "video-input-antenna", color: "#FFD47D" },
//     { id: "Книги", icon: "book-open-variant", color: "#7DFF8E" },
// ];

export const CategorySelector = ({ onSelect, insets }) => {
    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <Text style={styles.headerTitle}>Поиск</Text>

            <Text style={styles.subtitle}>
                Выберите категорию для поиска в базе
            </Text>

            <View style={styles.grid}>
                {SUB_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={styles.card}
                        activeOpacity={0.8}
                        onPress={() => onSelect(cat.id)}
                    >
                        {/* Эффект свечения в углу, как на дашборде */}
                        <View style={styles.cardGlow} />
                        <View style={styles.cardHeader}>
                            <View style={styles.iconWrapper}>
                                <Image
                                    source={cat.active}
                                    style={styles.icon}
                                    tintColor="#7D8AFF"
                                />
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <Text style={styles.cardText}>{cat.id}</Text>
                            <Text style={styles.subText}>
                                Найти {getLabel(cat.id)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// Вспомогательные функции для текста
const getLabel = (id) => {
    if (id === "Игры") return "игру";
    if (id === "Книги") return "книгу";
    if (id === "Аниме") return "аниме";
    return "фильм";
};

// Временные эмодзи (замените на свои Image source, если хотите иконки как в дашборде)
const getEmoji = (id) => {
    if (id === "Игры") return "🎮";
    if (id === "Книги") return "📖";
    if (id === "Аниме") return "⛩️";
    return "🎬";
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        color: "#4E5564",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 25,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: (width - 55) / 2,
        height: 180, // Чуть выше для лучшей композиции
        backgroundColor: "#0B1534",
        borderRadius: 28,
        padding: 20,
        marginBottom: 15,
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
        overflow: "hidden", // Чтобы свечение не вылезало
    },
    cardGlow: {
        position: "absolute",
        top: -40,
        right: -40,
        width: 100,
        height: 100,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderRadius: 50,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: { width: 24, height: 24, objectFit: "contain" },
    cardFooter: {
        gap: 4,
    },
    cardText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    subText: { color: "#4E5564", fontSize: 12, fontWeight: "500" },
});
