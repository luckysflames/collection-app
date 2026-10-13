import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from "react-native";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useShallow } from "zustand/react/shallow";
import { getOrderedCategories } from "../../../constants";
import { useTheme } from "../../../hooks/useTheme";

const { width } = Dimensions.get("window");

export const CategorySelector = ({ onSelect, insets }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const orderedCategories = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    const getLabel = (id) => {
        const labels = {
            game: "игру",
            book: "книгу",
            anime: "аниме",
            manga: "мангу",
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
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() => onSelect(cat.id)}
                        >
                            <View style={styles.standardLayout}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.iconWrapper}>
                                        <Image
                                            source={cat.active}
                                            style={styles.icon}
                                            tintColor={theme.accent}
                                        />
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.dark,
            paddingHorizontal: 20,
        },
        headerTitle: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 7.5,
            marginBottom: 8,
        },
        subtitle: {
            color: theme.textDark,
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
            height: 180,
            backgroundColor: theme.main,
            borderRadius: 28,
            padding: 20,
            marginBottom: 15,
        },
        standardLayout: {
            flex: 1,
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
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        icon: { width: 24, height: 24, objectFit: "contain" },
        cardFooter: {
            gap: 4,
        },
        cardText: { color: theme.text, fontSize: 18, fontWeight: "700" },
        subText: { color: theme.textDark, fontSize: 12, fontWeight: "500" },
    });
