import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { EditForm } from "./EditForm";
import { styles } from "./InfoBlock/InfoBlock.styles"; // Проверь путь!

export const EditSection = ({ form, setForm, type, onSave, onCancel }) => (
    <View style={{ width: "100%" }}>
        {/* Прокидываем type, чтобы форма знала, какие лейблы рисовать */}
        <EditForm form={form} setForm={setForm} type={type} />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Сохранить изменения</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
        </TouchableOpacity>
    </View>
);
