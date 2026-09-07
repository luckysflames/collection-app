import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Check, Trash2, Tag, Bookmark } from "lucide-react-native";
import { BottomSheet } from "../ui/BottomSheet";
import { useCollectionStore } from "../../store/useCollectionStore";
import { FAVORITE_STATUS, STATUS_SELECTION_EXCLUDE } from "../../constants/index";
import { useTheme } from "../../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function StatusModal({
    visible,
    category,
    onClose,
    onSelect,
    currentStatus,
    removeCard,
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const getStatusesForSection = useCollectionStore((state) => state.getStatusesForSection);

    const STATUSES = getStatusesForSection(category);

    const selectableStatuses = [
        { label: "Без статуса", value: null },
        ...STATUSES.filter((s) => ![...STATUS_SELECTION_EXCLUDE, FAVORITE_STATUS].includes(s)).map(
            (s) => ({ label: s, value: s }),
        ),
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
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
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
                                style={[styles.statusItem, isActive && styles.statusItemActive]}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        isActive && styles.iconWrapperActive,
                                    ]}
                                >
                                    {isActive ? (
                                        <Bookmark color={theme.text} fill={theme.text} size={20} />
                                    ) : (
                                        <Bookmark color={theme.textDark} size={20} />
                                    )}
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

                                <View style={styles.checkWrapper}>
                                    {isActive && (
                                        <Check color={theme.accent} size={20} strokeWidth={3} />
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
                        <Trash2 color={theme.red} size={20} style={{ marginRight: 12 }} />
                        <Text style={styles.removeText}>Удалить из коллекции</Text>
                    </TouchableOpacity>
                )}
            </View>
        </BottomSheet>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 20,
        },
        header: {
            color: theme.text,
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
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        statusItemActive: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        iconWrapper: {
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
        },
        iconWrapperActive: {
            backgroundColor: theme.accent,
        },
        statusInfo: {
            flex: 1,
        },
        statusText: {
            color: theme.textDark,
            fontSize: 16,
            fontWeight: "600",
        },
        statusTextActive: {
            color: theme.text,
        },
        checkWrapper: {
            width: 24,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
        },
        footer: {
            marginTop: 15,
            gap: 10,
        },
        removeBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            backgroundColor: theme.redMuted,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: theme.red,
        },
        removeText: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "700",
        },
    });
