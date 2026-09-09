import React, { useState, useMemo, memo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    ScrollView,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { PieChart } from "react-native-gifted-charts";
import { CATEGORY_CONFIG, SUB_CATEGORIES } from "../../../../constants/index";
import { COUNTRIES_MAP, COUNTRIES_MAP_FULL_NAME_MAP } from "../../../../constants/countries";
import { useTheme } from "../../../../hooks/useTheme";

const capitalize = (str, forceLower = true) => {
    if (!str || typeof str !== "string") return "";
    return forceLower
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : str.charAt(0).toUpperCase() + str.slice(1);
};

const AnalyticsSection = memo(function AnalyticsSection({ category, stats, itemCount }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    // Берем массив цветов из темы
    const colorScale = useMemo(() => theme.chartColors || [], [theme.chartColors]);

    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("topStatuses");

    const categoryInfo = useMemo(() => SUB_CATEGORIES.find((c) => c.id === category), [category]);

    const tabs = useMemo(() => {
        const base = [
            { id: "topStatuses", label: "Статусы" },
            { id: "topGenres", label: "Жанры" },
        ];
        const extras = (CATEGORY_CONFIG[category] || []).map((extra) => ({
            id: extra.key,
            label: capitalize(extra.title.replace("Топ ", "")),
        }));
        return [...base, ...extras];
    }, [category]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded((prev) => !prev);
    };

    // Единый подбор и обработка элементов данных для круговой диаграммы и легенды
    const processedTabItems = useMemo(() => {
        const rawData = stats[activeTab] || [];
        const isCountryTab = activeTab === "topCountries";

        return rawData.slice(0, colorScale.length).map((item, index) => {
            let displayName = item.name;

            if (isCountryTab && item.name) {
                const cleanName = String(item.name).trim();
                displayName =
                    category === "tv"
                        ? COUNTRIES_MAP[cleanName.toUpperCase()] || item.name
                        : COUNTRIES_MAP_FULL_NAME_MAP[cleanName.toLowerCase()] || item.name;
            } else if (
                ![
                    "topAuthors",
                    "topStudios",
                    "topDevelopers",
                    "topCompanies",
                    "topCountries",
                    "topGenres",
                    "topPublishers",
                ].includes(activeTab)
            ) {
                displayName = capitalize(displayName, true);
            }

            return {
                rawItem: item,
                value: item.count || 0,
                color: colorScale[index] || theme.accent,
                displayName,
            };
        });
    }, [stats, activeTab, category, colorScale, theme.accent]);

    // Структурирование данных под требования Gifted Charts PieChart
    const chartData = useMemo(() => {
        if (processedTabItems.length === 0) {
            return [{ value: 1, color: theme.textDark, text: "Пусто" }];
        }

        return processedTabItems.map((item) => ({
            value: item.value,
            color: item.color,
            label: item.displayName,
        }));
    }, [processedTabItems, theme.textDark]);

    const currentTabTotalCount = stats[activeTab]?.length || 0;

    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.titleWrapper}>
                    <View style={styles.accentBar} />
                    <Text style={styles.sectionTitle}>{categoryInfo?.label}</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.itemCount}>{itemCount} шт</Text>
                    </View>
                </View>
                {isExpanded ? (
                    <ChevronUp color={theme.accent} size={20} />
                ) : (
                    <ChevronDown color={theme.accent} size={20} />
                )}
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.content}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsScroll}
                        contentContainerStyle={styles.tabsScrollContent}
                    >
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                                onPress={() => setActiveTab(tab.id)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.id && styles.activeTabText,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <View style={styles.chartContainer}>
                        <View style={styles.pieWrapper}>
                            <PieChart
                                donut
                                data={chartData}
                                radius={65}
                                innerRadius={40}
                                innerCircleColor={theme.main}
                                centerLabelComponent={() => (
                                    <Text style={styles.centerLabel}>Топ-5</Text>
                                )}
                                animationDuration={400}
                            />
                        </View>

                        <View style={styles.legendWrapper}>
                            <ScrollView
                                style={styles.legendScroll}
                                contentContainerStyle={styles.legendScrollContent}
                                nestedScrollEnabled={true}
                            >
                                {processedTabItems.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View
                                            style={[
                                                styles.colorDot,
                                                { backgroundColor: item.color },
                                            ]}
                                        />
                                        <Text style={styles.legendName} numberOfLines={1}>
                                            {item.displayName}
                                        </Text>
                                        <Text style={styles.legendCount}>{item.rawItem.count}</Text>
                                    </View>
                                ))}
                                {currentTabTotalCount > colorScale.length && (
                                    <Text style={styles.moreText}>
                                        + еще {currentTabTotalCount - colorScale.length} не вошли в
                                        топ...
                                    </Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={styles.timeFooter}>
                        <View style={styles.timeBlock}>
                            <Text style={styles.timeValue}>
                                ~{stats.timeStats?.completedDisplay || "0 ч"}
                            </Text>
                            <Text style={styles.timeLabel}>Вы потратили</Text>
                        </View>
                        <View style={styles.timeDivider} />
                        <View style={styles.timeBlock}>
                            <Text style={styles.timeValue}>
                                ~{stats.timeStats?.totalDisplay || "0 ч"}
                            </Text>
                            <Text style={styles.timeLabel}>Нужно на всё</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
});

export default AnalyticsSection;

const createLocalStyles = (theme) =>
    StyleSheet.create({
        section: {
            backgroundColor: theme.main,
            borderRadius: 24,
            overflow: "hidden",
        },
        sectionHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
        },
        titleWrapper: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        accentBar: {
            width: 4,
            height: 18,
            backgroundColor: theme.accent,
            borderRadius: 2,
        },
        sectionTitle: {
            color: theme.text,
            fontSize: 18,
            fontWeight: "700",
        },
        countBadge: {
            backgroundColor: theme.accentMuted,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
        },
        itemCount: {
            color: theme.accent,
            fontSize: 12,
            fontWeight: "700",
        },
        content: {
            paddingBottom: 20,
        },
        tabsScroll: {
            marginBottom: 15,
        },
        tabsScrollContent: {
            paddingHorizontal: 20,
        },
        tab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            marginRight: 8,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        activeTab: {
            backgroundColor: theme.accent,
        },
        tabText: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "600",
        },
        activeTabText: {
            color: theme.main,
        },
        chartContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            height: 160,
        },
        pieWrapper: {
            width: 130,
            height: 130,
            justifyContent: "center",
            alignItems: "center",
        },
        centerLabel: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "bold",
        },
        legendWrapper: {
            flex: 1,
            height: "100%",
            marginLeft: 15,
        },
        legendScroll: {
            flex: 1,
        },
        legendScrollContent: {
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 10,
            paddingRight: 10,
        },
        legendItem: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        colorDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: 8,
        },
        legendName: {
            color: theme.text,
            fontSize: 12,
            flex: 1,
        },
        legendCount: {
            color: theme.accent,
            fontSize: 12,
            fontWeight: "700",
            marginLeft: 5,
            minWidth: 20,
            textAlign: "right",
        },
        moreText: {
            color: theme.textDark,
            fontSize: 10,
            textAlign: "center",
            marginTop: 4,
            fontStyle: "italic",
        },
        timeFooter: {
            flexDirection: "row",
            marginTop: 20,
            marginHorizontal: 20,
            padding: 15,
            borderWidth: 1,
            borderColor: theme.accent,
            borderRadius: 16,
            alignItems: "center",
        },
        timeBlock: {
            flex: 1,
            alignItems: "center",
        },
        timeValue: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "800",
        },
        timeLabel: {
            color: theme.textDark,
            fontSize: 10,
            textTransform: "uppercase",
            marginTop: 2,
        },
        timeDivider: {
            width: 1,
            height: 30,
            backgroundColor: theme.textDark,
        },
    });
