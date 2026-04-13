import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import {
    Check,
    SortAsc,
    Clock,
    Star,
    X,
    CaseSensitive,
} from "lucide-react-native";

export const SortModal = ({
    isVisible,
    onClose,
    currentSort,
    onSelectSort,
}) => {
    const sortOptions = [
        { id: "newest", label: "Сначала новые", icon: Clock },
        { id: "oldest", label: "Сначала старые", icon: SortAsc },
        { id: "rating", label: "По рейтингу", icon: Star },
        { id: "alphabetical", label: "По алфавиту", icon: CaseSensitive }, // Другая иконка
    ];

    const Content = (
        <View style={styles.modalContent}>
            {/* Индикатор для свайпа вниз (визуальный) */}
            <View style={styles.pullIndicator} />

            <View style={styles.header}>
                <Text style={styles.title}>Сортировка</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <X size={22} color="#8E94A4" />
                </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
                {sortOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = currentSort === option.id;

                    return (
                        <TouchableOpacity
                            key={option.id}
                            activeOpacity={0.7}
                            style={[
                                styles.optionItem,
                                isSelected && styles.optionItemActive,
                            ]}
                            onPress={() => {
                                onSelectSort(option.id);
                                onClose();
                            }}
                        >
                            <View style={styles.optionLeft}>
                                <View
                                    style={[
                                        styles.iconBox,
                                        isSelected && styles.iconBoxActive,
                                    ]}
                                >
                                    <Icon
                                        size={20}
                                        color={isSelected ? "#fff" : "#8E94A4"}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.optionLabel,
                                        isSelected && styles.optionLabelActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </View>

                            {isSelected && (
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
        </View>
    );

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {/* Если хочешь блюр фона — используй BlurView, если нет — оставь View */}
                    <TouchableWithoutFeedback>
                        {Content}
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(3, 7, 18, 0.85)", // Чуть темнее
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingBottom: Platform.OS === "ios" ? 50 : 30,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    pullIndicator: {
        width: 40,
        height: 4,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 12,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 0.5,
    },
    optionsContainer: { gap: 8 },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 16,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    optionItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        borderColor: "rgba(125, 138, 255, 0.2)",
        borderWidth: 1,
    },
    optionLeft: { flexDirection: "row", alignItems: "center" },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconBoxActive: { backgroundColor: "#7D8AFF" },
    optionLabel: {
        fontSize: 16,
        color: "#8E94A4",
        marginLeft: 16,
        fontWeight: "500",
    },
    optionLabelActive: { color: "#fff", fontWeight: "700" },
});
