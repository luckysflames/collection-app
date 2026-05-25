import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useShallow } from "zustand/react/shallow";
import { getOrderedCategories } from "../../../constants";

const { width } = Dimensions.get("window");

export const CategorySelector = ({ onSelect, insets }) => {
    const orderedCategories = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    // Вспомогательная функция для склонения
    const getLabel = (id) => {
        const labels = {
            game: "игру",
            book: "книгу",
            anime: "аниме",
            movie: "фильм",
            tv: "сериал",
        };
        return labels[id] || "медиа";
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <Text style={styles.headerTitle}>Поиск</Text>
            <Text style={styles.subtitle}>Выберите категорию для поиска</Text>

            <View style={styles.grid}>
                {orderedCategories.map((cat, index) => {
                    const isLast = index === orderedCategories.length - 1;

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, isLast && styles.cardFullWidth]}
                            activeOpacity={0.8}
                            onPress={() => onSelect(cat.id)}
                        >
                            <View style={[isLast ? styles.fullWidthLayout : styles.standardLayout]}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconWrapper}>
                                        <Image
                                            source={cat.active}
                                            style={styles.icon}
                                            tintColor="#7D8AFF"
                                        />
                                    </View>
                                </View>

                                <View
                                    style={[
                                        styles.cardFooter,
                                        isLast && styles.cardFooterFullWidth,
                                    ]}
                                >
                                    <View>
                                        <Text style={styles.cardText}>{cat.label}</Text>
                                        <Text style={styles.subText}>Найти {getLabel(cat.id)}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
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
        marginTop: 7.5,
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

    // === Базовые стили карточек ===
    card: {
        width: (width - 55) / 2,
        height: 180,
        backgroundColor: "#0B1534",
        borderRadius: 28,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
        overflow: "hidden", // Защищает границы от вылезания glow эффекта
    },
    cardFullWidth: {
        width: "100%",
        height: 110, // Компактная высота для растянутой нижней карточки
    },

    // === Варианты внутренней разметки ===
    standardLayout: {
        flex: 1,
        justifyContent: "space-between",
    },
    fullWidthLayout: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    cardFooterFullWidth: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 15,
    },
    cardText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    subText: { color: "#4E5564", fontSize: 12, fontWeight: "500" },
});
