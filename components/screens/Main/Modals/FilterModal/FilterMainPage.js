import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { getFilterIcon } from "./helpers";
import { useTheme } from "../../../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterMainPage = ({
    filters,
    localFilters,
    goToFilterDetail,
    handleClearAll,
    handleApply,
    renderFilterValue,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const hasActiveFilters = Object.keys(localFilters).length > 0;

    return (
        <View style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                <View style={styles.optionsContainer}>
                    {filters.map((filter) => {
                        const isActive = localFilters[filter.id] !== undefined;
                        const displayValue = isActive
                            ? renderFilterValue(filter, localFilters[filter.id])
                            : "Не выбрано";

                        return (
                            <TouchableOpacity
                                key={filter.id}
                                onPress={() => goToFilterDetail(filter.id)}
                                activeOpacity={0.7}
                                style={[styles.optionItem, isActive && styles.optionItemActive]}
                            >
                                <View style={styles.optionLeft}>
                                    <View
                                        style={[styles.iconBox, isActive && styles.iconBoxActive]}
                                    >
                                        {getFilterIcon(
                                            filter.icon,
                                            20,
                                            isActive ? theme.text : theme.textDark,
                                        )}
                                    </View>
                                    <View style={styles.filterLabelContainer}>
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                isActive && styles.optionLabelActive,
                                            ]}
                                        >
                                            {filter.label}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.filterValueText,
                                                isActive && styles.filterValueTextActive,
                                            ]}
                                        >
                                            {displayValue}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight
                                    size={20}
                                    color={isActive ? theme.accent : theme.textDark}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footerActions}>
                {hasActiveFilters && (
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>Сбросить</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
                    <Text style={styles.applyBtnText}>Показать результаты</Text>
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
        },
        scrollContainer: {
            maxHeight: 450,
        },
        optionsContainer: {
            paddingBottom: 10,
        },
        optionItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 18,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        optionItemActive: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        optionLeft: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
        },
        iconBox: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
        },
        iconBoxActive: {
            backgroundColor: theme.accent,
        },
        filterLabelContainer: {
            flex: 1,
        },
        optionLabel: {
            fontSize: 16,
            color: theme.textDark,
            fontWeight: "600",
        },
        optionLabelActive: {
            color: theme.text,
        },
        filterValueText: {
            fontSize: 12,
            color: theme.textDark,
            marginTop: 2,
        },
        filterValueTextActive: {
            color: theme.accent,
            fontWeight: "600",
        },
        footerActions: {
            flexDirection: "row",
            paddingTop: 15,
            paddingHorizontal: 0,
            gap: 12,
        },
        clearBtn: {
            flex: 1,
            height: 56,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.red,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.redMuted,
        },
        clearBtnText: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "600",
        },
        applyBtn: {
            flex: 2,
            height: 56,
            borderRadius: 20,
            backgroundColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        applyBtnText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "bold",
        },
    });
