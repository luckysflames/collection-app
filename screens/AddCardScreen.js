import React, { useEffect } from "react";
import {
    Text,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMediaCategories } from "../hooks/useMediaCategories";

import MovieFields from "../components/AddCardScreen/Fields/MovieFields";
import AnimeFields from "../components/AddCardScreen/Fields/AnimeFields";
import BookFields from "../components/AddCardScreen/Fields/BookFields";
import GameFields from "../components/AddCardScreen/Fields/GameFields";
import CommonField from "../components/AddCardScreen/Fields/CommonField";
import ImageUploader from "../components/AddCardScreen/ImageUploader";
import SectionSelector from "../components/AddCardScreen/SectionSelector";
import StatusPicker from "../components/AddCardScreen/StatusPicker";
import { useAddCardForm } from "../hooks/useAddCardForm";
import { ErrorModal } from "../components/ErrorModal";

const SECTIONS = [
    { label: "Фильмы", value: "movie" },
    { label: "Игры", value: "game" },
    { label: "Аниме", value: "anime" },
    { label: "Книги", value: "book" },
];

export default function AddCardScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { form, updateField, handleSave, errorModal, closeError } =
        useAddCardForm(navigation);

    const { CATEGORIES } = useMediaCategories(
        form.type === "movie"
            ? "Фильмы"
            : form.type === "anime"
              ? "Аниме"
              : form.type === "game"
                ? "Игры"
                : "Книги",
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "position"}
            style={{ flex: 1, backgroundColor: "#050B18" }}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    {
                        paddingTop: insets.top - 20,
                        paddingBottom: insets.bottom + 100,
                    },
                ]}
            >
                <Text style={styles.header}>Создать карточку</Text>

                <ImageUploader
                    image={form.image}
                    onImagePick={(uri) => updateField("image", uri)}
                />

                <SectionSelector
                    sections={SECTIONS}
                    currentType={form.type}
                    onSelect={(type) => updateField("type", type)}
                />

                <Text style={styles.label}>Обязательные поля</Text>
                <CommonField
                    placeholder="Основное название"
                    form={form}
                    updateField={updateField}
                    fieldName="title"
                />

                <Text style={styles.label}>Необязательные поля</Text>
                {!(form.type === "anime") && (
                    <CommonField
                        placeholder="Дата выхода (полная или год)"
                        form={form}
                        updateField={updateField}
                        fieldName="year"
                    />
                )}

                {/* Рендерим поля в зависимости от типа */}
                {form.type === "movie" && (
                    <MovieFields form={form} updateField={updateField} />
                )}
                {form.type === "anime" && (
                    <AnimeFields form={form} updateField={updateField} />
                )}
                {form.type === "book" && (
                    <BookFields form={form} updateField={updateField} />
                )}
                {form.type === "game" && (
                    <GameFields form={form} updateField={updateField} />
                )}

                <CommonField
                    placeholder="Жанры (через запятую)"
                    form={form}
                    updateField={updateField}
                    fieldName="genres"
                />

                <CommonField
                    placeholder="Описание..."
                    form={form}
                    updateField={updateField}
                    fieldName="description"
                    multiline
                />

                <StatusPicker
                    categories={CATEGORIES}
                    currentStatus={form.status}
                    type={form.type}
                    onSelect={(status) => updateField("status", status)}
                />

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Создать</Text>
                </TouchableOpacity>

                <ErrorModal
                    visible={errorModal.visible}
                    title="Ошибка заполнения"
                    message={errorModal.message}
                    onClose={closeError}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingHorizontal: 20 },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: { color: "#8E94A4", fontSize: 14, marginBottom: 10, marginTop: 10 },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 15,
    },
    saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
