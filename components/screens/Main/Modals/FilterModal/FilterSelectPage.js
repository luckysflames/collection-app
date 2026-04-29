import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Check } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterSelectPage = ({
    filter,
    localFilters,
    setLocalFilters,
    goBack,
}) => {
    if (!filter || (filter.type === "select" && !filter.options)) {
        return <View style={styles.page} />;
    }

    const handleSelect = (optionId) => {
        setLocalFilters((prev) => ({
            ...prev,
            [filter.id]: optionId,
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
                        {/* Опция "Любой" */}
                        <TouchableOpacity
                            onPress={handleReset}
                            style={styles.detailOptionItem}
                        >
                            <Text style={styles.optionLabel}>Любой</Text>
                            {localFilters[filter.id] === undefined && (
                                <Check size={20} color="#7D8AFF" />
                            )}
                        </TouchableOpacity>

                        {/* Список опций */}
                        {filter.options.map((option) => {
                            const isActive =
                                localFilters[filter.id] === option.id;
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
                                            isActive &&
                                                styles.optionLabelActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {isActive && (
                                        <Check
                                            size={20}
                                            color="#7D8AFF"
                                            strokeWidth={3}
                                        />
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

const styles = StyleSheet.create({
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
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderWidth: 1,
        borderColor: "transparent",
    },
    detailOptionActive: {
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
    optionLabel: {
        fontSize: 16,
        color: "#8E94A4",
        fontWeight: "500",
    },
    optionLabelActive: {
        color: "#fff",
        fontWeight: "600",
    },
    footerActions: {
        paddingTop: 15,
        backgroundColor: "#0B1534",
    },
    applyBtn: {
        height: 56,
        borderRadius: 20,
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    applyBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
