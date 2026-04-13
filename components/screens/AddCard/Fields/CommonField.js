import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Animated } from "react-native";

export default function CommonField({
    label, // Добавляем обязательный пропс label
    placeholder,
    form,
    updateField,
    fieldName,
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const value = form[fieldName];

    return (
        <View style={styles.container}>
            {/* Метка поля (Label) */}
            <Text
                style={[
                    styles.label,
                    isFocused || value
                        ? styles.labelActive
                        : styles.labelInactive,
                ]}
            >
                {label || placeholder}
            </Text>

            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    props.style,
                ]}
                placeholder={isFocused ? "" : placeholder}
                placeholderTextColor="#4E5566"
                value={value}
                onChangeText={(text) => updateField(fieldName, text)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor="#7D8AFF"
                {...props}
            />
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
        color: "#fff",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    inputFocused: {
        borderColor: "#7D8AFF",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
    },
});
