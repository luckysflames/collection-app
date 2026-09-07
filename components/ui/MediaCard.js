import React, { memo } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BookCopy, Gem, Infinity, Pin, Star } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const MediaCardComponent = ({
    item,
    itemCount,
    onPress,
    onLongPress,
    showOrderNumber,
    orderNumber,
    isInsideFolder,
    small,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const badgeStyle = orderNumber
        ? [styles.orderBadge, styles.orderBadgeActive]
        : styles.orderBadge;

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            onLongPress={() => onLongPress?.(item)}
            delayLongPress={350}
            activeOpacity={0.8}
            style={styles.cardContainer}
        >
            <View style={[styles.card, small && { height: 200, width: 140 }]}>
                <Image source={{ uri: item.image }} style={styles.image} fadeDuration={150} />

                {/* Порядковый номер (справа сверху) */}
                {showOrderNumber && (
                    <View style={badgeStyle}>
                        <Text style={styles.orderText}>{orderNumber || ""}</Text>
                    </View>
                )}

                {/* Иконка закрепа сверху по центру */}
                {item.isPinned && !isInsideFolder && (
                    <View style={styles.pinBadge}>
                        <Pin size={14} color={theme.text} fill={theme.accent} />
                    </View>
                )}

                {/* Рейтинг пользователя (слева сверху) */}
                {item.isBrilliant ? (
                    <View style={[styles.ratingBadge, { borderColor: theme.accent }]}>
                        <Gem size={12} color={theme.accent} fill={theme.accent} />
                        <Infinity size={12} color={theme.accent} />
                    </View>
                ) : item.userScore > 0 && !item.isBrilliant ? (
                    <View style={styles.ratingBadge}>
                        <Star size={12} color={theme.yellow} fill={theme.yellow} />
                        <Text style={styles.scoreCount}>{item.userScore}</Text>
                    </View>
                ) : null}

                {/* Бейдж папки (справа сверху) */}
                {item.isFolder && (
                    <View style={styles.folderBadge}>
                        <BookCopy size={12} color={theme.text} />
                        <Text style={styles.folderCount}>{itemCount}</Text>
                    </View>
                )}

                <LinearGradient
                    colors={["transparent", "rgba(5, 11, 24, 0.95)"]}
                    style={styles.gradient}
                />

                {/* Блок информации внизу карточки */}
                <View style={styles.info}>
                    {/* ПЛАШКА СТАТУСА */}
                    {item.status && (
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText} numberOfLines={1}>
                                {item.status}
                            </Text>
                        </View>
                    )}

                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// 2. Экспортируем обернутым в memo
export const MediaCard = memo(MediaCardComponent, (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.item.title === nextProps.item.title &&
        prevProps.item.status === nextProps.item.status &&
        prevProps.item.isPinned === nextProps.item.isPinned &&
        prevProps.item.userScore === nextProps.item.userScore &&
        prevProps.item.isBrilliant === nextProps.item.isBrilliant &&
        prevProps.orderNumber === nextProps.orderNumber &&
        prevProps.showOrderNumber === nextProps.showOrderNumber &&
        prevProps.itemCount === nextProps.itemCount &&
        prevProps.item.image === nextProps.item.image &&
        prevProps.small === nextProps.small
    );
});

const createLocalStyles = (theme) =>
    StyleSheet.create({
        cardContainer: {
            width: cardWidth,
            marginBottom: 16,
        },
        card: {
            width: "100%",
            height: 250,
            borderRadius: 20,
            backgroundColor: theme.main,
            overflow: "hidden",
        },
        image: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.main,
        },
        orderBadge: {
            position: "absolute",
            top: 10,
            right: 10,
            width: 26,
            height: 26,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.dark,
            borderRadius: 13,
            borderWidth: 1.5,
            borderColor: theme.text,
            zIndex: 10,
        },
        orderBadgeActive: {
            backgroundColor: theme.accent,
            borderColor: theme.accent,
        },
        orderText: {
            color: theme.text,
            fontSize: 12,
            fontWeight: "bold",
        },
        gradient: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "65%",
        },
        info: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "column",
            padding: 12,
            rowGap: 6,
        },
        title: {
            color: theme.text,
            fontWeight: "600",
            fontSize: 13,
            lineHeight: 16,
        },
        statusContainer: {
            alignSelf: "flex-start",
            backgroundColor: theme.text + 20,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
        },
        statusText: {
            color: theme.text,
            fontSize: 10,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.3,
        },
        pinBadge: {
            position: "absolute",
            top: 10,
            alignSelf: "center",
            padding: 4,
            backgroundColor: theme.main,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.accent,
            zIndex: 20,
        },
        ratingBadge: {
            position: "absolute",
            top: 10,
            left: 10,
            height: 25,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: theme.main,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.yellow,
            zIndex: 11,
        },
        folderBadge: {
            position: "absolute",
            top: 10,
            right: 10,
            height: 25,
            flexDirection: "row",
            alignItems: "center",
            columnGap: 4,
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: theme.accent,
            borderRadius: 8,
            zIndex: 11,
        },
        scoreCount: { color: theme.yellow, fontSize: 11, fontWeight: "bold" },
        folderCount: { color: theme.text, fontSize: 11, fontWeight: "bold" },
    });
