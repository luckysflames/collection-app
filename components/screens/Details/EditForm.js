import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useMediaCategories } from "../../../hooks/useMediaCategories";
import { STATUS_SELECTION_EXCLUDE } from "../../../constants";
import ImageUploader from "../../shared/ImageUploader";
import CommonField from "../AddCard/Fields/CommonField";
import MovieFields from "../AddCard/Fields/MovieFields";
import AnimeFields from "../AddCard/Fields/AnimeFields";
import BookFields from "../AddCard/Fields/BookFields";
import GameFields from "../AddCard/Fields/GameFields";
import StatusPicker from "../../screens/AddCard/StatusPicker";

export const EditForm = ({ form, updateField, type }) => {
    // Получаем категории для StatusPicker
    const { statuses } = useMediaCategories(
        type === "movie"
            ? "Фильмы"
            : type === "anime"
              ? "Аниме"
              : type === "game"
                ? "Игры"
                : "Книги",
    );

    // console.log('Current Form Status:', form.status, 'Available Categories:', CATEGORIES);

    const filteredStatuses = statuses.filter(
        (s) => !STATUS_SELECTION_EXCLUDE.includes(s),
    );

    return (
        <View style={styles.container}>
            {/* 2. Название */}
            <CommonField
                placeholder="Название"
                form={form}
                updateField={updateField}
                fieldName="title"
            />

            {/* 3. Год (если не аниме, как в AddCardScreen) */}
            {!(type === "anime") && (
                <CommonField
                    placeholder="Дата выхода (полная или год)"
                    form={form}
                    updateField={updateField}
                    fieldName="year"
                />
            )}

            {/* 4. Специфичные поля */}
            {type === "movie" && (
                <MovieFields form={form} updateField={updateField} />
            )}
            {type === "anime" && (
                <AnimeFields form={form} updateField={updateField} />
            )}
            {type === "book" && (
                <BookFields form={form} updateField={updateField} />
            )}
            {type === "game" && (
                <GameFields form={form} updateField={updateField} />
            )}

            {/* 5. Общие поля */}
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

            {/* 6. Статус */}
            <StatusPicker
                categories={filteredStatuses}
                currentStatus={form.status}
                type={type}
                onSelect={(status) => updateField("status", status)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 5 },
    label: {
        color: "#8E94A4",
        fontSize: 12,
        marginTop: 15,
        marginBottom: 5,
        textTransform: "uppercase",
        fontWeight: "700",
    },
});
