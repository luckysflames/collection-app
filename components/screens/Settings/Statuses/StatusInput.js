import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const StatusInput = ({ value, onChange, onAdd }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.inputSection}>
            <TextInput
                style={styles.input}
                placeholder="Новый статус..."
                placeholderTextColor={theme.textDark}
                value={value}
                onChangeText={onChange}
                maxLength={20}
            />
            <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.8}>
                <Plus color={theme.text} size={24} />
            </TouchableOpacity>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        inputSection: {
            flexDirection: "row",
            gap: 12,
        },
        input: {
            flex: 1,
            borderRadius: 15,
            paddingHorizontal: 18,
            height: 54,
            color: theme.text,
            fontSize: 16,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        addButton: {
            backgroundColor: theme.accent,
            width: 54,
            height: 54,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
    });
