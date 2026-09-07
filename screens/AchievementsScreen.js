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
import { useTheme } from "../hooks/useTheme";

export default function AchievementsScreen({ navigation, route }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const highlightId = route.params?.highlightId;
    const insets = useSafeAreaInsets();

    const myCollection = useCollectionStore((state) => state.myCollection);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    // Локальный стейт под активный таб (переносим повыше для корректных проверок)
    const [activeTab, setActiveTab] = useState("common");

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

    // 1. СИНХРОННЫЙ ЭФФЕКТ: Быстро переключаем вкладку, если прилетел highlightId из другого таба
    useEffect(() => {
        if (highlightId) {
            const targetSection = groupedCategories.find((sec) =>
                sec.groups.some((g) => g.data.some((item) => item.id === highlightId)),
            );
            if (targetSection && targetSection.id !== activeTab) {
                setActiveTab(targetSection.id);
            }
        }
    }, [highlightId, groupedCategories]);

    // 2. АСИНХРОННЫЙ ЭФФЕКТ ДЛЯ СКРОЛЛА: Ждем, пока вкладка переключится и элементы отрендерятся
    useEffect(() => {
        if (!highlightId) return;

        // Проверяем, что элемент текущей вкладки действительно соответствует искомому ачивменту
        const targetElementExists = itemRefs[highlightId];

        // Даем нативному потоку 150-250мс на перестроение Layout (особенно критично для Android)
        const scrollTimer = setTimeout(() => {
            const element = itemRefs[highlightId];

            if (element && scrollRef.current) {
                // Измеряем позицию элемента относительно контейнера ScrollView
                element.measureLayout(
                    containerRef.current,
                    (x, y) => {
                        scrollRef.current?.scrollTo({
                            y: Math.max(0, y - 40), // Оставляем небольшой отступ сверху для красоты
                            animated: true,
                        });

                        // Очищаем параметры роута только ПОСЛЕ успешного скролла
                        navigation.setParams({ highlightId: undefined });
                    },
                    (error) => console.log("Ошибка измерения позиции ачивки:", error),
                );
            }
        }, 200);

        return () => clearTimeout(scrollTimer);
    }, [highlightId, activeTab, itemRefs]); // Реагирует на смену таба или появление рефов

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
                    <View ref={containerRef} style={styles.sectionBlock} collapsable={false}>
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
                                    <View
                                        key={item.id}
                                        ref={(el) => {
                                            if (el) itemRefs[item.id] = el;
                                        }}
                                        collapsable={false}
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
                )}

                {/* Безопасный отступ снизу с учетом меню */}
                <View style={{ height: isCompactMenu ? insets.bottom + 60 : insets.bottom + 90 }} />
            </ScrollView>

            {/* Модалка детальной информации */}
            {selectedAchiv && (
                <AchievementDetailModal
                    visible={!!selectedAchiv}
                    achievement={selectedAchiv}
                    onClose={() => setSelectedAchiv(null)}
                />
            )}
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.dark,
        },
        header: {
            paddingHorizontal: 20,
            paddingBottom: 15,
            backgroundColor: theme.dark,
        },
        tabsWrapper: {
            backgroundColor: theme.dark,
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
            color: theme.textDark,
            fontSize: 13,
            fontWeight: "600",
        },
        groupContainer: {
            marginBottom: 20,
        },
        groupTitle: {
            color: theme.accent,
            fontSize: 11,
            fontWeight: "800",
            textTransform: "uppercase",
            letterSpacing: 1.6,
            marginBottom: 12,
            marginLeft: 4,
        },
    });
