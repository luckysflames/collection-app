import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useCollectionStore } from "../store/useCollectionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const STATUSES = ["Смотрю", "В планах", "Просмотрено", "Брошено", "Отложено"];
const SECTIONS = ["Фильмы", "Игры", "Аниме", "Книги"];

export default function AddCardScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [form, setForm] = useState({
        title: "",
        year: "",
        country: "",
        duration: "",
        genres: "",
        description: "", // 1. Добавили поле в стейт
        status: "Смотрю",
        section: "Фильмы",
        image: null,
    });

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 3],
            quality: 0.7,
        });
        if (!result.canceled) setForm({ ...form, image: result.assets[0].uri });
    };

    const handleSave = () => {
        if (!form.title) return Alert.alert("Упс!", "Название обязательно");

        const newCard = {
            id: Date.now().toString(),
            title: form.title,
            year: form.year,
            countries: [form.country],
            filmLength: form.duration,
            genres: form.genres
                .split(",")
                .map((g) => g.trim())
                .filter(Boolean),
            description: form.description, // 2. Передаем описание в объект
            image: form.image || "https://via.placeholder.com/300x450",
            appSection: form.section,
            status: form.status,
            userNotes: "",
            isCustom: true,
        };

        useCollectionStore.getState().addToCollection(newCard);
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#050B18" }}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    { paddingTop: insets.top },
                ]}
            >
                <Text style={styles.header}>Создать карточку</Text>

                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.imagePlaceholder}
                >
                    {form.image ? (
                        <Image
                            source={{ uri: form.image }}
                            style={styles.fullImage}
                        />
                    ) : (
                        <View style={styles.uploadIcon}>
                            <Ionicons
                                name="camera-outline"
                                size={32}
                                color="#7D8AFF"
                            />
                            <Text style={{ color: "#7D8AFF", marginTop: 5 }}>
                                Загрузить постер
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="Название"
                    placeholderTextColor="#4E5566"
                    value={form.title}
                    onChangeText={(t) => setForm({ ...form, title: t })}
                />

                <View style={styles.rowInputs}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Год"
                        keyboardType="numeric"
                        placeholderTextColor="#4E5566"
                        value={form.year}
                        onChangeText={(t) => setForm({ ...form, year: t })}
                    />
                    <TextInput
                        style={[styles.input, { flex: 2, marginLeft: 10 }]}
                        placeholder="Страна"
                        placeholderTextColor="#4E5566"
                        value={form.country}
                        onChangeText={(t) => setForm({ ...form, country: t })}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Жанры (через запятую)"
                    placeholderTextColor="#4E5566"
                    value={form.genres}
                    onChangeText={(t) => setForm({ ...form, genres: t })}
                />

                {/* 3. Добавили TextInput для описания */}
                <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Описание (сюжет, завязка...)"
                    placeholderTextColor="#4E5566"
                    multiline
                    numberOfLines={4}
                    value={form.description}
                    onChangeText={(t) => setForm({ ...form, description: t })}
                />

                <Text style={styles.label}>Категория</Text>
                <View style={styles.chipRow}>
                    {SECTIONS.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.chip,
                                form.section === s && styles.activeChip,
                            ]}
                            onPress={() => setForm({ ...form, section: s })}
                        >
                            <Text style={styles.chipText}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Статус</Text>
                <View style={styles.chipRow}>
                    {STATUSES.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={[
                                styles.miniChip,
                                form.status === s && styles.activeMiniChip,
                            ]}
                            onPress={() => setForm({ ...form, status: s })}
                        >
                            <Text style={styles.chipText}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Создать</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { padding: 20, paddingBottom: 100 },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 25,
    },
    imagePlaceholder: {
        width: 140,
        height: 200,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 20,
        alignSelf: "center",
        marginBottom: 25,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
        borderStyle: "dashed",
    },
    fullImage: { width: "100%", height: "100%" },
    uploadIcon: { alignItems: "center" },
    input: {
        backgroundColor: "#0F172A",
        borderRadius: 12,
        padding: 15,
        color: "#fff",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    // Стиль для многострочного ввода
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: "top", // Чтобы текст начинался сверху (Android)
    },
    rowInputs: { flexDirection: "row" },
    label: { color: "#8E94A4", marginBottom: 10, marginTop: 10, fontSize: 14 },
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "#0F172A",
    },
    activeChip: { backgroundColor: "#7D8AFF" },
    miniChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    activeMiniChip: { backgroundColor: "#7D8AFF" },
    chipText: { color: "#fff", fontSize: 13, fontWeight: "600" },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 18,
        borderRadius: 15,
        marginTop: 20,
    },
    saveButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});
