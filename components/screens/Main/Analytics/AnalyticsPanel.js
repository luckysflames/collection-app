import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { getOrderedCategories } from "../../../..//constants/index";
import { useCollectionStore } from "../../../../store/useCollectionStore";
import { calculateStats } from "../../../../utils/analyticsHelpers";
import AnalyticsSection from "./AnalyticsSection";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "../../../../hooks/useTheme";

export default function AnalyticsPanel({ collection }) {
    const [onlyRated, setOnlyRated] = useState(false);
    const orderedCategories = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const analyticsData = useMemo(() => {
        const filteredCollection = onlyRated
            ? collection.filter((item) => item.userScore > 0 || item.isBrilliant)
            : collection;

        const validCategories = orderedCategories.filter(Boolean);

        return validCategories.reduce((acc, catObj) => {
            const catId = catObj.id;
            const stats = calculateStats(filteredCollection, catId, onlyRated);

            if (stats) {
                acc.push({
                    id: catId,
                    stats,
                    count: filteredCollection.filter(
                        (i) =>
                            i.appSection &&
                            i.appSection.toLowerCase() === catId.toLowerCase() &&
                            !i.isFolder,
                    ).length,
                });
            }
            return acc;
        }, []);
    }, [collection, orderedCategories, onlyRated]);

    if (analyticsData.length === 0 && !onlyRated) {
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={[styles.mainTitle, { textAlign: "center" }]}>
                        Здесь появится аналитика, как только в коллекцию добавятся карточки
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
                </View>

                {/* Блок переключателя */}
                <View style={styles.switchWrapper}>
                    <Text style={styles.switchLabel}>Только оценённые</Text>
                    <Switch
                        value={onlyRated}
                        onValueChange={setOnlyRated}
                        trackColor={{ false: theme.textDark, true: theme.accent }}
                        thumbColor={theme.text}
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            paddingVertical: 24,
            gap: 10,
        },
        mainHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            paddingHorizontal: 4,
        },
        mainTitle: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: 0.5,
        },
        subTitleBadge: {
            color: theme.accent,
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
            color: theme.textDark,
            fontSize: 12,
            fontWeight: "600",
        },
        emptyFiltered: {
            padding: 40,
            alignItems: "center",
        },
        emptyFilteredText: {
            color: theme.textDark,
            textAlign: "center",
            fontSize: 14,
        },
        section: {
            backgroundColor: theme.main,
            borderRadius: 24,
            padding: 20,
        },
    });
