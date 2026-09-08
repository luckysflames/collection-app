import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from "react-native";
import { Mic, Check } from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { useTheme } from "../../../../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const StudioModal = ({ visible, onClose, studios = [], selectedStudio, onSelectStudio }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    // Добавляем пункт для сброса озвучки/субтитров
    const options = [
        { label: "Не выбрано", value: null },
        ...studios.map((studio) => ({ label: studio, value: studio })),
    ];

    const handleSelect = (value) => {
        onSelectStudio(value);
        onClose();
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
            <Text style={styles.header}>Озвучка / Субтитры</Text>

            <View style={styles.listContainer}>
                {studios.length === 0 ? (
                    <Text style={styles.emptyText}>Информация о вариантах озвучки отсутствует</Text>
                ) : (
                    <FlatList
                        data={options}
                        keyExtractor={(item, index) => `${item.value}-${index}`}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        renderItem={({ item }) => {
                            const isActive =
                                selectedStudio === item.value ||
                                (selectedStudio == null && item.value == null);

                            return (
                                <TouchableOpacity
                                    onPress={() => handleSelect(item.value)}
                                    style={[styles.studioItem, isActive && styles.studioItemActive]}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.iconWrapper,
                                            isActive && styles.iconWrapperActive,
                                        ]}
                                    >
                                        <Mic
                                            color={isActive ? theme.text : theme.textDark}
                                            size={20}
                                        />
                                    </View>

                                    <View style={styles.studioInfo}>
                                        <Text
                                            style={[
                                                styles.studioText,
                                                isActive && styles.studioTextActive,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </View>

                                    <View style={styles.checkWrapper}>
                                        {isActive && (
                                            <Check color={theme.accent} size={20} strokeWidth={3} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                    />
                )}
            </View>
        </BottomSheet>
    );
};

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
            paddingBottom: 20,
        },
        emptyText: {
            color: theme.textDark,
            textAlign: "center",
            marginVertical: 20,
            fontSize: 15,
        },
        studioItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 18,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        studioItemActive: {
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
        studioInfo: {
            flex: 1,
        },
        studioText: {
            color: theme.textDark,
            fontSize: 16,
            fontWeight: "600",
        },
        studioTextActive: {
            color: theme.text,
        },
        checkWrapper: {
            width: 24,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
        },
    });
