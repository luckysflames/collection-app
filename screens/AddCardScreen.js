import React, { useState } from "react";
import {
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, ChevronUp } from "lucide-react-native"; // Добавим иконки для наглядности

import MovieFields from "../components/screens/AddCard/Fields/MovieFields";
import AnimeFields from "../components/screens/AddCard/Fields/AnimeFields";
import BookFields from "../components/screens/AddCard/Fields/BookFields";
import GameFields from "../components/screens/AddCard/Fields/GameFields";
import CommonField from "../components/screens/AddCard/Fields/CommonField";
import ImageUploader from "../components/shared/ImageUploader";
import SectionSelector from "../components/screens/AddCard/SectionSelector";
import StatusPicker from "../components/screens/AddCard/StatusPicker";
import { useAddCardForm } from "../hooks/useAddCardForm";
import { useMediaCategories } from "../hooks/useMediaCategories";
import { ErrorModal } from "../components/ui/ErrorModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SECTIONS = [
    { label: "Фильмы", value: "movie" },
    { label: "Игры", value: "game" },
    { label: "Аниме", value: "anime" },
    { label: "Книги", value: "book" },
];

// Вспомогательный компонент для сворачивания
const CollapsibleHeader = ({ title, isOpen, onPress }) => (
    <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={styles.label}>{title}</Text>
        {isOpen ? (
            <ChevronUp size={20} color="#8E94A4" />
        ) : (
            <ChevronDown size={20} color="#8E94A4" />
        )}
    </TouchableOpacity>
);

export default function AddCardScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [isOptionalVisible, setIsOptionalVisible] = useState(false); // Состояние сворачивания

    const { form, updateField, handleSave, errorModal, closeError } =
        useAddCardForm(navigation);

    const { CATEGORIES } = useMediaCategories(
        SECTIONS.find((s) => s.value === form.type)?.label || "Фильмы",
    );

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#050B18" }}
            contentContainerStyle={[
                styles.scrollContainer,
                {
                    paddingTop: insets.top - 10,
                    paddingBottom: insets.bottom + 80,
                },
            ]}
            // Вот ваша амплитуда:
            extraScrollHeight={100}
            // Включает плавную прокрутку на Android:
            enableOnAndroid={true}
            // Позволяет прокручивать до конца, даже если клавиатура открыта:
            extraHeight={Platform.select({ android: 200 })}
        >
            <Text style={styles.header}>Создать карточку</Text>

            {/* Блок загрузки и выбора типа */}
            <View style={styles.section}>
                <ImageUploader
                    image={form.image}
                    onImagePick={(uri) => updateField("image", uri)}
                />
                <SectionSelector
                    sections={SECTIONS}
                    currentType={form.type}
                    onSelect={(type) => updateField("type", type)}
                />
            </View>

            {/* Обязательные поля */}
            <View style={styles.section}>
                <CommonField
                    label="Название (обязательно)"
                    placeholder="Звёздное дитя"
                    form={form}
                    updateField={updateField}
                    fieldName="title"
                />
                <StatusPicker
                    categories={CATEGORIES}
                    currentStatus={form.status}
                    type={form.type}
                    onSelect={(status) => updateField("status", status)}
                />
            </View>

            {/* Необязательные поля (Сворачиваемые) */}
            <View style={styles.section}>
                <CollapsibleHeader
                    title="Дополнительная информация"
                    isOpen={isOptionalVisible}
                    onPress={() => setIsOptionalVisible(!isOptionalVisible)}
                />

                {isOptionalVisible && (
                    <View style={styles.optionalContent}>
                        {form.type !== "anime" && (
                            <CommonField
                                label="Год выпуска"
                                placeholder="2026"
                                form={form}
                                updateField={updateField}
                                fieldName="year"
                                keyboardType="numeric"
                            />
                        )}

                        {form.type === "movie" && (
                            <MovieFields
                                form={form}
                                updateField={updateField}
                            />
                        )}
                        {form.type === "anime" && (
                            <AnimeFields
                                form={form}
                                updateField={updateField}
                            />
                        )}
                        {form.type === "book" && (
                            <BookFields form={form} updateField={updateField} />
                        )}
                        {form.type === "game" && (
                            <GameFields form={form} updateField={updateField} />
                        )}

                        <CommonField
                            label="Жанры"
                            placeholder="Драма, Сэйнэн, ..."
                            form={form}
                            updateField={updateField}
                            fieldName="genres"
                        />

                        <CommonField
                            label="Описание"
                            placeholder="Красная ковровая дорожка, яркие..."
                            form={form}
                            updateField={updateField}
                            fieldName="description"
                            multiline
                        />
                    </View>
                )}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Создать карточку</Text>
            </TouchableOpacity>

            <View style={{ height: insets.bottom + 100 }} />

            <ErrorModal
                visible={errorModal.visible}
                title="Ошибка заполнения"
                message={errorModal.message}
                onClose={closeError}
            />
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: { paddingHorizontal: 20, flexGrow: 1 },
    header: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 25,
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 20,
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(142, 148, 164, 0.2)",
        marginBottom: 15,
    },
    label: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 5,
    },
    optionalContent: {
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
