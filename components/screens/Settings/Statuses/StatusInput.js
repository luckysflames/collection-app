import { Plus } from "lucide-react-native";
import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export const StatusInput = ({ value, onChange, onAdd }) => (
    <View style={styles.inputSection}>
        <TextInput
            style={styles.input}
            placeholder="Новый статус..."
            placeholderTextColor="#4E5564"
            value={value}
            onChangeText={onChange}
            maxLength={20}
        />
        <TouchableOpacity
            style={styles.addButton}
            onPress={onAdd}
            activeOpacity={0.8}
        >
            <Plus color="#fff" size={24} />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    inputSection: {
        flexDirection: "row",
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        paddingHorizontal: 18,
        height: 54,
        color: "#fff",
        fontSize: 16,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    addButton: {
        backgroundColor: "#7D8AFF",
        width: 54,
        height: 54,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
});
