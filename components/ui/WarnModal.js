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
import { CheckCircle2, AlertCircle, XCircle, Info } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

export const WarnModal = ({
    visible,
    title,
    message,
    onClose,
    onConfirm,
    confirmText,
    cancelText = "Отмена",
    confirmDisabled = false,
    type = "warning",
    children,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const getIcon = () => {
        switch (type) {
            case "success":
                return {
                    IconComponent: CheckCircle2,
                    color: theme.accent,
                    bgColor: theme.accentMuted,
                };
            case "warning":
                return {
                    IconComponent: AlertCircle,
                    color: theme.yellow,
                    bgColor: theme.yellowMuted,
                };
            case "error":
                return {
                    IconComponent: XCircle,
                    color: theme.red,
                    bgColor: theme.redMuted,
                };
            default:
                return {
                    IconComponent: Info,
                    color: theme.accent,
                    bgColor: theme.accentMuted,
                };
        }
    };

    const icon = getIcon();
    const IconComponent = icon.IconComponent;

    const hasConfirmAction = typeof onConfirm === "function" && !!onConfirm;
    const finalConfirmText = !hasConfirmAction
        ? "Понятно"
        : confirmText || (type === "error" ? "Удалить" : "Ок");

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                </Pressable>

                <Pressable style={styles.modalContent}>
                    <View style={[styles.iconCircle, { backgroundColor: icon.bgColor }]}>
                        <IconComponent size={40} color={icon.color} />
                    </View>

                    <Text style={styles.title}>
                        {title || (type === "error" ? "Ошибка" : "Внимание")}
                    </Text>

                    <Text style={styles.message}>{message}</Text>

                    {children && <View style={styles.childrenContainer}>{children}</View>}

                    <View style={styles.buttonContainer}>
                        {hasConfirmAction && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.button,
                                !hasConfirmAction ? styles.singleButton : styles.confirmButton,
                                type === "error" && hasConfirmAction && styles.errorConfirmButton,
                                confirmDisabled && styles.disabledButton,
                            ]}
                            onPress={hasConfirmAction ? onConfirm : onClose}
                            disabled={confirmDisabled}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    confirmDisabled && styles.disabledButtonText,
                                ]}
                            >
                                {finalConfirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </View>
        </Modal>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.overlay,
        },
        modalContent: {
            width: width * 0.85,
            backgroundColor: theme.main,
            borderRadius: 32,
            padding: 24,
            alignItems: "center",
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
            color: theme.text,
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 12,
            textAlign: "center",
            letterSpacing: 0.5,
        },
        message: {
            color: theme.textDark,
            fontSize: 16,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 32,
            paddingHorizontal: 5,
        },
        childrenContainer: { width: "100%", marginBottom: 20 },
        buttonContainer: {
            flexDirection: "row",
            width: "100%",
            gap: 12,
        },
        button: {
            flex: 1,
            height: 58,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
        },
        singleButton: {
            backgroundColor: theme.accent,
            width: "100%",
        },
        cancelButton: {
            backgroundColor: theme.redMuted,
            borderWidth: 1,
            borderColor: theme.red,
        },
        cancelButtonText: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "600",
        },
        confirmButton: {
            backgroundColor: theme.accent,
        },
        errorConfirmButton: {
            backgroundColor: theme.red,
        },
        buttonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
        disabledButton: {
            backgroundColor: theme.accentMuted,
        },
        disabledButtonText: {
            color: theme.textDark,
        },
    });
