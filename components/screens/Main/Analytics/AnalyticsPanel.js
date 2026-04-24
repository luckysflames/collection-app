import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

import { CATEGORY_CONFIG, SUB_CATEGORIES } from "../../../../constants";
import { calculateStats } from "../../../../utils/analyticsHelpers";
import { TopValuesList } from "./TopValuesList";
import AnalyticsSection from "./AnalyticsSection";

export default function AnalyticsPanel({ collection }) {
    const categories = ["movie", "anime", "game", "book"];

    const analyticsData = useMemo(() => {
        return categories.reduce((acc, cat) => {
            const stats = calculateStats(collection, cat);
            if (stats) {
                acc.push({
                    id: cat,
                    stats,
                    count: collection.filter(
                        (i) => i.appSection === cat && !i.isFolder,
                    ).length,
                });
            }
            return acc;
        }, []);
    }, [collection]);

    if (analyticsData.length === 0) {
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
                <Text style={styles.mainTitle}>Аналитика</Text>
            </View>

            {analyticsData.map((item) => (
                <AnalyticsSection
                    key={item.id}
                    category={item.id}
                    stats={item.stats}
                    itemCount={item.count}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        gap: 10,
    },
    mainHeader: {
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    mainTitle: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    section: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
});
