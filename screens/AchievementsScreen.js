import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
} from "react-native";

import { useCollectionStore } from "../store/useCollectionStore";
import { AchievementItem } from "../components/screens/Achievements/AchievementItem";
import { AchievementDetailModal } from "../components/screens/Achievements/AchievementDetailModal";
import { calculateAchievements } from "../utils/calculateAchievements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { ACHIEVEMENT_GROUPS } from "../constants";

export default function AchievementsScreen({ navigation, route }) {
    const highlightId = route.params?.highlightId;
    const scrollRef = React.useRef(null); // Реф для скролла
    const containerRef = React.useRef(null);
    const itemRefs = React.useRef({}).current;
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const [selectedAchiv, setSelectedAchiv] = useState(null);

    const groupedAchievements = useMemo(() => {
        const withProgress = calculateAchievements(myCollection);

        // Создаем объект, где ключи — это groupId
        const groups = withProgress.reduce((acc, achiv) => {
            const groupId = achiv.groupId || "other";
            if (!acc[groupId]) acc[groupId] = [];
            acc[groupId].push(achiv);
            return acc;
        }, {});

        // Превращаем в массив для отрисовки
        return Object.keys(groups).map((groupId) => ({
            id: groupId,
            title: ACHIEVEMENT_GROUPS[groupId] || "Прочее",
            data: groups[groupId],
        }));
    }, [myCollection]);

    const stats = useMemo(() => {
        // Получаем плоский массив всех достижений с рассчитанным прогрессом
        const allAchivs = calculateAchievements(myCollection);
        const total = allAchivs.length;
        const unlocked = allAchivs.filter((a) => a.isCompleted).length;

        return { total, unlocked };
    }, [myCollection]);

    // Функция для записи координат элемента
    const handleItemLayout = (id, y) => {
        itemPositions[id] = y;
    };

    // Эффект для прокрутки при появлении highlightId
    useEffect(() => {
        if (highlightId && itemRefs[highlightId]) {
            const interactionPromise = InteractionManager.runAfterInteractions(() => {
                const timer = setTimeout(() => {
                    if (itemRefs[highlightId] && containerRef.current) {
                        itemRefs[highlightId].measureLayout(
                            containerRef.current,
                            (x, y) => {
                                scrollRef.current?.scrollTo({
                                    y: Math.max(0, y - 150),
                                    animated: true,
                                });
                            },
                            (error) => console.error("Scroll error:", error),
                        );
                    }
                }, 400);

                return () => clearTimeout(timer);
            });

            // ПРАВКА ЗДЕСЬ:
            // Вместо setTimeout, который может выстрелить "в спину" ушедшему экрану,
            // мы просто проверяем, жив ли еще навигатор, или сбрасываем параметры только если экран в фокусе.
            const clearParamsTimer = setTimeout(() => {
                // Проверяем, можем ли мы менять параметры (экран не закрыт)
                if (navigation.isFocused()) {
                    navigation.setParams({ highlightId: undefined });
                }
            }, 3000);

            return () => {
                interactionPromise.cancel();
                clearTimeout(clearParamsTimer);
            };
        }
    }, [highlightId, navigation]);

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top - 20 }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.headerButton}
                    >
                        <ChevronLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Достижения</Text>
                </View>

                {/* Новый счетчик справа */}
                <View style={styles.statsBadge}>
                    <Text style={styles.statsText}>
                        {stats.unlocked}
                        <Text style={styles.statsDivider}> / </Text>
                        {stats.total}
                    </Text>
                </View>
            </View>

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16} // Увеличивает частоту обработки событий скролла
                scrollToOverflowEnabled={true}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Обертка для измерения координат */}
                <View ref={containerRef}>
                    {groupedAchievements.map((group) => (
                        <View key={group.id} style={styles.groupContainer}>
                            <Text style={styles.groupTitle}>{group.title}</Text>
                            {group.data.map((item) => (
                                <View
                                    key={item.id}
                                    ref={(el) => (itemRefs[item.id] = el)} // Сохраняем реф на View
                                >
                                    <AchievementItem
                                        achievement={item}
                                        onPress={setSelectedAchiv}
                                        isHighlighted={highlightId === item.id}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        height: isCompactMenu ? insets.bottom + 60 : insets.bottom + 90,
                    }}
                />
            </ScrollView>

            <AchievementDetailModal
                visible={!!selectedAchiv}
                achievement={selectedAchiv}
                onClose={() => setSelectedAchiv(null)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Расталкиваем заголовок и счетчик
        paddingBottom: 30,
        backgroundColor: "#050B18",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 15,
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
    // Стили для счетчика
    statsBadge: {
        backgroundColor: "rgba(125, 138, 255, 0.15)", // Прозрачный акцентный фон
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    statsText: {
        color: "#7D8AFF", // Цвет в тон заголовкам групп
        fontSize: 16,
        fontWeight: "bold",
        fontVariant: ["tabular-nums"], // Чтобы цифры не прыгали при изменении
    },
    statsDivider: {
        color: "rgba(125, 138, 255, 0.5)",
        fontWeight: "normal",
    },
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        color: "#7D8AFF", // Акцентный цвет для заголовка группы
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 5,
    },
});
