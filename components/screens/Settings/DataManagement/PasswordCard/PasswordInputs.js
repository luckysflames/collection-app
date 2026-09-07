import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Eye, EyeOff, KeyRound, Lock, CheckCircle2 } from "lucide-react-native";
import { useTheme } from "../../../../../hooks/useTheme";

export const PasswordInputs = ({
    hasPassword,
    oldPass,
    setOldPass,
    newPass,
    setNewPass,
    confirmPass,
    setConfirmPass,
    isChanging,
    setIsChanging,
    handlePasswordAction,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [secureEntries, setSecureEntries] = useState({
        old: true,
        new: true,
        confirm: true,
    });

    const toggleSecure = (key) => {
        setSecureEntries((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const renderInput = (key, IconComponent, placeholder, value, onChange) => {
        const isSecure = secureEntries[key];

        return (
            <View style={styles.inputWrapper}>
                <IconComponent size={18} color={theme.accent} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={theme.textDark}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={isSecure}
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    onPress={() => toggleSecure(key)}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    {isSecure ? (
                        <EyeOff size={22} color={theme.textDark} />
                    ) : (
                        <Eye size={22} color={theme.accent} />
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.inputGroup}>
            {hasPassword && renderInput("old", KeyRound, "Старый пароль", oldPass, setOldPass)}

            {renderInput(
                "new",
                Lock,
                hasPassword ? "Новый пароль" : "Придумайте пароль",
                newPass,
                setNewPass,
            )}

            {renderInput("confirm", CheckCircle2, "Повторите пароль", confirmPass, setConfirmPass)}

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
                    <Text style={styles.buttonText}>{hasPassword ? "Обновить" : "Сохранить"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        inputGroup: {
            width: "100%",
        },
        inputWrapper: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.dark,
            borderRadius: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.accentMuted,
            paddingHorizontal: 15,
        },
        inputIcon: {
            marginRight: 10,
        },
        input: {
            flex: 1,
            color: theme.text,
            paddingVertical: 14,
            fontSize: 15,
        },
        buttonRow: {
            flexDirection: "row",
            gap: 12,
            marginTop: 8,
        },
        saveButton: {
            backgroundColor: theme.accent,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
        },
        cancelButton: {
            flex: 1,
            backgroundColor: theme.redMuted,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: theme.red,
        },
        cancelButtonText: {
            color: theme.red,
            fontWeight: "600",
        },
        buttonText: {
            color: theme.text,
            fontWeight: "700",
            fontSize: 15,
        },
    });
