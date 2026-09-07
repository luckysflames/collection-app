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
import { useTheme } from "../../../../hooks/useTheme";

const { width } = Dimensions.get("window");

export default function SelectField({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    options = [],
    isMulti = false,
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [isOpen, setIsOpen] = useState(false);
    const value = form[fieldName];

    const getDisplayLabel = () => {
        if (isMulti) {
            if (Array.isArray(value) && value.length > 0) {
                return options
                    .filter((opt) => value.includes(opt.id))
                    .map((opt) => opt.label)
                    .join(", ");
            }
            return placeholder;
        }
        return options.find((opt) => String(opt.id) === String(value))?.label || placeholder;
    };

    const handleSelect = (id) => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            const nextValues = currentValues.includes(id)
                ? currentValues.filter((v) => v !== id)
                : [...currentValues, id];

            updateField(fieldName, nextValues);
        } else {
            updateField(fieldName, id);
            setIsOpen(false);
        }
    };

    const isSelected = (id) => {
        if (isMulti) {
            return Array.isArray(value) && value.includes(id);
        }
        return String(value) === String(id);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.label, value ? styles.labelActive : styles.labelInactive]}>
                {label || placeholder}
            </Text>

            <TouchableOpacity
                style={[styles.input, isOpen && styles.inputFocused]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[styles.inputText, !value && styles.placeholderText]}
                    numberOfLines={1}
                >
                    {getDisplayLabel()}
                </Text>
                <ChevronDown size={20} color={isOpen ? theme.accent : theme.textDark} />
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
                statusBarTranslucent
            >
                <View style={styles.overlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setIsOpen(false)}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{label || placeholder}</Text>

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
                                        String(value) === String(item.id) && styles.selectedOption,
                                    ]}
                                    onPress={() => handleSelect(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            isSelected(item.id) && styles.selectedOptionText,
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
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
            color: theme.text,
        },
        labelActive: {
            color: theme.accent,
        },
        input: {
            backgroundColor: theme.dark,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderWidth: 1,
            borderColor: theme.textDark,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        inputFocused: {
            borderColor: theme.accent,
        },
        inputText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "500",
            flex: 1,
        },
        placeholderText: {
            color: theme.textDark,
        },
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.overlay,
        },
        modalContent: {
            width: width * 0.85,
            maxHeight: "75%",
            backgroundColor: theme.main,
            borderRadius: 32,
            padding: 24,
        },
        modalTitle: {
            color: theme.text,
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
            borderWidth: 1,
            borderColor: theme.accent,
        },
        selectedOption: {
            backgroundColor: theme.accentMuted,
        },
        optionText: {
            color: theme.textDark,
            fontSize: 16,
            fontWeight: "500",
        },
        selectedOptionText: {
            color: theme.text,
            fontWeight: "700",
        },
        closeButton: {
            backgroundColor: theme.accent,
            width: "100%",
            height: 58,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
        },
        closeButtonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
    });
