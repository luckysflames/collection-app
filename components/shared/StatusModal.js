import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView, // Добавляем ScrollView
} from "react-native";
import { Check, Trash2, Circle } from "lucide-react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { useCollectionStore } from "../../store/useCollectionStore";
import { FAVORITE_STATUS, STATUS_SELECTION_EXCLUDE } from "../../constants";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function StatusModal({
    visible,
    category,
    onClose,
    onSelect,
    currentStatus,
    removeCard,
}) {
    const getStatusesForSection = useCollectionStore(
        (state) => state.getStatusesForSection,
    );

    const STATUSES = getStatusesForSection(category);

    const selectableStatuses = [
        { label: "Без статуса", value: null },
        ...STATUSES.filter(
            (s) => ![...STATUS_SELECTION_EXCLUDE, FAVORITE_STATUS].includes(s),
        ).map((s) => ({ label: s, value: s })),
    ];

    const handleSelect = (value) => {
        onSelect(value);
        onClose();
    };

    const handleRemove = () => {
        onClose();
        setTimeout(() => {
            if (removeCard) removeCard();
        }, 300);
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.sheetContainer}
        >
            <Text style={styles.header}>Статус</Text>

            {/* Оборачиваем в View с flex: 1, чтобы список занял всё доступное место */}
            <View style={styles.mainContent}>
                <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {selectableStatuses.map((option) => {
                        const isActive =
                            currentStatus === option.value ||
                            (currentStatus == null && option.value == null);

                        return (
                            <TouchableOpacity
                                key={option.label}
                                onPress={() => handleSelect(option.value)}
                                style={[
                                    styles.statusItem,
                                    isActive && styles.statusItemActive,
                                ]}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        isActive && styles.iconWrapperActive,
                                    ]}
                                >
                                    <Circle
                                        color={isActive ? "#7D8AFF" : "#4E5564"}
                                        size={14}
                                        fill={
                                            isActive ? "#7D8AFF" : "transparent"
                                        }
                                    />
                                </View>

                                <View style={styles.statusInfo}>
                                    <Text
                                        style={[
                                            styles.statusText,
                                            isActive && styles.statusTextActive,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                </View>

                                {isActive && (
                                    <View style={styles.checkWrapper}>
                                        <Check
                                            color="#7D8AFF"
                                            size={20}
                                            strokeWidth={3}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Кнопки вынесены за пределы скролла, они всегда прижаты к низу */}
            <View style={styles.footer}>
                {!!removeCard && (
                    <TouchableOpacity
                        onPress={handleRemove}
                        style={styles.removeBtn}
                        activeOpacity={0.8}
                    >
                        <Trash2
                            color="#FF4B4B"
                            size={18}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.removeText}>
                            Удалить из коллекции
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                    <Text style={styles.doneBtnText}>Готово</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 20,
        maxHeight: SCREEN_HEIGHT * 0.8, // Ограничиваем общую высоту модалки
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    mainContent: {
        maxHeight: SCREEN_HEIGHT * 0.4, // Ограничиваем зону скролла
    },
    scrollContainer: {
        width: "100%",
    },
    scrollContent: {
        paddingBottom: 10,
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14, // Немного увеличил тап-зону
        paddingHorizontal: 12,
        borderRadius: 18,
        marginBottom: 8,
        backgroundColor: "rgba(255,255,255,0.03)",
        borderWidth: 1,
        borderColor: "transparent",
    },
    statusItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        borderColor: "rgba(125, 138, 255, 0.25)",
    },
    iconWrapper: {
        width: 38, // Слегка уменьшил, чтобы выглядело изящнее
        height: 38,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    iconWrapperActive: {
        backgroundColor: "rgba(125, 138, 255, 0.15)",
    },
    statusInfo: {
        flex: 1,
    },
    statusText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    statusTextActive: {
        color: "#fff",
    },
    checkWrapper: {
        marginLeft: 10,
    },
    footer: {
        marginTop: 10,
        paddingBottom: 5,
    },
    removeBtn: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(255, 75, 75, 0.08)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 75, 75, 0.15)",
    },
    removeText: {
        color: "#FF4B4B",
        fontSize: 15,
        fontWeight: "700",
    },
    doneBtn: {
        alignItems: "center",
        padding: 16,
        backgroundColor: "#7D8AFF",
        borderRadius: 20,
    },
    doneBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
