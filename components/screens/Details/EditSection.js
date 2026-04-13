import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { EditForm } from "./EditForm";

export const EditSection = ({ form, updateField, type, onSave, onCancel }) => (
    <View style={{ width: "100%" }}>
        <EditForm form={form} updateField={updateField} type={type} />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Сохранить изменения</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 15,
    },
    saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    cancelButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 14,
    },
});
