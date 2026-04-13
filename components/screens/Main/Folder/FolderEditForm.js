import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Check, List, Trash2 } from "lucide-react-native";

const EditInput = ({ label, value, onChange, placeholder, multiline }) => (
    <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={multiline ? styles.descriptionInput : styles.titleInput}
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor="#4E5565"
            selectionColor="#7D8AFF"
            multiline={multiline}
        />
    </View>
);

export const FolderEditForm = ({
    form,
    updateField,
    onDelete,
    isReordering,
    onToggleReorder,
}) => (
    <View style={styles.container}>
        <EditInput
            label="Название"
            value={form.title}
            onChange={(v) => updateField("title", v)}
        />
        <View style={{ height: 16 }} />
        <EditInput
            label="Описание"
            value={form.description}
            onChange={(v) => updateField("description", v)}
            multiline
        />

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={20} color="#FF4F4F" />
            <Text style={styles.deleteButtonText}>Удалить папку</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.reorderBtn, isReordering && styles.reorderBtnActive]}
            onPress={onToggleReorder}
        >
            {isReordering ? (
                <Check size={20} color="#fff" />
            ) : (
                <List size={20} color="#7D8AFF" />
            )}
            <Text
                style={[styles.reorderText, isReordering && { color: "#fff" }]}
            >
                {isReordering
                    ? "Применить порядок"
                    : "Изменить порядок карточек"}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 20 },
    inputWrapper: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    inputLabel: {
        fontSize: 10,
        color: "#7D8AFF",
        fontWeight: "700",
        marginBottom: 4,
    },
    titleInput: { fontSize: 18, fontWeight: "700", color: "#fff" },
    descriptionInput: {
        fontSize: 14,
        color: "#D1D5DB",
        minHeight: 40,
        textAlignVertical: "top",
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255, 79, 79, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 79, 79, 0.2)",
    },
    deleteButtonText: { color: "#FF4F4F", fontWeight: "700", marginLeft: 8 },
    reorderBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    reorderBtnActive: { backgroundColor: "#7D8AFF" },
    reorderText: { color: "#7D8AFF", fontWeight: "600", marginLeft: 8 },
});
