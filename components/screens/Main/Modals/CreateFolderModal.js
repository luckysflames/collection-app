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
import { FAVORITE_STATUS, SYSTEM_STATUSES } from "../../../..//constants/index";
import { useTheme } from "../../../../hooks/useTheme";
import { FolderOpen } from "lucide-react-native";

const { width } = Dimensions.get("window");

export const CreateFolderModal = ({ isVisible, onClose, onCreate, activeCategory }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

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
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                </Pressable>

                <View style={styles.modalContent}>
                    <View style={styles.iconCircle}>
                        <FolderOpen size={40} color={theme.accent} />
                    </View>

                    <Text style={styles.title}>Новая папка</Text>

                    <Text style={styles.message}>Будет создана в "{filteredCategory}"</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Название папки..."
                        placeholderTextColor={theme.textDark}
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
            marginBottom: 150,
            alignItems: "center",
        },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.accentMuted,
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
            marginBottom: 24,
        },
        input: {
            backgroundColor: theme.dark,
            borderRadius: 18,
            padding: 16,
            color: theme.text,
            fontSize: 16,
            width: "100%",
            marginBottom: 24,
            borderWidth: 1,
            borderColor: theme.accentMuted,
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
            backgroundColor: theme.accent,
        },
        cancelButton: {
            backgroundColor: theme.redMuted,
            borderWidth: 1,
            borderColor: theme.red,
        },
        buttonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
        cancelButtonText: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "600",
        },
        disabledButton: {
            backgroundColor: theme.accentMuted,
            shadowOpacity: 0,
        },
        disabledButtonText: {
            color: theme.textDark,
        },
    });
