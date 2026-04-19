import React from "react";
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
    isChanging,
    setIsChanging,
    handlePasswordAction,
}) => (
    <View style={styles.inputGroup}>
        {hasPassword && (
            <View style={styles.inputWrapper}>
                <Ionicons
                    name="key-outline"
                    size={18}
                    color="#4E55D7"
                    style={styles.inputIcon}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Старый пароль"
                    placeholderTextColor="#5E6272"
                    value={oldPass}
                    onChangeText={setOldPass}
                    secureTextEntry
                    autoCapitalize="none"
                />
            </View>
        )}
        <View style={styles.inputWrapper}>
            <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#7D8AFF"
                style={styles.inputIcon}
            />
            <TextInput
                style={styles.input}
                placeholder={hasPassword ? "Новый пароль" : "Придумайте пароль"}
                placeholderTextColor="#5E6272"
                value={newPass}
                onChangeText={setNewPass}
                secureTextEntry
                autoCapitalize="none"
            />
        </View>

        <View style={styles.buttonRow}>
            {isChanging && (
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                        setIsChanging(false);
                        setOldPass("");
                        setNewPass("");
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
