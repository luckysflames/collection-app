import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { ChevronLeft, Check } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const StatusManagerHeader = ({
    onBack,
    onSave,
    isSaving = false,
    hasChanges = false,
    insets,
    title = "Настройки",
    showSave = true,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={[styles.header, { paddingTop: insets.top - 20 }]}>
            <TouchableOpacity onPress={onBack} style={styles.headerButton}>
                <ChevronLeft size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{title}</Text>

            {showSave ? (
                <TouchableOpacity
                    onPress={onSave}
                    disabled={!hasChanges || isSaving}
                    style={[
                        styles.headerButton,
                        !hasChanges && styles.saveButtonDisabled,
                        hasChanges && styles.saveButtonActive,
                    ]}
                >
                    {isSaving ? (
                        <ActivityIndicator size="small" color={theme.text} />
                    ) : (
                        <Check size={24} color={hasChanges ? theme.text : theme.textDark} />
                    )}
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingBottom: 15,
            backgroundColor: theme.dark,
        },
        headerButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        placeholder: {
            width: 45,
        },
        headerTitle: {
            color: theme.text,
            fontSize: 18,
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
        },
        saveButtonActive: {
            backgroundColor: theme.accent,
        },
        saveButtonDisabled: {
            opacity: 0.6,
        },
    });
