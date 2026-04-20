import React, { memo } from "react"; // 1. Импортируем memo
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BookCopy, Star } from "lucide-react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

// 1. Сначала просто объявляем компонент как обычную функцию
const MediaCardComponent = ({
    item,
    itemCount,
    onPress,
    showOrderNumber,
    orderNumber,
}) => {
    const badgeStyle = orderNumber
        ? [styles.orderBadge, styles.orderBadgeActive]
        : styles.orderBadge;

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            activeOpacity={0.8}
            style={styles.cardContainer}
        >
            <View style={styles.card}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    fadeDuration={150}
                />

                {/* Порядковый номер (слева сверху) */}
                {showOrderNumber && (
                    <View style={badgeStyle}>
                        <Text style={styles.orderText}>
                            {orderNumber || ""}
                        </Text>
                    </View>
                )}

                {/* Рейтинг пользователя (справа сверху) */}
                {/* Используем отдельный стиль или условие, чтобы не накладывалось на папку */}
                {item.userScore > 0 && (
                    <View style={styles.ratingBadge}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.scoreCount}>{item.userScore}</Text>
                    </View>
                )}

                {/* Бейдж папки (справа сверху, если нет рейтинга, или чуть ниже) */}
                {item.isFolder && (
                    <View style={styles.folderBadge}>
                        <BookCopy size={12} color="#ffffff" />
                        <Text style={styles.folderCount}>{itemCount}</Text>
                    </View>
                )}

                <LinearGradient
                    colors={["transparent", "rgba(5, 11, 24, 0.9)"]}
                    style={styles.gradient}
                />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// 2. Экспортируем уже обернутым в memo
export const MediaCard = memo(MediaCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.userScore === nextProps.item.userScore &&
        prevProps.orderNumber === nextProps.orderNumber &&
        prevProps.showOrderNumber === nextProps.showOrderNumber &&
        prevProps.itemCount === nextProps.itemCount &&
        prevProps.item.image === nextProps.item.image
    );
});

const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16,
    },
    card: {
        width: "100%",
        height: 250, // Немного уменьшил, чтобы на экране влезало больше (опционально)
        borderRadius: 20,
        backgroundColor: "#1A2232",
        overflow: "hidden",
        // Убираем тяжелые тени для Android, если их слишком много
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    image: {
        width: "100%",
        height: "100%",
        backgroundColor: "#1A2232", // Цвет-заглушка пока грузится фото
    },
    orderBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        borderWidth: 1.5,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    orderBadgeActive: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    orderText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "60%",
    },
    info: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 10,
    },
    title: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
        lineHeight: 16,
    },
    ratingBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "rgba(26, 34, 50, 0.9)", // Темный фон для контраста со звездой
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        zIndex: 11,
        borderWidth: 1,
        borderColor: "rgba(255, 215, 0, 0.3)", // Золотистая рамка
    },
    folderBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(125, 138, 255, 0.95)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 4,
        zIndex: 11,
    },
    scoreCount: { color: "#FFD700", fontSize: 11, fontWeight: "bold" },
    folderCount: { color: "#fff", fontSize: 11, fontWeight: "bold" },
});
