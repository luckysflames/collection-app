import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { CATEGORY_CONFIG, SUB_CATEGORIES } from "../../../..//constants/index";
import { calculateStats } from "../../../../utils/analyticsHelpers";
import AnalyticsSection from "./AnalyticsSection";

export default function AnalyticsPanel({ collection }) {
    const [onlyRated, setOnlyRated] = useState(false);
    const categories = ["movie", "anime", "game", "book"];

    const analyticsData = useMemo(() => {
        const filteredCollection = onlyRated
            ? collection.filter((item) => item.userScore > 0 || item.isBrilliant)
            : collection;

        return categories.reduce((acc, cat) => {
            // Передаем флаг onlyRated, чтобы функция знала, какой топ строить
            const stats = calculateStats(filteredCollection, cat, onlyRated);

            if (stats) {
                acc.push({
                    id: cat,
                    stats,
                    count: filteredCollection.filter(
                        (i) => i.appSection === cat && !i.isFolder,
                    ).length,
                });
            }
            return acc;
        }, []);
    }, [collection, onlyRated]);

    if (analyticsData.length === 0 && !onlyRated) {
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={[styles.mainTitle, { textAlign: "center" }]}>
                        Здесь появится аналитика, как только в коллекцию
                        добавятся карточки
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.mainHeader}>
                <View>
                    <Text style={styles.mainTitle}>Аналитика</Text>
                    {onlyRated && (
                        <Text style={styles.subTitleBadge}>
                            Только оценённые
                        </Text>
                    )}
                </View>

                {/* Блок переключателя */}
                <View style={styles.switchWrapper}>
                    <Text style={styles.switchLabel}>С оценкой</Text>
                    <Switch
                        value={onlyRated}
                        onValueChange={setOnlyRated}
                        trackColor={{ false: "#1A213E", true: "#7D8AFF" }}
                        thumbColor={onlyRated ? "#FFF" : "#8E94A4"}
                        ios_backgroundColor="#1A213E"
                    />
                </View>
            </View>

            {analyticsData.length === 0 && onlyRated ? (
                <View style={styles.emptyFiltered}>
                    <Text style={styles.emptyFilteredText}>
                        У вас пока нет карточек с оценками в категориях
                    </Text>
                </View>
            ) : (
                analyticsData.map((item) => (
                    <AnalyticsSection
                        key={item.id}
                        category={item.id}
                        stats={item.stats}
                        itemCount={item.count}
                    />
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        gap: 10,
    },
    mainHeader: {
        flexDirection: "row", // В ряд
        justifyContent: "space-between", // Раскидываем по краям
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    mainTitle: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    subTitleBadge: {
        color: "#7D8AFF",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
        marginTop: 2,
    },
    switchWrapper: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    switchLabel: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "600",
    },
    emptyFiltered: {
        padding: 40,
        alignItems: "center",
    },
    emptyFilteredText: {
        color: "#8E94A4",
        textAlign: "center",
        fontSize: 14,
    },
    section: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
});
