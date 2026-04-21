import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    FlatList,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

export default function SelectField({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    options = [], // Array of { id, label }
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const value = form[fieldName];

    // Найти текущий label по value
    // Преобразуем значение в строку для сравнения
    const currentLabel =
        options.find((opt) => String(opt.id) === String(value))?.label ||
        placeholder;

    const handleSelect = (id) => {
        updateField(fieldName, id);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    value ? styles.labelActive : styles.labelInactive,
                ]}
            >
                {label || placeholder}
            </Text>

            <TouchableOpacity
                style={[styles.input, isOpen && styles.inputFocused]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.inputText,
                        !value && styles.placeholderText,
                    ]}
                >
                    {currentLabel}
                </Text>
                <ChevronDown
                    size={20}
                    color={isOpen ? "#7D8AFF" : "rgba(255, 255, 255, 0.6)"}
                />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {label || placeholder}
                        </Text>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={options.length > 6}
                            showsVerticalScrollIndicator={true}
                            style={styles.optionsList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        String(value) === String(item.id) &&
                                            styles.selectedOption,
                                    ]}
                                    onPress={() => handleSelect(item.id)}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            String(value) === String(item.id) &&
                                                styles.selectedOptionText,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsOpen(false)}
                        >
                            <Text style={styles.closeButtonText}>Закрыть</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: "100%",
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
        marginLeft: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    labelInactive: {
        color: "#4E5566",
        opacity: 0.5,
    },
    labelActive: {
        color: "#7D8AFF",
        opacity: 1,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    inputFocused: {
        borderColor: "#7D8AFF",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
    },
    inputText: {
        color: "#fff",
        fontSize: 16,
        flex: 1,
    },
    placeholderText: {
        color: "#4E5566",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#1a1f2e",
        borderRadius: 16,
        width: "85%",
        maxHeight: "70%",
        paddingTop: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    modalTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        paddingHorizontal: 20,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    optionsList: {
        paddingHorizontal: 12,
        maxHeight: "80%",
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 12,
        marginBottom: 4,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    selectedOption: {
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        borderWidth: 1,
        borderColor: "#7D8AFF",
    },
    optionText: {
        color: "#8E94A4",
        fontSize: 14,
    },
    selectedOptionText: {
        color: "#7D8AFF",
        fontWeight: "600",
    },
    closeButton: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        marginHorizontal: 12,
        marginVertical: 12,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    closeButtonText: {
        color: "#7D8AFF",
        fontSize: 14,
        fontWeight: "600",
    },
});
