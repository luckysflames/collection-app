import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EditForm } from "./EditForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../hooks/useTheme";

export const EditSection = ({ form, updateField, type, onSave, onCancel }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();

    return (
        <View style={{ width: "100%" }}>
            <EditForm form={form} updateField={updateField} type={type} />

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Сохранить изменения</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.cancelButton, { marginBottom: insets.bottom }]}
                onPress={onCancel}
            >
                <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        saveButton: {
            alignItems: "center",
            padding: 15,
            marginTop: 15,
            borderRadius: 12,
            backgroundColor: theme.accent,
        },
        saveButtonText: { color: theme.text, fontSize: 16, fontWeight: "bold" },
        cancelButton: {
            alignItems: "center",
            padding: 15,
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: theme.red,
            backgroundColor: theme.redMuted,
        },
        cancelButtonText: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "bold",
        },
    });
