import React from "react";
import { View, StyleSheet } from "react-native";

import CommonField from "../../AddCard/Fields/CommonField";
import MovieFields from "../../AddCard/Fields/MovieFields";
import TVFields from "../../AddCard/Fields/TVFields";
import AnimeFields from "../../AddCard/Fields/AnimeFields";
import BookFields from "../../AddCard/Fields/BookFields";
import GameFields from "../../AddCard/Fields/GameFields";

const FIELD_COMPONENTS = {
    movie: MovieFields,
    tv: TVFields,
    anime: AnimeFields,
    book: BookFields,
    game: GameFields,
};

export const EditForm = ({ form, updateField, type }) => {
    const SpecificFields = FIELD_COMPONENTS[type];

    return (
        <View style={styles.container}>
            <CommonField
                placeholder="Название"
                form={form}
                updateField={updateField}
                fieldName="title"
            />

            {type !== "anime" && type !== "tv" && (
                <CommonField
                    placeholder="Дата выхода (полная или год)"
                    form={form}
                    updateField={updateField}
                    fieldName="year"
                />
            )}

            {SpecificFields && <SpecificFields form={form} updateField={updateField} />}

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
