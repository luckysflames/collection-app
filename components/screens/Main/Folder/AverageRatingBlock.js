import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Zap } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const AverageRatingBlock = ({ items, onApply }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [includeUnrated, setIncludeUnrated] = useState(false);

    const averageScore = useMemo(() => {
        const filteredItems = includeUnrated
            ? items
            : items.filter((item) => item.userScore > 0 || item.isBrilliant);

        if (filteredItems.length === 0) return 0;

        const sum = filteredItems.reduce(
            (acc, item) => acc + (item.isBrilliant ? 11 : item.userScore || 0),
            0,
        );

        return parseFloat((sum / filteredItems.length).toFixed(1));
    }, [items, includeUnrated]);

    const toggleSwitch = () => setIncludeUnrated((previousState) => !previousState);

    if (items.length === 0 || (averageScore === 0 && !includeUnrated)) return null;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <Text style={styles.label}>Средний балл карточек: </Text>
                <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => onApply(Math.round(averageScore))}
                    activeOpacity={0.7}
                >
                    <Zap size={12} color={theme.accent} fill={theme.accent} />
                    <Text style={styles.avgValue}>{averageScore} / 10</Text>
                    <Text style={styles.applyText}>Применить</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.switchRow} onPress={toggleSwitch} activeOpacity={0.6}>
                <Text style={styles.switchLabel}>Учитывать карточки без рейтинга</Text>
                <View pointerEvents="none">
                    <Switch
                        value={includeUnrated}
                        onValueChange={setIncludeUnrated}
                        trackColor={{
                            false: theme.textDark,
                            true: theme.accentMuted,
                        }}
                        thumbColor={includeUnrated ? theme.accent : theme.accent}
                        style={{
                            transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                        }}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            width: "100%",
            backgroundColor: theme.main,
            borderRadius: 16,
            padding: 12,
            marginTop: 15,
        },
        topRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        label: {
            color: theme.text,
            fontSize: 13,
        },
        applyBtn: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.accentMuted,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        avgValue: {
            color: theme.text,
            fontWeight: "bold",
            fontSize: 13,
            marginLeft: 4,
        },
        applyText: {
            color: theme.accent,
            fontSize: 10,
            fontWeight: "700",
            textTransform: "uppercase",
            marginLeft: 8,
        },
        switchRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: theme.accentMuted,
        },
        switchLabel: {
            color: theme.textDark,
            fontSize: 11,
            fontWeight: "600",
        },
    });
