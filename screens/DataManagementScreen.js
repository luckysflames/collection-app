import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";

import { useCollectionStore } from "../store/useCollectionStore";
import { WarnModal } from "../components/ui/WarnModal";
import { StatusManagerHeader } from "../components/screens/Settings/Statuses/StatusManagerHeader";
import { DangerItem } from "../components/screens/Settings/DataManagement/DangerItem";
import { DangerZone } from "../components/screens/Settings/DataManagement/DangerZone";
import { PasswordCard } from "../components/screens/Settings/DataManagement/PasswordCard/PasswordCard";
import { useDataManagement } from "../hooks/useDataManagement";

const MASTER_KEY = process.env.EXPO_PUBLIC_MY_SUPER_PUPER_SECRET_KEY_WORD;

export const DataManagementScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const store = useCollectionStore();

    const { state, actions } = useDataManagement(store);

    return (
        <View
            style={[
                styles.container,
                {
                    marginBottom: insets.bottom,
                },
            ]}
        >
            <StatusManagerHeader
                onBack={() => navigation.goBack()}
                title="Сброс данных"
                insets={insets}
                showSave={false}
            />

            <KeyboardAwareScrollView
                style={styles.flex1}
                contentContainerStyle={styles.scrollContent}
                enableOnAndroid
            >
                <PasswordCard
                    store={store}
                    isChanging={state.isChanging}
                    setIsChanging={actions.setIsChanging}
                    oldPass={state.oldPass}
                    setOldPass={actions.setOldPass}
                    newPass={state.newPass}
                    setNewPass={actions.setNewPass}
                    setConfirmPass={actions.setConfirmPass}
                    handlePasswordAction={actions.handlePasswordAction}
                    handleRemovePassword={actions.handleRemovePassword}
                />

                <DangerZone openConfirmModal={actions.openConfirmModal} />
            </KeyboardAwareScrollView>

            <WarnModal
                {...state.modalConfig}
                onClose={actions.closeModal}
                // Блокируем, если нужен пароль и введено меньше 4 символов
                confirmDisabled={
                    state.modalConfig.needsPassword &&
                    state.confirmInput.length < 4
                }
                onConfirm={
                    state.modalConfig.onConfirm
                        ? () => state.modalConfig.onConfirm(state.confirmInput)
                        : null
                }
            >
                {state.modalConfig.needsPassword && (
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Введите мастер-пароль"
                        placeholderTextColor="#666"
                        secureTextEntry
                        autoFocus
                        value={state.confirmInput}
                        onChangeText={actions.setConfirmInput}
                    />
                )}
            </WarnModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    flex1: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    modalInput: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        color: "#FFF",
        padding: 16,
        width: "100%",
        borderWidth: 1,
        borderColor: "rgba(255,107,107,0.3)",
        textAlign: "center",
        fontSize: 18,
    },
});
