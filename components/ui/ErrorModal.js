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

const { width } = Dimensions.get("window");

export const ErrorModal = ({ visible, title, message, onClose }) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                {/* Эффект размытия заднего фона, как в твоем TabBar overlay */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView
                        intensity={15}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                <View style={styles.modalContent}>
                    <View style={styles.iconCircle}>
                        <Text style={{ fontSize: 30 }}>⚠️</Text>
                    </View>

                    <Text style={styles.title}>{title || "Упс!"}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Понятно</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)", // Такой же прозрачности, как в TabBar
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: "#0B1534", // Твой основной цвет из TabBar
        borderRadius: 30, // Скругление как у mainContainer
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)", // Тонкая обводка в цвете акцента
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    iconCircle: {
        width: 70,
        height: 70,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "#FFF", // Белый, как активный текст в табах
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
    },
    message: {
        color: "#8E94A4", // Твой стандартный неактивный цвет
        fontSize: 16,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 25,
    },
    button: {
        backgroundColor: "#7D8AFF", // Твой основной фиолетово-синий акцент
        width: "100%",
        height: 55,
        borderRadius: 20, // Как у activeIconContainer
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "600",
    },
});
