import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useCollectionStore } from "../store/useCollectionStore";
import { WarnModal } from "../components/ui/WarnModal";
import { StatusManagerHeader } from "../components/screens/Settings/Statuses/StatusManagerHeader";
import { DangerZone } from "../components/screens/Settings/DataManagement/DangerZone";
import { PasswordCard } from "../components/screens/Settings/DataManagement/PasswordCard/PasswordCard";
import { useDataManagement } from "../hooks/useDataManagement";
import { useTheme } from "../hooks/useTheme";

export const DataManagementScreen = ({ navigation }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const store = useCollectionStore();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    const { state, actions } = useDataManagement(store);

    return (
        <View style={styles.container}>
            <StatusManagerHeader
                onBack={() => navigation.goBack()}
                title="Сброс данных"
                insets={insets}
                showSave={false}
            />

            <KeyboardAwareScrollView
                style={styles.flex1}
                contentContainerStyle={styles.scrollContent}
                enableOnAndroid={true}
                showsVerticalScrollIndicator={false}
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

                <View
                    style={{
                        height: isCompactMenu ? insets.bottom + 90 : insets.bottom + 150,
                    }}
                />
            </KeyboardAwareScrollView>

            <WarnModal
                {...state.modalConfig}
                onClose={actions.closeModal}
                confirmDisabled={state.modalConfig.needsPassword && state.confirmInput.length < 4}
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
                        placeholderTextColor={theme.textDark}
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.dark },
        flex1: { flex: 1 },
        scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
        modalInput: {
            backgroundColor: theme.main,
            borderRadius: 14,
            color: theme.text,
            padding: 16,
            width: "100%",
            borderWidth: 1,
            borderColor: theme.red,
            textAlign: "center",
            fontSize: 18,
        },
    });
