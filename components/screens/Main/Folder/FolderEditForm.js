import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CommonField from "../../AddCard/Fields/CommonField";
import { Check, List, Trash2 } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const FolderEditForm = ({
    form,
    disableReorder,
    updateField,
    onDelete,
    isReordering,
    onToggleReorder,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
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
                <Trash2 size={20} color={theme.red} />
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
                    <Check size={20} color={theme.text} />
                ) : (
                    <List size={20} color={theme.accent} />
                )}
                <Text style={[styles.reorderText, isReordering && { color: theme.text }]}>
                    {isReordering ? "Применить порядок" : "Изменить порядок карточек"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { width: "100%", paddingHorizontal: 20, paddingTop: 20 },
        deleteButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
            padding: 12,
            borderRadius: 12,
            backgroundColor: theme.redMuted,
            borderWidth: 1,
            borderColor: theme.red,
        },
        deleteButtonText: { color: theme.red, fontWeight: "700", marginLeft: 8 },
        reorderBtn: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 16,
            padding: 12,
            borderRadius: 12,
            backgroundColor: theme.accentMuted,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        reorderBtnActive: { backgroundColor: theme.accent },
        reorderText: { color: theme.accent, fontWeight: "600", marginLeft: 8 },
    });
