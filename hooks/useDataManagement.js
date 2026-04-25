import { useState, useCallback } from "react";
import { Keyboard } from "react-native";

const MASTER_KEY = process.env.EXPO_PUBLIC_MY_SUPER_PUPER_SECRET_KEY_WORD;

export const useDataManagement = (store) => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [isChanging, setIsChanging] = useState(false);
    const [modalConfig, setModalConfig] = useState({ visible: false });
    const [confirmInput, setConfirmInput] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    const closeModal = useCallback(() => {
        setModalConfig({
            visible: false,
            onConfirm: null,
            confirmText: "",
        });
        setConfirmInput("");
        setPendingAction(null);
    }, []);

    // Универсальный метод для простых уведомлений
    const showStatus = (title, message, type = "success") => {
        setModalConfig({
            visible: true,
            title,
            message,
            type,
            onConfirm: null,
            confirmText: "",
        });
    };

    const openConfirmModal = (action, title) => {
        if (!store.deletionPassword) {
            return showStatus(
                "Защищено",
                "Сначала установите кодовое слово в секции выше.",
                "warning",
            );
        }

        setPendingAction(() => action);
        setModalConfig({
            visible: true,
            title,
            message:
                "Введите кодовое слово для подтверждения операции. Это действие необратимо.",
            type: "error",
            confirmText: "Удалить всё",
            onConfirm: handleConfirmPress,
            needsPassword: true,
        });
    };

    const handleConfirmPress = () => {
        if (
            confirmInput === store.deletionPassword ||
            confirmInput === MASTER_KEY
        ) {
            if (pendingAction) pendingAction();
            showStatus("Успешно", "Данные были полностью стерты.");
        } else {
            showStatus("Ошибка", "Неверное кодовое слово", "error");
        }
    };

    const handlePasswordAction = () => {
        // Валидация
        if (newPass.length < 4)
            return showStatus("Ошибка", "Минимум 4 символа", "error");
        if (newPass !== confirmPass)
            return showStatus("Ошибка", "Пароли не совпадают", "error");

        if (!store.deletionPassword) {
            store.setDeletionPassword(newPass);
            showStatus("Успешно", "Мастер-пароль установлен");
        } else {
            const result = store.changePassword(oldPass, newPass);
            if (result.success) {
                showStatus("Успешно", "Пароль изменен");
            } else {
                return showStatus("Ошибка", result.error, "error");
            }
        }

        // Сброс состояния
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        setIsChanging(false);
        Keyboard.dismiss();
    };

    // Сброс пароля, только для тестов
    // const handleRemovePassword = () => {
    //     store.removePassword();
    //     showStatus("Успешно", "Пароль успешно удален");
    //     setIsChanging(false);
    // };

    return {
        state: {
            oldPass,
            newPass,
            confirmPass,
            isChanging,
            modalConfig,
            confirmInput,
        },
        actions: {
            setOldPass,
            setNewPass,
            setConfirmPass,
            setIsChanging,
            setConfirmInput,
            closeModal,
            openConfirmModal,
            handleConfirmPress,
            handlePasswordAction,
            // handleRemovePassword,
        },
    };
};
