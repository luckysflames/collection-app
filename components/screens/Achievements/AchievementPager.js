import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
} from "react";
import { Animated, Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import { AchievementItem } from "./AchievementItem";

const SCREEN_WIDTH = Dimensions.get("window").width;

const flattenGroups = (groups) =>
    groups.flatMap((group) => [
        ...(groups.length > 1
            ? [{ id: `${group.id}-header`, type: "header", title: group.title }]
            : []),
        ...group.data.map((achievement) => ({
            id: achievement.id,
            type: "achievement",
            achievement,
        })),
    ]);

// Мемоизированный компонент отдельной страницы
const AchievementSectionPage = memo(function AchievementSectionPage({
    section,
    highlightId,
    onAchievementPress,
    bottomInset,
    onHighlightReady,
}) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);
    const listRef = useRef(null);

    const rows = useMemo(() => flattenGroups(section.groups), [section.groups]);
    const highlightIndex = useMemo(
        () => rows.findIndex((row) => row.id === highlightId),
        [rows, highlightId],
    );

    useEffect(() => {
        if (highlightIndex < 0) return;

        const frame = requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({
                index: highlightIndex,
                animated: false,
                viewPosition: 0.25,
            });
            onHighlightReady?.();
        });

        return () => cancelAnimationFrame(frame);
    }, [highlightIndex, onHighlightReady]);

    const renderRow = useCallback(
        ({ item }) => {
            if (item.type === "header") {
                return <Text style={styles.groupTitle}>{item.title}</Text>;
            }

            return (
                <AchievementItem
                    achievement={item.achievement}
                    onPress={onAchievementPress}
                    isHighlighted={item.id === highlightId}
                />
            );
        },
        [highlightId, onAchievementPress, styles],
    );

    const listHeader = useMemo(
        () => (
            <View style={styles.sectionMeta}>
                <Text style={styles.sectionStatsText}>
                    Выполнено: {section.stats.unlocked} из {section.stats.total}
                </Text>
            </View>
        ),
        [section.stats.unlocked, section.stats.total, styles],
    );

    const keyExtractor = useCallback((item) => item.id, []);

    const getItemLayout = useCallback(
        (_, index) => ({
            length: 78,
            offset: 78 * index,
            index,
        }),
        [],
    );

    return (
        <FlatList
            ref={listRef}
            data={rows}
            renderItem={renderRow}
            keyExtractor={keyExtractor}
            ListHeaderComponent={listHeader}
            ListFooterComponent={<View style={{ height: bottomInset }} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            getItemLayout={getItemLayout}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
        />
    );
});

export const AchievementPager = memo(
    forwardRef(function AchievementPager(
        {
            sections,
            activeTab,
            onTabChange,
            onScroll,
            highlightId,
            onAchievementPress,
            bottomInset,
            onHighlightReady,
        },
        ref,
    ) {
        const { createStyles } = useTheme();
        const styles = createStyles(createLocalStyles);
        const pagerRef = useRef(null);

        useImperativeHandle(
            ref,
            () => ({
                scrollToIndex: (index) =>
                    pagerRef.current?.scrollToIndex({ index, animated: true }),
            }),
            [],
        );

        const activeIndex = Math.max(
            0,
            sections.findIndex((section) => section.id === activeTab),
        );

        const renderPage = useCallback(
            ({ item }) => (
                <View style={styles.page}>
                    <AchievementSectionPage
                        section={item}
                        highlightId={highlightId}
                        onAchievementPress={onAchievementPress}
                        bottomInset={bottomInset}
                        onHighlightReady={onHighlightReady}
                    />
                </View>
            ),
            [bottomInset, highlightId, onAchievementPress, onHighlightReady, styles],
        );

        const handleMomentumScrollEnd = useCallback(
            (event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                const section = sections[index];
                if (section && section.id !== activeTab) {
                    onTabChange(section.id);
                }
            },
            [activeTab, onTabChange, sections],
        );

        const getItemLayout = useCallback(
            (_, index) => ({
                length: SCREEN_WIDTH,
                offset: SCREEN_WIDTH * index,
                index,
            }),
            [],
        );

        const keyExtractor = useCallback((section) => section.id, []);

        return (
            <Animated.FlatList
                ref={pagerRef}
                data={sections}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderPage}
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                initialScrollIndex={activeIndex}
                onScroll={onScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                windowSize={3}
                removeClippedSubviews
            />
        );
    }),
);

const createLocalStyles = (theme) =>
    StyleSheet.create({
        page: { width: SCREEN_WIDTH, flex: 1 },
        listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 50 },
        sectionMeta: { marginBottom: 16, paddingHorizontal: 4 },
        sectionStatsText: { color: theme.textDark, fontSize: 13, fontWeight: "600" },
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
