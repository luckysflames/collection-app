import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Sliders, ChevronRight } from "lucide-react-native";
import { getFilterIcon } from "./helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterMainPage = ({
    filters,
    localFilters,
    goToFilterDetail,
    handleClearAll,
    handleApply,
    renderFilterValue,
}) => {
    const hasActiveFilters = Object.keys(localFilters).length > 0;

    return (
        <View style={styles.page}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollContainer}
            >
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
                                style={[
                                    styles.optionItem,
                                    isActive && styles.optionItemActive,
                                ]}
                            >
                                <View style={styles.optionLeft}>
                                    <View
                                        style={[
                                            styles.iconBox,
                                            isActive && styles.iconBoxActive,
                                        ]}
                                    >
                                        {getFilterIcon(
                                            filter.icon, // Берем имя иконки из обновленного конфига
                                            20,
                                            isActive ? "#fff" : "#8E94A4",
                                        )}
                                    </View>
                                    <View style={styles.filterLabelContainer}>
                                        <Text
                                            style={[
                                                styles.optionLabel,
                                                isActive &&
                                                    styles.optionLabelActive,
                                            ]}
                                        >
                                            {filter.label}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.filterValueText,
                                                isActive &&
                                                    styles.filterValueTextActive,
                                            ]}
                                        >
                                            {displayValue}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight
                                    size={20}
                                    color={
                                        isActive
                                            ? "#7D8AFF"
                                            : "rgba(142, 148, 164, 0.3)"
                                    }
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footerActions}>
                {hasActiveFilters && (
                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={styles.clearBtn}
                    >
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

const styles = StyleSheet.create({
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
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.02)",
    },
    optionItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.06)",
        borderColor: "rgba(125, 138, 255, 0.2)",
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
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    iconBoxActive: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
    },
    filterLabelContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        color: "#8E94A4",
        fontWeight: "600",
    },
    optionLabelActive: {
        color: "#fff",
    },
    filterValueText: {
        fontSize: 12,
        color: "#4E5564",
        marginTop: 2,
    },
    filterValueTextActive: {
        color: "#7D8AFF",
        fontWeight: "600",
    },
    footerActions: {
        flexDirection: "row",
        paddingTop: 15,
        paddingHorizontal: 0,
        gap: 12,
        backgroundColor: "#0B1534",
    },
    clearBtn: {
        flex: 1,
        height: 56,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    clearBtnText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    applyBtn: {
        flex: 2,
        height: 56,
        borderRadius: 20,
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    applyBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
