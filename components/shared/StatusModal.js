import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";
import { Check, Trash2, Circle } from "lucide-react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { useCollectionStore } from "../../store/useCollectionStore";
import { FAVORITE_STATUS, STATUS_SELECTION_EXCLUDE } from "../../constants/index";

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

            <View style={styles.listContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {selectableStatuses.map((option) => {
                        const isActive =
                            currentStatus === option.value ||
                            (currentStatus == null && option.value == null);

                        return (
                            <TouchableOpacity
                                key={option.value ?? "no-status"}
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
                                        color={isActive ? "#7D8AFF" : "#8E94A4"}
                                        size={18}
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
                                    <Text style={styles.statusSubtext}>
                                        {isActive
                                            ? "Текущий статус"
                                            : "Нажмите, чтобы выбрать"}
                                    </Text>
                                </View>

                                <View style={styles.checkWrapper}>
                                    {isActive && (
                                        <Check
                                            color="#7D8AFF"
                                            size={22}
                                            strokeWidth={3}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                {!!removeCard && (
                    <TouchableOpacity
                        onPress={handleRemove}
                        style={styles.removeBtn}
                        activeOpacity={0.8}
                    >
                        <Trash2
                            color="#FF4B4B"
                            size={20}
                            style={{ marginRight: 12 }}
                        />
                        <Text style={styles.removeText}>
                            Удалить из коллекции
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 20,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    listContainer: {
        maxHeight: SCREEN_HEIGHT * 0.45,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginBottom: 8,
        backgroundColor: "rgba(255,255,255,0.02)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.02)",
    },
    statusItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.06)",
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    iconWrapperActive: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
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
    statusSubtext: {
        color: "#4E5564",
        fontSize: 12,
        marginTop: 2,
    },
    checkWrapper: {
        width: 24,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },
    footer: {
        marginTop: 15,
        gap: 10, // Расстояние между кнопками
    },
    removeBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backgroundColor: "rgba(255, 75, 75, 0.05)",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 75, 75, 0.1)",
    },
    removeText: {
        color: "#FF4B4B",
        fontSize: 16,
        fontWeight: "700",
    },
});
