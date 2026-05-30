import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy } from "lucide-react-native";

import { useCollectionStore } from "../store/useCollectionStore";
import AnalyticsPanel from "../components/screens/Main/Analytics/AnalyticsPanel";
import CollectionProgress from "../components/screens/Main/CollectionProgress";
import { useShallow } from 'zustand/react/shallow';
import { getOrderedCategories } from "../constants";

const { width } = Dimensions.get("window");

// Маппинг уникальных подписей для каждой категории
const CATEGORY_ACTION_TEXTS = {
    game: "Перейти на next lvl",
    movie: "Перейти в кинотеатр",
    tv: "Перейти на lostfilm",
    anime: "Перейти в 2D мир",
    book: "Перейти в библиотеку",
};

export default function CollectionDashboard({ navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const orderedCategories = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    const totalItems = myCollection.filter((item) => !item.isFolder).length;

    const getCount = (categoryName) => {
        return myCollection.filter((item) => item.appSection === categoryName && !item.isFolder)
            .length;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 40 }]}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Мои коллекции</Text>
                <View style={styles.headerButton}>
                    <TouchableOpacity onPress={() => navigation.navigate("Achievements")}>
                        <Trophy size={22} color="#7D8AFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.grid}>
                    {orderedCategories.map((cat, index) => {
                        const isLast = index === orderedCategories.length - 1;
                        // Достаем кастомный текст или оставляем дефолтный на случай несовпадения ID
                        const subTextAction =
                            CATEGORY_ACTION_TEXTS[cat.id] || "Перейти к коллекции";

                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.card, isLast && styles.cardFullWidth]}
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate("MainScreen", {
                                        appSection: cat.id,
                                    })
                                }
                            >
                                {/* Уникальное свечение для стандартных и для нижней карточки */}
                                <View style={styles.cardGlow} />

                                <View
                                    style={[
                                        isLast ? styles.fullWidthLayout : styles.standardLayout,
                                    ]}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.iconWrapper}>
                                            <Image
                                                source={cat.active}
                                                style={styles.icon}
                                                tintColor="#7D8AFF"
                                            />
                                        </View>

                                        {/* Счётчик отображается здесь только для первых 4-х карточек */}
                                        {!isLast && (
                                            <Text style={styles.countText}>{getCount(cat.id)}</Text>
                                        )}
                                    </View>

                                    <View
                                        style={[
                                            styles.cardFooter,
                                            isLast && styles.cardFooterFullWidth,
                                        ]}
                                    >
                                        <View>
                                            <Text style={styles.cardText}>{cat.label}</Text>
                                            <Text style={styles.subText}>{subTextAction}</Text>
                                        </View>

                                        {/* Счётчик для 5-й карточки внутри изолированного контейнера для ручной настройки */}
                                        {isLast && (
                                            <View style={styles.countFullWidthContainer}>
                                                <Text style={styles.countTextFullWidth}>
                                                    {getCount(cat.id)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <CollectionProgress collection={myCollection} />
                <AnalyticsPanel collection={myCollection} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18", paddingHorizontal: 20 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 75,
    },
    headerButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    scrollContent: {
        paddingBottom: 120,
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
        overflow: "hidden",
    },
    cardFullWidth: {
        width: "100%",
        height: 110, // Слегка скорректировал высоту для идеального баланса с кастомным паддингом
    },

    // === Свечение (Glow эффекты) ===
    cardGlow: {
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderRadius: 60,
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

    // Счётчик для обычных карточек
    countText: {
        color: "rgba(125, 138, 255, 0.8)",
        fontSize: 16,
        fontWeight: "700",
        width: 40,
        textAlign: "center",
        marginRight: -5,
        marginTop: 5,
    },

    // === Контейнер цифры для 5-й карточки (Крути его как хочешь) ===
    // countFullWidthContainer: {
    //     position: "absolute",
    //     top: -40,
    //     right: -85,
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    // },
    countTextFullWidth: {
        color: "rgba(125, 138, 255, 0.8)",
        fontSize: 16,
        fontWeight: "700",
        width: 40,
        textAlign: "center",
        marginRight: -5,
        marginTop: -25,
    },

    cardFooter: {
        gap: 4,
    },
    cardFooterFullWidth: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 15,
        position: "relative", // Важно для абсолютного позиционирования счетчика внутри
    },
    cardText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    subText: { color: "#4E5564", fontSize: 12, fontWeight: "500" },
});
