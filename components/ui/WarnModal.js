import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export const WarnModal = ({
    visible,
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Удалить",
    cancelText = "Отмена",
    confirmDisabled = false,
    type = "warning",
    children,
}) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return { name: "checkmark-circle", color: "#4ADE80" };
            case "warning":
                return { name: "alert-circle", color: "#FACC15" };
            case "error": // Явно добавил error
                return { name: "close-circle", color: "#FF6B6B" };
            default:
                return { name: "information-circle", color: "#7D8AFF" };
        }
    };

    const icon = getIcon();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose} // Важно для кнопки "Назад" на Android
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                {/* Используем BlurView только как фон. 
                   Pressable только на область ВНЕ контента. 
                */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView
                        intensity={20}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                {/* Важно: Оборачиваем контент в Pressable без onPress, 
                   чтобы нажатия внутри модалки не "пролетало" сквозь неё на фон.
                */}
                <Pressable style={styles.modalContent}>
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: `${icon.color}15` },
                        ]}
                    >
                        <Ionicons
                            name={icon.name}
                            size={40}
                            color={icon.color}
                        />
                    </View>

                    <Text style={styles.title}>
                        {title || (type === "error" ? "Ошибка" : "Внимание")}
                    </Text>

                    <Text style={styles.message}>{message}</Text>

                    {/* Слот для TextInput или другого контента */}
                    {children && (
                        <View style={styles.childrenContainer}>{children}</View>
                    )}

                    <View style={styles.buttonContainer}>
                        {onConfirm && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>
                                    {cancelText}
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                onConfirm
                                    ? styles.confirmButton
                                    : styles.singleButton,
                                type === "error" &&
                                    onConfirm &&
                                    styles.errorConfirmButton,
                                confirmDisabled && styles.disabledButton, // Стиль для блокировки
                            ]}
                            onPress={onConfirm || onClose}
                            activeOpacity={0.8}
                            disabled={confirmDisabled} // Блокируем нажатие
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    confirmDisabled &&
                                        styles.disabledButtonText, // Текст посветлее
                                ]}
                            >
                                {onConfirm ? confirmText : "Понятно"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)", // Чуть темнее для акцента на контенте
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: "#0B1534",
        borderRadius: 32,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 25,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    message: {
        color: "#8E94A4",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 5,
    },

    childrenContainer: { width: "100%", marginBottom: 20 },

    // КОНТЕЙНЕР ДЛЯ КНОПОК
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 12, // Расстояние между кнопками
    },
    button: {
        flex: 1, // Кнопки делят место поровну
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },

    // КНОПКА ПО УМОЛЧАНИЮ (ОДНА)
    singleButton: {
        backgroundColor: "#7D8AFF",
        width: "100%",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },

    // КНОПКА ОТМЕНЫ
    cancelButton: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },

    // КНОПКА ПОДТВЕРЖДЕНИЯ (В ПАРЕ)
    confirmButton: {
        backgroundColor: "#7D8AFF",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },

    // ЕСЛИ ТИП "ERROR" И НУЖНО ПОДТВЕРЖДЕНИЕ (например, Удалить)
    errorConfirmButton: {
        backgroundColor: "#FF6B6B",
        shadowColor: "#FF6B6B",
    },

    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },

    disabledButton: {
        backgroundColor: "rgba(125, 138, 255, 0.05)", // Тусклый цвет
        shadowOpacity: 0,
        elevation: 0,
    },
    disabledButtonText: {
        color: "rgba(255, 255, 255, 0.1)",
    },
});
