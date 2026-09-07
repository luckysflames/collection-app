import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PasswordInputs } from "./PasswordInputs";
import { PasswordHeader } from "./PasswordHeader";
import { useTheme } from "../../../../../hooks/useTheme";
import { ChevronRight, Trash2 } from "lucide-react-native";

export const PasswordCard = ({
    store,
    isChanging,
    setIsChanging,
    oldPass,
    setOldPass,
    newPass,
    setNewPass,
    confirmPass,
    setConfirmPass,
    handlePasswordAction,
    // handleRemovePassword,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const hasPassword = !!store.deletionPassword;

    return (
        <View>
            <Text style={styles.sectionTitle}>Безопасность</Text>
            <View style={styles.card}>
                <PasswordHeader hasPassword={hasPassword} />

                <Text style={styles.description}>
                    Используется для подтверждения операций, связанных с удалением данных.
                    Рекомендуется записать его в надежном месте.{"\n\n"}- Минимум 4 символа{"\n"}-
                    Интересная завязка
                    {"\n"}- Неожиданная концовка
                </Text>

                {!hasPassword || isChanging ? (
                    <PasswordInputs
                        hasPassword={hasPassword}
                        oldPass={oldPass}
                        setOldPass={setOldPass}
                        newPass={newPass}
                        setNewPass={setNewPass}
                        confirmPass={confirmPass}
                        setConfirmPass={setConfirmPass}
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
                            <Text style={styles.changeLink}>Изменить мастер-пароль</Text>
                            <ChevronRight size={18} color={theme.accent} />
                        </TouchableOpacity>

                        {/* Кнопка для сброса пароля, только для тестов */}
                        {/* <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.changePasswordButton, { marginTop: 10 }]}
                            onPress={handleRemovePassword}
                        >
                            <Text style={[styles.changeLink, { color: theme.red }]}>
                                Удалить пароль (тест)
                            </Text>
                            <Trash2 size={16} color={theme.red} />
                        </TouchableOpacity> */}
                    </View>
                )}
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sectionTitle: {
            color: theme.textDark,
            fontSize: 12,
            fontWeight: "700",
            textTransform: "uppercase",
            marginBottom: 12,
            marginLeft: 8,
            letterSpacing: 1.2,
        },
        card: {
            backgroundColor: theme.main,
            borderRadius: 24,
            padding: 20,
            marginBottom: 25,
        },
        description: {
            color: theme.textDark,
            fontSize: 13,
            lineHeight: 19,
            marginBottom: 20,
        },
        changePasswordButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.accentMuted,
            padding: 16,
            borderRadius: 16,
        },
        changeLink: {
            color: theme.accent,
            fontSize: 15,
            fontWeight: "600",
        },
        testButtonsRow: {
            flexDirection: "column",
        },
    });
