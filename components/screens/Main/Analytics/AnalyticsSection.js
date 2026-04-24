import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { CATEGORY_CONFIG, SUB_CATEGORIES } from "../../../../constants";
import { TopValuesList } from "./TopValuesList";

if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AnalyticsSection({ category, stats, itemCount }) {
    const [isExpanded, setIsExpanded] = useState(false); // Состояние развернутости

    const categoryInfo = SUB_CATEGORIES.find((c) => c.id === category);
    const extraLists = CATEGORY_CONFIG[category] || [];

    const toggleExpand = () => {
        // Настраиваем анимацию перед изменением состояния
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <View style={styles.section}>
            {/* Оборачиваем хедер в TouchableOpacity для кликабельности */}
            <TouchableOpacity
                style={styles.sectionHeader}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <View style={styles.titleWrapper}>
                    <View style={styles.accentBar} />
                    <Text style={styles.sectionTitle}>
                        {categoryInfo?.label || category}
                    </Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.itemCount}>{itemCount} шт</Text>
                    </View>
                </View>

                {/* Иконка-индикатор */}
                {isExpanded ? (
                    <ChevronUp color="#7D8AFF" size={20} />
                ) : (
                    <ChevronDown color="#7D8AFF" size={20} />
                )}
            </TouchableOpacity>

            {/* Условный рендеринг контента с анимацией */}
            {isExpanded && (
                <View style={styles.content}>
                    <TopValuesList
                        title="Топ статусов"
                        values={stats.topStatuses}
                    />

                    <TopValuesList title="Топ жанры" values={stats.topGenres} />

                    {extraLists.map((list) => (
                        <TopValuesList
                            key={list.key}
                            title={list.title}
                            values={stats[list.key]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        marginTop: 20,
        gap: 10,
    },
});
