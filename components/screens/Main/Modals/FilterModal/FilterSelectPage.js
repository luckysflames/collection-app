import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Check } from "lucide-react-native";
import { useTheme } from "../../../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterSelectPage = ({ filter, localFilters, setLocalFilters, goBack }) => {
    if (!filter || (filter.type === "select" && !filter.options)) {
        return <View style={styles.page} />;
    }

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const currentValue = localFilters[filter.id];
    const selectedValues = Array.isArray(currentValue)
        ? currentValue
        : currentValue
          ? [currentValue]
          : [];

    const handleSelect = (optionId) => {
        if (filter.multiSelect) {
            setLocalFilters((prev) => {
                const current = prev[filter.id];
                const values = Array.isArray(current) ? [...current] : current ? [current] : [];

                const isAlreadySelected = values.includes(optionId);
                const nextValues = isAlreadySelected
                    ? values.filter((id) => id !== optionId)
                    : [...values, optionId];

                if (nextValues.length === 0) {
                    const next = { ...prev };
                    delete next[filter.id];
                    return next;
                }

                return {
                    ...prev,
                    [filter.id]: nextValues,
                };
            });
        } else {
            setLocalFilters((prev) => ({
                ...prev,
                [filter.id]: optionId,
            }));
        }
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
                            <Text style={styles.optionLabel}>Любой</Text>
                            {selectedValues.length === 0 && (
                                <Check size={20} color={theme.accent} />
                            )}
                        </TouchableOpacity>

                        {filter.options.map((option) => {
                            const isActive = selectedValues.includes(option.id);
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => handleSelect(option.id)}
                                    style={[
                                        styles.detailOptionItem,
                                        isActive && styles.detailOptionActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            isActive && styles.optionLabelActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {isActive && (
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
            paddingVertical: 16,
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
            fontWeight: "500",
        },
        optionLabelActive: {
            color: theme.text,
            fontWeight: "600",
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
