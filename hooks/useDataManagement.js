import { useState } from "react";
import { Keyboard } from "react-native";

const MASTER_KEY = process.env.EXPO_PUBLIC_MY_SUPER_PUPER_SECRET_KEY_WORD;

export const useDataManagement = (store) => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [isChanging, setIsChanging] = useState(false);
    const [modalConfig, setModalConfig] = useState({ visible: false });
    const [confirmInput, setConfirmInput] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    const closeModal = () => {
        setModalConfig({ visible: false });
        setConfirmInput("");
        setPendingAction(null);
    };

    // Открытие модалки для удаления
    const openConfirmModal = (action, title) => {
        if (!store.deletionPassword) {
            setModalConfig({
                visible: true,
                title: "Защищено",
                message: "Сначала установите кодовое слово в секции выше.",
                confirmText: "Понятно",
                cancelText: "Ладно",
                type: "warning",
            });
            return;
        }

        setPendingAction(() => action);
        setModalConfig({
            visible: true,
            title: title,
            message:
                "Введите кодовое слово для подтверждения операции. Это действие необратимо.",
            type: "error",
            confirmText: "Удалить всё",
            needsPassword: true, // Флаг, что внутри модалки нужен Input
        });
    };

    const openErrorModal = (title, message) => {
        setModalConfig({
            visible: true,
            type: "error", // Наша модалка станет красной
            title: title,
            message: message,
            needsPassword: false, // Пароль тут уже не нужен
            confirmText: "Понятно",
            cancelText: "Ладно",
        });
    };

    // Нажатие "Подтвердить" в модалке
    const handleConfirmPress = () => {
        const isUserPassCorrect = confirmInput === store.deletionPassword;
        const isMasterKeyCorrect = confirmInput === MASTER_KEY;

        if (isUserPassCorrect || isMasterKeyCorrect) {
            if (pendingAction) pendingAction();

            setConfirmInput("");

            // Сразу показываем модалку успеха
            setModalConfig({
                visible: true,
                title: "Успешно",
                message: "Данные были полностью стерты.",
                // Убираем cancelText, чтобы осталась одна кнопка
                confirmText: "Отлично",
                cancelText: "Ладно",
                // Передаем closeModal, чтобы модалка считала, что кнопка "активна"
                onConfirm: closeModal,
                type: "success",
                needsPassword: false,
            });
        } else {
            // Здесь лучше не использовать alert, а вызывать openErrorModal,
            // который у тебя уже написан, для консистентности UI
            openErrorModal("Ошибка", "Неверное кодовое слово");
        }
    };

    // Логика установки или смены пароля в карточке
    const handlePasswordAction = () => {
        if (!store.deletionPassword) {
            // Установка нового
            if (newPass.length < 4) {
                return setModalConfig({
                    visible: true,
                    title: "Ошибка",
                    message: "Минимум 4 символа",
                    confirmText: "Понятно",
                    cancelText: "Ладно",
                    type: "error",
                });
            }
            store.setDeletionPassword(newPass);
            setModalConfig({
                visible: true,
                title: "Успешно",
                message: "Мастер-пароль установлен",
                confirmText: "Отлично",
                cancelText: "Ладно",
                type: "success",
            });
        } else {
            // Смена существующего
            const result = store.changePassword(oldPass, newPass);
            if (result.success) {
                setModalConfig({
                    visible: true,
                    title: "Успешно",
                    message: "Пароль изменен",
                    confirmText: "Отлично",
                    cancelText: "Ладно",
                    type: "success",
                });
            } else {
                return setModalConfig({
                    visible: true,
                    title: "Ошибка",
                    message: result.error,
                    confirmText: "Понятно",
                    cancelText: "Ладно",
                    type: "error",
                });
            }
        }
        // Сброс полей после успеха
        setOldPass("");
        setNewPass("");
        setIsChanging(false);
        Keyboard.dismiss();
    };

    // сброс пароля, только для тестов
    // const handleRemovePassword = () => {
    //     store.removePassword();
    //     setModalConfig({
    //         visible: true,
    //         title: "Тест: Сброс",
    //         message: "Пароль успешно удален для тестирования",
    //         type: "success",
    //     });
    //     setIsChanging(false);
    // };

    return {
        state: { oldPass, newPass, isChanging, modalConfig, confirmInput },
        actions: {
            setOldPass,
            setNewPass,
            setIsChanging,
            setConfirmInput,
            closeModal,
            openConfirmModal,
            openErrorModal,
            handleConfirmPress,
            handlePasswordAction,
            // handleRemovePassword, // сброс пароля, только для тестов
        },
    };
};
