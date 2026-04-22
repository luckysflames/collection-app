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

const { width } = Dimensions.get("window");

export const SecurityAlertModal = ({ visible, onCancel, onGoToSettings }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                {/* Фон с блюром */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onCancel}>
                    <BlurView
                        intensity={20}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                {/* Контентная часть */}
                <Pressable style={styles.modalContent}>
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: "#FFD07415" },
                        ]}
                    >
                        <ShieldAlert size={40} color="#FFD074" />
                    </View>

                    <Text style={styles.title}>Безопасность данных</Text>

                    <Text style={styles.message}>
                        У вас не установлен пароль для сброса данных.
                        Рекомендуем установить его сейчас, чтобы защитить вашу
                        коллекцию.
                    </Text>

                    <View style={styles.buttonContainer}>
                        {/* Кнопка Позже */}
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Позже</Text>
                        </TouchableOpacity>

                        {/* Кнопка Установить */}
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

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
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
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    confirmButton: {
        backgroundColor: "#7D8AFF",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
