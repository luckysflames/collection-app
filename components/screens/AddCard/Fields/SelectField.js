import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { ChevronDown } from "lucide-react-native";

const { width } = Dimensions.get("window");

export default function SelectField({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    options = [],
}) {
    const [isOpen, setIsOpen] = useState(false);
    const value = form[fieldName];

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
                    style={[styles.inputText, !value && styles.placeholderText]}
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
                statusBarTranslucent
            >
                <View style={styles.overlay}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={() => setIsOpen(false)}
                    >
                        <BlurView
                            intensity={20}
                            tint="dark"
                            style={StyleSheet.absoluteFill}
                        />
                    </Pressable>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {label || placeholder}
                        </Text>

                        <FlatList
                            data={options}
                            keyExtractor={(item) => String(item.id)}
                            showsVerticalScrollIndicator={false}
                            style={styles.optionsList}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.option,
                                        String(value) === String(item.id) &&
                                            styles.selectedOption,
                                    ]}
                                    onPress={() => handleSelect(item.id)}
                                    activeOpacity={0.7}
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
                            activeOpacity={0.8}
                        >
                            <Text style={styles.closeButtonText}>Готово</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        letterSpacing: 1,
    },
    labelInactive: {
        color: "#4E5566",
        opacity: 0.5,
    },
    labelActive: {
        color: "#7D8AFF",
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 14,
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
        fontWeight: "500",
        flex: 1,
    },
    placeholderText: {
        color: "#4E5566",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    modalContent: {
        width: width * 0.85,
        maxHeight: "75%",
        backgroundColor: "#0B1534",
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 25,
    },
    modalTitle: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    optionsList: {
        width: "100%",
        marginBottom: 20,
    },
    option: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 8,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderWidth: 1,
        borderColor: "transparent",
    },
    selectedOption: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    optionText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "500",
    },
    selectedOptionText: {
        color: "#7D8AFF",
        fontWeight: "700",
    },
    closeButton: {
        backgroundColor: "#7D8AFF",
        width: "100%",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    closeButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
