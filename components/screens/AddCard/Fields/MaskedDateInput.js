import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../../../../hooks/useTheme";

export default function MaskedDateInput({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    format = "dd.mm.yyyy",
    ...props
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [isFocused, setIsFocused] = useState(false);
    const value = form[fieldName] || "";

    const formatDisplayToISO = (displayDate) => {
        if (!displayDate) return "";
        if (displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return displayDate;
        }
        const parts = displayDate.split(".");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month}-${day}`;
        }
        return displayDate;
    };

    const formatISOToDisplay = (isoDate) => {
        if (!isoDate) return "";
        if (isoDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
            return isoDate;
        }
        const parts = isoDate.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}.${month}.${year}`;
        }
        return isoDate;
    };

    const maskInput = (text) => {
        const digits = text.replace(/\D/g, "");

        if (format === "dd.mm.yyyy") {
            if (digits.length <= 2) {
                return digits;
            } else if (digits.length <= 4) {
                return `${digits.slice(0, 2)}.${digits.slice(2)}`;
            } else if (digits.length <= 8) {
                return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
            }
            return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
        }

        return text;
    };

    const handleChangeText = (text) => {
        const masked = maskInput(text);
        const iso = formatDisplayToISO(masked);
        updateField(fieldName, iso);
    };

    const displayValue = formatISOToDisplay(value);

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    isFocused || displayValue ? styles.labelActive : styles.labelInactive,
                ]}
            >
                {label || placeholder}
            </Text>

            <TextInput
                style={[styles.input, isFocused && styles.inputFocused, props.style]}
                placeholder={isFocused ? "" : placeholder}
                placeholderTextColor={theme.textDark}
                value={displayValue}
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor={theme.accent}
                keyboardType="numeric"
                maxLength={10}
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
