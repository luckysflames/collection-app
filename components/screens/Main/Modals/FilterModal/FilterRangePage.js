import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Check } from "lucide-react-native";
import { useTheme } from "../../../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterRangePage = ({
    filter,
    localFilters,
    setLocalFilters,
    getPresetsForFilter,
    goBack,
}) => {
    if (!filter || (filter.type === "select" && !filter.options)) {
        return <View style={styles.page} />;
    }

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const presets = React.useMemo(
        () => getPresetsForFilter(filter.id, filter.min, filter.max),
        [filter.id, filter.min, filter.max],
    );
    const currentValue = localFilters[filter.id];

    const handleSelectPreset = (value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [filter.id]: value,
        }));
    };

    const handleReset = () => {
        setLocalFilters((prev) => {
            const next = { ...prev };
            delete next[filter.id];
            return next;
        });
    };

    return (
        <View style={styles.page}>
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity onPress={handleReset} style={styles.detailOptionItem}>
                            <Text style={styles.optionLabel}>Любой (сбросить)</Text>
                            {currentValue === undefined && <Check size={20} color={theme.accent} />}
                        </TouchableOpacity>

                        {presets.map((preset) => {
                            const isSelected =
                                JSON.stringify(currentValue) === JSON.stringify(preset.value);

                            return (
                                <TouchableOpacity
                                    key={preset.label}
                                    onPress={() => handleSelectPreset(preset.value)}
                                    style={[
                                        styles.detailOptionItem,
                                        isSelected && styles.detailOptionActive,
                                    ]}
                                >
                                    <View>
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                isSelected && styles.optionLabelActive,
                                            ]}
                                        >
                                            {preset.label}
                                        </Text>
                                        <Text style={styles.rangeValuesHint}>
                                            {preset.value[0]} — {preset.value[1]}
                                        </Text>
                                    </View>
                                    {isSelected && (
                                        <Check size={20} color={theme.accent} strokeWidth={3} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footerActions}>
                <TouchableOpacity onPress={goBack} style={styles.applyBtn}>
                    <Text style={styles.applyBtnText}>Готово</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        page: {
            width: SCREEN_WIDTH,
            paddingHorizontal: 20,
            height: "100%",
        },
        scrollContainer: {
            flex: 1,
        },
        scrollContent: {
            paddingTop: 10,
            paddingBottom: 20,
        },
        optionsContainer: {
            paddingBottom: 20,
        },
        detailOptionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 18,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        detailOptionActive: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        optionLabel: {
            fontSize: 16,
            color: theme.textDark,
            fontWeight: "600",
        },
        optionLabelActive: {
            color: theme.text,
        },
        rangeValuesHint: {
            fontSize: 13,
            color: theme.textDark,
            marginTop: 2,
        },
        footerActions: {
            paddingTop: 15,
        },
        applyBtn: {
            height: 56,
            borderRadius: 20,
            backgroundColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
        applyBtnText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "bold",
        },
    });
