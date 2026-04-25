import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const PasswordInputs = ({
    hasPassword,
    oldPass,
    setOldPass,
    newPass,
    setNewPass,
    confirmPass, // Добавь этот проп
    setConfirmPass, // Добавь этот проп
    isChanging,
    setIsChanging,
    handlePasswordAction,
}) => {
    const [secureEntry, setSecureEntry] = useState(true);

    const renderInput = (
        icon,
        placeholder,
        value,
        onChange,
        color = "#7D8AFF",
    ) => (
        <View style={styles.inputWrapper}>
            <Ionicons
                name={icon}
                size={18}
                color={color}
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#5E6272"
                value={value}
                onChangeText={onChange}
                secureTextEntry={secureEntry}
                autoCapitalize="none"
            />
            <TouchableOpacity
                onPress={() => setSecureEntry(!secureEntry)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Ionicons
                    name={secureEntry ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={secureEntry ? "#5E6272" : "#4E55D7"}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.inputGroup}>
            {hasPassword &&
                renderInput(
                    "key-outline",
                    "Старый пароль",
                    oldPass,
                    setOldPass,
                    "#4E55D7",
                )}

            {renderInput(
                "lock-closed-outline",
                hasPassword ? "Новый пароль" : "Придумайте пароль",
                newPass,
                setNewPass,
            )}

            {/* Поле подтверждения показываем только при создании или смене */}
            {renderInput(
                "checkmark-circle-outline",
                "Повторите пароль",
                confirmPass,
                setConfirmPass,
            )}

            <View style={styles.buttonRow}>
                {isChanging && (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                            setIsChanging(false);
                            setOldPass("");
                            setNewPass("");
                            setConfirmPass("");
                        }}
                    >
                        <Text style={styles.cancelButtonText}>Отмена</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.saveButton, { flex: isChanging ? 1.5 : 1 }]}
                    onPress={handlePasswordAction}
                >
                    <Text style={styles.buttonText}>
                        {hasPassword ? "Обновить" : "Сохранить"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(5, 11, 24, 0.5)",
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: "#FFF",
        paddingVertical: 14,
        fontSize: 15,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: "#4E55D7",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontWeight: "600",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 15,
    },
});
