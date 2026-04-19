import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { useCollectionStore } from "../../store/useCollectionStore";
import { FAVORITE_STATUS, STATUS_SELECTION_EXCLUDE } from "../../constants";

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

    // Получаем список доступных статусов
    const STATUSES = getStatusesForSection(category);

    const selectableStatuses = [
        { label: "Без статуса", value: null },
        ...STATUSES.filter(
            (s) => ![...STATUS_SELECTION_EXCLUDE, FAVORITE_STATUS].includes(s),
        ).map((s) => ({ label: s, value: s })),
    ];

    const handleSelect = (value) => {
        onSelect(value);
        onClose(); // BottomSheet сам запустит анимацию закрытия
    };

    const handleRemove = () => {
        onClose();
        // Задержка, чтобы удаление не "лагало" во время анимации закрытия
        setTimeout(() => {
            if (removeCard) removeCard();
        }, 300);
    };

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.contentCustom}
        >
            <Text style={styles.header}>Статус</Text>

            {selectableStatuses.map((option) => {
                const isActive =
                    currentStatus === option.value ||
                    (currentStatus == null && option.value == null);

                return (
                    <TouchableOpacity
                        key={option.label}
                        onPress={() => handleSelect(option.value)}
                        style={styles.option}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                isActive && styles.activeText,
                            ]}
                        >
                            {option.label}
                        </Text>
                        {isActive && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                );
            })}

            {!!removeCard && (
                <TouchableOpacity
                    onPress={handleRemove}
                    style={styles.removeBtn}
                >
                    <Text style={styles.removeText}>Удалить из коллекции</Text>
                </TouchableOpacity>
            )}
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    contentCustom: {
        backgroundColor: "#0B1534", // Твой специфичный цвет фона
        paddingHorizontal: 30,
        paddingTop: 5, // Немного отступа под индикатором (handle)
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    optionText: {
        color: "#fff",
        fontSize: 18,
    },
    activeText: {
        color: "#7D8AFF",
        fontWeight: "600",
    },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#7D8AFF",
    },
    removeBtn: {
        marginTop: 40,
        alignItems: "center",
        padding: 15,
        backgroundColor: "#FF4B4B",
        borderRadius: 20,
    },
    removeText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
