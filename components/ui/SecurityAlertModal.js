import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { ShieldAlert } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

const { width } = Dimensions.get("window");

export const SecurityAlertModal = ({ visible, onCancel, onGoToSettings }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                </Pressable>

                <Pressable style={styles.modalContent}>
                    <View style={styles.iconCircle}>
                        <ShieldAlert size={40} color={theme.yellow} />
                    </View>

                    <Text style={styles.title}>Безопасность данных</Text>

                    <Text style={styles.message}>
                        У вас не установлен пароль для сброса данных. Рекомендуем установить его
                        сейчас, чтобы защитить вашу коллекцию.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Позже</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onGoToSettings}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Установить</Text>
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
            backgroundColor: theme.yellowMuted,
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
        buttonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
    });
