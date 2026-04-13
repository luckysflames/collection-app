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
import { SUB_CATEGORIES } from "../constants";
import { useCollectionStore } from "../store/useCollectionStore";

const { width } = Dimensions.get("window");

export default function CollectionDashboard({ navigation }) {
    const insets = useSafeAreaInsets();

    // Получаем всю коллекцию из стора
    const myCollection = useCollectionStore((state) => state.myCollection);

    // Функция подсчета
    const getCount = (categoryName) => {
        return myCollection.filter(
            (item) => item.appSection === categoryName && !item.isFolder,
        ).length;
    };

    // Общий прогресс (все элементы, исключая сами папки, если хочешь считать только контент)
    const totalItems = myCollection.filter((item) => !item.isFolder).length;

    // Для прогресс-бара (например, цель 500 элементов)
    const goal = 500;
    const progressPercent = Math.min((totalItems / goal) * 100, 100);

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <Text style={styles.headerTitle}>Мои коллекции</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.grid}>
                    {SUB_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate("MainScreen", {
                                    appSection: cat.id,
                                })
                            }
                        >
                            {/* Декоративное свечение внутри карточки */}
                            <View style={styles.cardGlow} />

                            <View style={styles.cardHeader}>
                                <View style={styles.iconWrapper}>
                                    <Image
                                        source={cat.active}
                                        style={styles.icon}
                                        tintColor="#7D8AFF"
                                    />
                                </View>
                                <Text style={styles.countText}>
                                    {getCount(cat.id)}
                                </Text>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={styles.cardText}>{cat.id}</Text>
                                <Text style={styles.subText}>
                                    Перейти к списку
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Дополнительный блок, чтобы занять пустоту снизу */}
                <View style={styles.statsBanner}>
                    <Text style={styles.statsTitle}>
                        Общий прогресс (цель - {goal} карточек)
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progressPercent}%` },
                            ]}
                        />
                    </View>
                    <Text style={styles.statsSubtitle}>
                        Всего собрано: {totalItems} карточек
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18", paddingHorizontal: 20 },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    scrollContent: {
        paddingBottom: 120, // Чтобы таббар не перекрывал контент
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
    countText: {
        color: "rgba(125, 138, 255, 0.8)",
        fontSize: 16,
        fontWeight: "700",
    },
    cardFooter: {
        gap: 4,
    },
    cardText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    subText: { color: "#4E5564", fontSize: 12, fontWeight: "500" },

    // Баннер внизу
    statsBanner: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    statsTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 4,
        marginBottom: 8,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#7D8AFF",
        borderRadius: 4,
    },
    statsSubtitle: { color: "#8E94A4", fontSize: 12 },
});
