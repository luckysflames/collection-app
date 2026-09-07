import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../../../hooks/useTheme";

export default function CommonField({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    ...props
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [isFocused, setIsFocused] = useState(false);
    const value = form[fieldName];

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    isFocused || value ? styles.labelActive : styles.labelInactive,
                ]}
            >
                {label || placeholder}
            </Text>

            <TextInput
                style={[styles.input, isFocused && styles.inputFocused, props.style]}
                placeholder={isFocused ? "" : placeholder}
                placeholderTextColor={theme.textDark}
                value={value}
                onChangeText={(text) => updateField(fieldName, text)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.accent}
                {...props}
            />
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
            letterSpacing: 0.5,
        },
        labelInactive: {
            color: theme.text,
        },
        labelActive: {
            color: theme.accent,
            opacity: 1,
        },
        input: {
            backgroundColor: theme.dark,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: theme.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: theme.textDark,
        },
        inputFocused: {
            borderColor: theme.accent,
        },
    });
