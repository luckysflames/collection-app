import React from "react";
import { View, StyleSheet } from "react-native";

// Компоненты полей
import CommonField from "../AddCard/Fields/CommonField";
import MovieFields from "../AddCard/Fields/MovieFields";
import AnimeFields from "../AddCard/Fields/AnimeFields";
import BookFields from "../AddCard/Fields/BookFields";
import GameFields from "../AddCard/Fields/GameFields";

// Маппинг специфичных секций для удобства
const FIELD_COMPONENTS = {
    movie: MovieFields,
    anime: AnimeFields,
    book: BookFields,
    game: GameFields,
};

export const EditForm = ({ form, updateField, type }) => {
    // Выбираем нужный компонент на основе типа
    const SpecificFields = FIELD_COMPONENTS[type];

    return (
        <View style={styles.container}>
            {/* Название — общее для всех */}
            <CommonField
                placeholder="Название"
                form={form}
                updateField={updateField}
                fieldName="title"
            />

            {/* Поле года скрыто для аниме, так как там свои даты начала/конца */}
            {type !== "anime" && (
                <CommonField
                    placeholder="Дата выхода (полная или год)"
                    form={form}
                    updateField={updateField}
                    fieldName="year"
                />
            )}

            {/* Отрисовка специфичных полей (Movie, Anime, Book или Game) */}
            {SpecificFields && (
                <SpecificFields form={form} updateField={updateField} />
            )}

            {/* Общие поля в конце */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
});
