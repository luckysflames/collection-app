import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const EditForm = ({ form, setForm }) => {
    const updateField = (field, value) => setForm({ ...form, [field]: value });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Название</Text>
            <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => updateField("title", v)}
                placeholderTextColor="#444"
            />
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Год</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={form.year}
                        onChangeText={(v) => updateField("year", v)}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.label}>Мин.</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={form.filmLength}
                        onChangeText={(v) => updateField("filmLength", v)}
                    />
                </View>
            </View>
            <Text style={styles.label}>Жанры (через запятую)</Text>
            <TextInput
                style={styles.input}
                value={form.genres}
                onChangeText={(v) => updateField("genres", v)}
            />
            <Text style={styles.label}>Описание</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={form.description}
                onChangeText={(v) => updateField("description", v)}
                multiline
                numberOfLines={4}
                placeholder="Расскажите об этом фильме..."
                placeholderTextColor="#444"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: "100%", paddingBottom: 10 },
    label: {
        color: "#8E94A4",
        fontSize: 12,
        marginBottom: 5,
        marginTop: 10,
        textTransform: "uppercase",
    },
    input: {
        backgroundColor: "#1E293B",
        borderRadius: 10,
        color: "#fff",
        padding: 12,
        fontSize: 16,
    },
    row: { flexDirection: "row" },
    textArea: { minHeight: 100, textAlignVertical: "top" },
});
