import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { FAVORITE_STATUS, SYSTEM_STATUSES } from "../../../../constants";

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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Новая папка</Text>
                    <Text style={styles.modalSubtitle}>
                        Будет создана в "{filteredCategory}"
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Название папки..."
                        placeholderTextColor="#8E94A4"
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.createButton]}
                            onPress={handleCreate}
                        >
                            <Text style={styles.buttonText}>Создать</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        backgroundColor: "#1A2232",
        borderRadius: 25,
        padding: 25,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 5,
    },
    modalSubtitle: {
        fontSize: 14,
        color: "#8E94A4",
        marginBottom: 20,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        padding: 15,
        color: "#fff",
        fontSize: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 0.48,
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    createButton: {
        backgroundColor: "#7D8AFF",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
