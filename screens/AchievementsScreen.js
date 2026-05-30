import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCollectionStore } from "../store/useCollectionStore";
import { useAchievements } from "../hooks/useAchievements";

// Components
import { ScreenHeader } from "../components/screens/Achievements/ScreenHeader";
import { AchievementTabs } from "../components/screens/Achievements/AchievementTabs";
import { AchievementItem } from "../components/screens/Achievements/AchievementItem";
import { AchievementDetailModal } from "../components/screens/Achievements/AchievementDetailModal";

export default function AchievementsScreen({ navigation, route }) {
    const highlightId = route.params?.highlightId;
    const insets = useSafeAreaInsets();

    const myCollection = useCollectionStore((state) => state.myCollection);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    // Подключаем наш кастомный хук
    const {
        groupedCategories,
        totalStats,
        tabs,
        selectedAchiv,
        setSelectedAchiv,
        scrollRef,
        containerRef,
        itemRefs,
    } = useAchievements(myCollection, highlightId, navigation);

    // Локальный стейт под активный таб
    const [activeTab, setActiveTab] = useState("common");

    // Если пришли по пушу/ссылке с конкретной ачивкой (highlightId) – автоматически переключаем таб на нужный
    useEffect(() => {
        if (highlightId) {
            const targetSection = groupedCategories.find((sec) =>
                sec.groups.some((g) => g.data.some((item) => item.id === highlightId)),
            );
            if (targetSection) {
                setActiveTab(targetSection.id);
            }
        }
    }, [highlightId, groupedCategories]);

    // Получаем данные текущей активной секции
    const currentSection = groupedCategories.find((cat) => cat.id === activeTab);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top - 20 }]}>
                <ScreenHeader
                    title="Достижения"
                    onBack={() => navigation.goBack()}
                    unlocked={totalStats.unlocked}
                    total={totalStats.total}
                />
            </View>

            {/* Горизонтальный переключатель категорий */}
            {tabs.length > 0 && (
                <View style={styles.tabsWrapper}>
                    <AchievementTabs tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
                </View>
            )}

            {/* Основной список достижений */}
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {currentSection && (
                    <View ref={containerRef} style={styles.sectionBlock}>
                        {/* Мини-статистика по текущей секции */}
                        <View style={styles.sectionMeta}>
                            <Text style={styles.sectionStatsText}>
                                Выполнено: {currentSection.stats.unlocked} из{" "}
                                {currentSection.stats.total}
                            </Text>
                        </View>

                        {/* Группы внутри выбранной категории */}
                        {currentSection.groups.map((group) => (
                            <View key={group.id} style={styles.groupContainer}>
                                {currentSection.groups.length > 1 && (
                                    <Text style={styles.groupTitle}>{group.title}</Text>
                                )}

                                {group.data.map((item) => (
                                    <View key={item.id} ref={(el) => (itemRefs[item.id] = el)}>
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
                )}

                {/* Безопасный отступ снизу с учетом меню */}
                <View style={{ height: isCompactMenu ? insets.bottom + 60 : insets.bottom + 90 }} />
            </ScrollView>

            {/* Модалка детальной информации */}
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
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#050B18",
    },
    tabsWrapper: {
        backgroundColor: "#050B18",
        borderBottomWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.04)",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionBlock: {
        marginBottom: 20,
    },
    sectionMeta: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionStatsText: {
        color: "rgba(255, 255, 255, 0.4)",
        fontSize: 13,
        fontWeight: "600",
    },
    groupContainer: {
        marginBottom: 20,
    },
    groupTitle: {
        color: "#7D8AFF",
        fontSize: 11,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 1.6,
        marginBottom: 12,
        marginLeft: 4,
        opacity: 0.9,
    },
});
