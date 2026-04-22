import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PasswordInputs } from "./PasswordInputs";
import { PasswordHeader } from "./PasswordHeader";

export const PasswordCard = ({
    store,
    isChanging,
    setIsChanging,
    oldPass,
    setOldPass,
    newPass,
    setNewPass,
    handlePasswordAction,
    handleRemovePassword,
}) => {
    const hasPassword = !!store.deletionPassword;

    return (
        <View>
            <Text style={styles.sectionTitle}>Безопасность</Text>
            <View style={styles.card}>
                <PasswordHeader hasPassword={hasPassword} />

                <Text style={styles.description}>
                    Используется для подтверждения операций, связанных с
                    удалением данных. Рекомендуется записать его в надежном
                    месте.{"\n\n"}- Минимум 4 символа{"\n"}- Интересная завязка
                    {"\n"}- Неожиданная концовка
                </Text>

                {!hasPassword || isChanging ? (
                    <PasswordInputs
                        hasPassword={hasPassword}
                        oldPass={oldPass}
                        setOldPass={setOldPass}
                        newPass={newPass}
                        setNewPass={setNewPass}
                        isChanging={isChanging}
                        setIsChanging={setIsChanging}
                        handlePasswordAction={handlePasswordAction}
                    />
                ) : (
                    <View style={styles.testButtonsRow}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.changePasswordButton}
                            onPress={() => setIsChanging(true)}
                        >
                            <Text style={styles.changeLink}>
                                Изменить мастер-пароль
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color="#7D8AFF"
                            />
                        </TouchableOpacity>
                        
                        {/* Кнопка для сброса пароля, только для тестов */}
                        {/* <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                                styles.changePasswordButton,
                                { marginTop: 10 },
                            ]}
                            onPress={handleRemovePassword}
                        >
                            <Text
                                style={[
                                    styles.changeLink,
                                    { color: "#FF6B6B" },
                                ]}
                            >
                                Удалить пароль (тест)
                            </Text>
                            <Ionicons
                                name="trash-outline"
                                size={16}
                                color="#FF6B6B"
                            />
                        </TouchableOpacity> */}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 12,
        marginLeft: 8,
        letterSpacing: 1.2,
    },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.12)",
        marginBottom: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    description: {
        // textAlign: "center",
        color: "#8E94A4",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 20,
    },
    changePasswordButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(78, 85, 215, 0.1)",
        padding: 16,
        borderRadius: 16,
    },
    changeLink: {
        color: "#7D8AFF",
        fontSize: 15,
        fontWeight: "600",
    },
    testButtonsRow: {
        flexDirection: "column",
        alignItems: "center",
    },
});
