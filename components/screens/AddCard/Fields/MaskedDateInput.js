import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function MaskedDateInput({
    label,
    placeholder,
    form,
    updateField,
    fieldName,
    format = "dd.mm.yyyy", // дд.мм.гггг по умолчанию
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);
    const value = form[fieldName] || "";

    // Преобразует дд.мм.гггг в гггг-мм-дд
    const formatDisplayToISO = (displayDate) => {
        if (!displayDate) return "";
        // Если это уже ISO формат (гггг-мм-дд), возвращаем как есть
        if (displayDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return displayDate;
        }
        // Преобразуем дд.мм.гггг в гггг-мм-дд
        const parts = displayDate.split(".");
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month}-${day}`;
        }
        return displayDate;
    };

    // Преобразует гггг-мм-дд в дд.мм.гггг для отображения
    const formatISOToDisplay = (isoDate) => {
        if (!isoDate) return "";
        // Если это формат дд.мм.гггг, возвращаем как есть
        if (isoDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
            return isoDate;
        }
        // Преобразуем гггг-мм-дд в дд.мм.гггг
        const parts = isoDate.split("-");
        if (parts.length === 3) {
            const [year, month, day] = parts;
            return `${day}.${month}.${year}`;
        }
        return isoDate;
    };

    // Маскирует ввод: форматирует в реальном времени
    const maskInput = (text) => {
        // Убираем все, что не цифры
        const digits = text.replace(/\D/g, "");

        if (format === "dd.mm.yyyy") {
            // дд.мм.гггг
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
        // Сохраняем в ISO формате (гггг-мм-дд)
        const iso = formatDisplayToISO(masked);
        updateField(fieldName, iso);
    };

    // Отображаем значение в формате дд.мм.гггг
    const displayValue = formatISOToDisplay(value);

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    isFocused || displayValue
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
                value={displayValue}
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                selectionColor="#7D8AFF"
                keyboardType="numeric"
                maxLength={10} // дд.мм.гггг = 10 символов
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
