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
import { useCollectionStore } from "../../../store/useCollectionStore";

const GOAL_OPTIONS = [100, 500, 1000, 2500, 5000];

const CollectionProgress = ({ totalItems }) => {
    const collectionGoal = useCollectionStore((state) => state.collectionGoal);
    const setCollectionGoal = useCollectionStore(
        (state) => state.setCollectionGoal,
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                    <Text style={styles.statsTitle}>
                        Обещаю собрать {collectionGoal} карточек
                    </Text>
                    {isMenuOpen ? (
                        <ChevronUp color="#7D8AFF" size={20} />
                    ) : (
                        <ChevronDown color="#7D8AFF" size={20} />
                    )}
                </TouchableOpacity>

                {isMenuOpen && (
                    <View style={styles.goalPicker}>
                        <Text style={styles.pickerLabel}>
                            Выберите новую цель:
                        </Text>
                        <View style={styles.optionsRow}>
                            {GOAL_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.optionBadge,
                                        collectionGoal === opt &&
                                            styles.activeOptionBadge,
                                    ]}
                                    onPress={() => selectGoal(opt)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            collectionGoal === opt &&
                                                styles.activeOptionText,
                                        ]}
                                    >
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progressPercent}%` },
                        ]}
                    />
                </View>

                <View style={styles.statsFooter}>
                    <Text style={styles.statsSubtitle}>
                        Всего собрано: {totalItems}
                    </Text>
                    <Text style={styles.statsPercent}>
                        {Math.round(progressPercent)}%
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        gap: 12,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        paddingHorizontal: 4,
    },
    statsBanner: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "#0B1534",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    statsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    statsTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    goalPicker: {
        marginBottom: 20,
        paddingTop: 5,
    },
    pickerLabel: {
        color: "#8E94A4",
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
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    activeOptionBadge: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    optionText: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
    },
    activeOptionText: {
        color: "#fff",
    },
    progressBar: {
        height: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 5,
        marginBottom: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#7D8AFF",
        borderRadius: 5,
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    statsFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statsSubtitle: { color: "#8E94A4", fontSize: 12 },
    statsPercent: { color: "#7D8AFF", fontSize: 12, fontWeight: "700" },
});

export default CollectionProgress;
