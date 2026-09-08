import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCollectionStore } from "../store/useCollectionStore";
import { useAchievements } from "../hooks/useAchievements";

import { ScreenHeader } from "../components/screens/Achievements/ScreenHeader";
import { AchievementTabs } from "../components/screens/Achievements/AchievementTabs";
import { AchievementPager } from "../components/screens/Achievements/AchievementPager";
import { AchievementDetailModal } from "../components/screens/Achievements/Modals/AchievementDetailModal";
import { useTheme } from "../hooks/useTheme";

export default function AchievementsScreen({ navigation, route }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const highlightId = route.params?.highlightId;
    const insets = useSafeAreaInsets();

    const myCollection = useCollectionStore((state) => state.myCollection);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    const [activeTab, setActiveTab] = useState("common");
    const [highlightedId, setHighlightedId] = useState(highlightId);
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Стабильная ссылка на событие скролла без пересоздания на каждом рендере
    const handleScroll = useMemo(
        () =>
            Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                useNativeDriver: false,
            }),
        [scrollX],
    );

    const { groupedCategories, totalStats, tabs, selectedAchiv, setSelectedAchiv } =
        useAchievements(myCollection);

    useEffect(() => {
        if (!highlightId) return;
        setHighlightedId(highlightId);
        const targetSection = groupedCategories.find((section) =>
            section.groups.some((group) => group.data.some((item) => item.id === highlightId)),
        );
        if (targetSection) {
            setActiveTab(targetSection.id);
        }
    }, [highlightId, groupedCategories]);

    const handleHighlightReady = useCallback(() => {
        if (!highlightedId) return;
        navigation.setParams({ highlightId: undefined });
    }, [highlightedId, navigation]);

    const handleTabPress = useCallback((tabId, index) => {
        setActiveTab(tabId);
        pagerRef.current?.scrollToIndex(index);
    }, []);

    const bottomInset = isCompactMenu ? insets.bottom + 60 : insets.bottom + 90;

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(0, insets.top - 20) }]}>
                <ScreenHeader
                    title="Достижения"
                    onBack={navigation.goBack}
                    unlocked={totalStats.unlocked}
                    total={totalStats.total}
                />
            </View>

            {tabs.length > 0 && (
                <View style={styles.tabsWrapper}>
                    <AchievementTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabPress={handleTabPress}
                        scrollX={scrollX}
                    />
                </View>
            )}

            <AchievementPager
                ref={pagerRef}
                sections={groupedCategories}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                highlightId={highlightedId}
                onAchievementPress={setSelectedAchiv}
                bottomInset={bottomInset}
                onHighlightReady={handleHighlightReady}
                onScroll={handleScroll}
            />

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
        container: { flex: 1, backgroundColor: theme.dark },
        header: { paddingHorizontal: 20, paddingBottom: 15, backgroundColor: theme.dark },
        tabsWrapper: { backgroundColor: theme.dark },
    });
