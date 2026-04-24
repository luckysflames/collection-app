import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CommonField from "../../AddCard/Fields/CommonField";
import { Check, List, Trash2 } from "lucide-react-native";

export const FolderEditForm = ({
    form,
    disableReorder,
    updateField,
    onDelete,
    isReordering,
    onToggleReorder,
}) => (
    <View style={styles.container}>
        <CommonField
            label="Название"
            placeholder="Введите название папки"
            form={form}
            updateField={updateField}
            fieldName="title"
        />

        <CommonField
            label="Описание"
            placeholder="О чем эта папка?"
            form={form}
            updateField={updateField}
            fieldName="description"
            multiline
        />

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Trash2 size={20} color="#FF4F4F" />
            <Text style={styles.deleteButtonText}>Удалить папку</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[
                styles.reorderBtn,
                isReordering && styles.reorderBtnActive,
                disableReorder && { opacity: 0.3 },
            ]}
            onPress={onToggleReorder}
            disabled={disableReorder}
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
    container: { width: "100%", paddingHorizontal: 20, paddingTop: 20 },
    // Старые стили инпутов удалены — они теперь внутри CommonField
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8, // Немного уменьшил, так как у CommonField есть свой marginBottom
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
