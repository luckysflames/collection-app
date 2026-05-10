import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { FAVORITE_STATUS, SYSTEM_STATUSES } from "../../../..//constants/index";

const { width } = Dimensions.get("window");

export const CreateFolderModal = ({
    isVisible,
    onClose,
    onCreate,
    activeCategory,
}) => {
    const [name, setName] = useState("");

    const filteredCategory = SYSTEM_STATUSES.includes(activeCategory)
        ? FAVORITE_STATUS
        : activeCategory;

    const handleCreate = () => {
        if (name.trim()) {
            onCreate(name);
            setName("");
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent
            statusBarTranslucent
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView
                        intensity={20}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                <View style={styles.modalContent}>
                    {/* Иконка в круге, как в WarnModal */}
                    <View style={styles.iconCircle}>
                        <Ionicons
                            name="folder-open"
                            size={40}
                            color="#7D8AFF"
                        />
                    </View>

                    <Text style={styles.title}>Новая папка</Text>

                    <Text style={styles.message}>
                        Будет создана в "{filteredCategory}"
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Название папки..."
                        placeholderTextColor="#666"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Отмена</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                !name.trim() && styles.disabledButton,
                            ]}
                            onPress={handleCreate}
                            disabled={!name.trim()}
                        >
                            <Text
                                style={[
                                    styles.buttonText,
                                    !name.trim() && styles.disabledButtonText,
                                ]}
                            >
                                Создать
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: "#0B1534", // Твой цвет фона
        borderRadius: 32, // Скругление как в WarnModal
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
        backgroundColor: "rgba(125, 138, 255, 0.15)",
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
        marginBottom: 24,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 18,
        padding: 16,
        color: "#FFF",
        fontSize: 16,
        width: "100%",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
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
    confirmButton: {
        backgroundColor: "#7D8AFF",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
    },
    cancelButton: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    disabledButton: {
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        shadowOpacity: 0,
    },
    disabledButtonText: {
        color: "rgba(255, 255, 255, 0.1)",
    },
});
