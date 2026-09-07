import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import { ChevronDown, ChevronUp, Clock } from "lucide-react-native";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { calculateCollectionTime } from "../../../utils/analyticsHelpers";
import { useTheme } from "../../../hooks/useTheme";

const GOAL_OPTIONS = [100, 500, 1000, 2500, 5000];

const CollectionProgress = ({ collection = [] }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const collectionGoal = useCollectionStore((state) => state.collectionGoal);
    const setCollectionGoal = useCollectionStore((state) => state.setCollectionGoal);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalItems = useMemo(() => {
        return collection.filter((item) => !item.isFolder).length;
    }, [collection]);

    const timeStats = useMemo(() => {
        return calculateCollectionTime(collection);
    }, [collection]);

    const progressPercent = Math.min((totalItems / collectionGoal) * 100, 100);

    const toggleMenu = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsMenuOpen(!isMenuOpen);
    };

    const selectGoal = (val) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCollectionGoal(val);
        setIsMenuOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Общий прогресс</Text>
            <View style={styles.statsBanner}>
                <TouchableOpacity
                    style={styles.statsHeader}
                    onPress={toggleMenu}
                    activeOpacity={0.7}
                >
                    <Text style={styles.statsTitle}>Обещаю собрать {collectionGoal} карточек</Text>
                    {isMenuOpen ? (
                        <ChevronUp color={theme.accent} size={20} />
                    ) : (
                        <ChevronDown color={theme.accent} size={20} />
                    )}
                </TouchableOpacity>

                {isMenuOpen && (
                    <View style={styles.goalPicker}>
                        <Text style={styles.pickerLabel}>Выберите новую цель:</Text>
                        <View style={styles.optionsRow}>
                            {GOAL_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.optionBadge,
                                        collectionGoal === opt && styles.activeOptionBadge,
                                    ]}
                                    onPress={() => selectGoal(opt)}
                                >
                                    <Text style={styles.optionText}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>

                <View style={styles.statsFooter}>
                    <Text style={styles.statsSubtitle}>Всего собрано: {totalItems}</Text>
                    <Text style={styles.statsPercent}>{Math.round(progressPercent)}%</Text>
                </View>

                {isMenuOpen && (
                    <>
                        <View style={styles.divider} />

                        <View style={styles.timeRow}>
                            <View style={styles.timeInfoBlock}>
                                <Clock color={theme.accent} size={16} />
                                <Text style={[styles.timeLabel, { color: theme.accent }]}>
                                    Вы потратили:
                                </Text>
                            </View>
                            <Text style={styles.timeValue}>
                                ~{timeStats?.completedDisplay || "0 ч"}
                            </Text>
                        </View>

                        <View style={styles.timeRow}>
                            <View style={styles.timeInfoBlock}>
                                <Clock color={theme.text} size={16} />
                                <Text style={styles.timeLabel}>Нужно на всё:</Text>
                            </View>
                            <Text style={[styles.timeValue, { color: theme.text }]}>
                                ~{timeStats?.totalDisplay || "0 ч"}
                            </Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            gap: 12,
        },
        title: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
            paddingHorizontal: 4,
        },
        statsBanner: {
            marginTop: 10,
            padding: 20,
            backgroundColor: theme.main,
            borderRadius: 28,
        },
        statsHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
        },
        statsTitle: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "600",
        },
        goalPicker: {
            marginBottom: 20,
            paddingTop: 5,
        },
        pickerLabel: {
            color: theme.accent,
            fontSize: 12,
            marginBottom: 10,
        },
        optionsRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
        },
        optionBadge: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        activeOptionBadge: {
            backgroundColor: theme.accent,
        },
        optionText: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "600",
        },
        progressBar: {
            height: 10,
            backgroundColor: theme.accentMuted,
            borderRadius: 5,
            marginBottom: 10,
            overflow: "hidden",
        },
        progressFill: {
            height: "100%",
            backgroundColor: theme.accent,
            borderRadius: 5,
        },
        statsFooter: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        statsSubtitle: { color: theme.textDark, fontSize: 12 },
        statsPercent: { color: theme.accent, fontSize: 12, fontWeight: "700" },
        divider: {
            height: 1,
            backgroundColor: theme.accentMuted,
            marginVertical: 16,
        },
        timeRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
        },
        timeInfoBlock: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        timeLabel: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "500",
        },
        timeValue: {
            color: theme.accent,
            fontSize: 13,
            fontWeight: "700",
        },
    });

export default CollectionProgress;
