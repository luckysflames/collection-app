import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    ScrollView,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { PieChart } from "react-native-gifted-charts";
import { CATEGORY_CONFIG, SUB_CATEGORIES } from "../../../..//constants/index";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Вспомогательная функция для заглавной буквы
const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const colorScale = ["#7D8AFF", "#110a8c", "#35398c", "#2b0d87", "#180255"];

export default function AnalyticsSection({ category, stats, itemCount }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState("topStatuses");

    const categoryInfo = SUB_CATEGORIES.find((c) => c.id === category);

    const tabs = useMemo(() => {
        const base = [
            { id: "topStatuses", label: "Статусы" },
            { id: "topGenres", label: "Жанры" },
        ];
        const extras = (CATEGORY_CONFIG[category] || []).map((extra) => ({
            id: extra.key,
            // Применяем capitalize к динамическим заголовкам
            label: capitalize(extra.title.replace("Топ ", "")),
        }));
        return [...base, ...extras];
    }, [category]);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    const chartData = useMemo(() => {
        const rawData = stats[activeTab] || [];

        if (rawData.length === 0) {
            return [{ value: 1, color: "#444E72", text: "Пусто" }];
        }

        // Ограничиваем количество элементов, чтобы цвета не повторялись
        // Slice берет первые N элементов (где N - количество цветов)
        return rawData.slice(0, colorScale.length).map((item, index) => ({
            value: item.count,
            color: colorScale[index],
            label: item.name,
        }));
    }, [stats, activeTab]);

    const displayData = useMemo(() => {
        return (stats[activeTab] || []).slice(0, colorScale.length);
    }, [stats, activeTab]);

    return (
        <View style={styles.section}>
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.titleWrapper}>
                    <View style={styles.accentBar} />
                    <Text style={styles.sectionTitle}>
                        {categoryInfo?.label}
                    </Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.itemCount}>{itemCount} шт</Text>
                    </View>
                </View>
                {isExpanded ? (
                    <ChevronUp color="#7D8AFF" size={20} />
                ) : (
                    <ChevronDown color="#7D8AFF" size={20} />
                )}
            </TouchableOpacity>

            {isExpanded && (
                <View style={styles.content}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.tabsScroll}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                style={[
                                    styles.tab,
                                    activeTab === tab.id && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab(tab.id)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === tab.id &&
                                            styles.activeTabText,
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
                                innerCircleColor={"#0B1534"}
                                centerLabelComponent={() => (
                                    <Text style={styles.centerLabel}>
                                        Топ-5
                                    </Text>
                                )}
                                animationDuration={500}
                            />
                        </View>

                        <View style={styles.legendWrapper}>
                            <ScrollView
                                style={styles.legendScroll}
                                contentContainerStyle={
                                    styles.legendScrollContent
                                }
                                nestedScrollEnabled={true}
                            >
                                {displayData.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View
                                            style={[
                                                styles.colorDot,
                                                {
                                                    backgroundColor:
                                                        colorScale[index],
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={styles.legendName}
                                            numberOfLines={1}
                                        >
                                            {capitalize(item.name)}
                                        </Text>
                                        <Text style={styles.legendCount}>
                                            {item.count}
                                        </Text>
                                    </View>
                                ))}
                                {stats[activeTab]?.length >
                                    colorScale.length && (
                                    <Text style={styles.moreText}>
                                        + еще{" "}
                                        {stats[activeTab].length -
                                            colorScale.length}
                                        {" "}не вошли в топ...
                                    </Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
        backgroundColor: "#0B1534",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
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
        backgroundColor: "#7D8AFF",
        borderRadius: 2,
    },
    sectionTitle: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "700",
    },
    countBadge: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    itemCount: {
        color: "#7D8AFF",
        fontSize: 12,
        fontWeight: "700",
    },
    content: {
        paddingBottom: 20,
    },
    tabsScroll: {
        marginBottom: 15,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 8,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    activeTab: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    tabText: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
    },
    activeTabText: {
        color: "#FFF",
    },
    chartContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        height: 160, // Фиксированная высота для стабильности при скролле легенды
    },
    pieWrapper: {
        width: 130,
        height: 130,
        justifyContent: "center",
        alignItems: "center",
    },
    centerLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    legendWrapper: {
        flex: 1,
        height: "100%", // Занимает всю высоту chartContainer
        marginLeft: 15,
    },
    legendScroll: {
        flex: 1,
    },
    legendScrollContent: {
        // Это заставляет элементы центрироваться, если их мало
        flexGrow: 1,
        justifyContent: "center",
        paddingVertical: 10, // Небольшой отступ сверху/снизу для красоты при скролле
        paddingRight: 10,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8, // Отступ между строками легенды
    },
    colorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    legendName: {
        color: "#A5A6F6",
        fontSize: 12,
        flex: 1,
    },
    legendCount: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "700",
        marginLeft: 5,
        minWidth: 20,
        textAlign: "right",
    },
    moreText: {
        color: "#444E72",
        fontSize: 10,
        textAlign: "center",
        marginTop: 4,
        fontStyle: "italic",
    },
});
