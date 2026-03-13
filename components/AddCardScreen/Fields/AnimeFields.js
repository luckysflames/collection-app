import React from "react";
import { View } from "react-native";
import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function AnimeFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                placeholder="English Title"
                form={form}
                updateField={updateField}
                fieldName="englishTitle"
            />
            <CommonField
                placeholder="Japanese Title"
                form={form}
                updateField={updateField}
                fieldName="japaneseTitle"
            />

            <View style={formStyles.rowInputs}>
                <CommonField
                    placeholder="С (ГГГГ-ММ-ДД)"
                    form={form}
                    updateField={updateField}
                    fieldName="airedOn"
                    style={[formStyles.input, { flex: 1 }]}
                />
                <CommonField
                    placeholder="По (ГГГГ-ММ-ДД)"
                    form={form}
                    updateField={updateField}
                    fieldName="releasedOn"
                    style={[formStyles.input, { flex: 1, marginLeft: 10 }]}
                />
            </View>

            <View style={formStyles.rowInputs}>
                <CommonField
                    placeholder="Эпизодов всего"
                    form={form}
                    updateField={updateField}
                    fieldName="episodes"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1 }]}
                />
                <CommonField
                    placeholder="Вышло"
                    form={form}
                    updateField={updateField}
                    fieldName="episodesAired"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1, marginLeft: 10 }]}
                />
            </View>

            <CommonField
                placeholder="Длительность эпизода"
                form={form}
                updateField={updateField}
                fieldName="duration"
            />
            <CommonField
                placeholder="Статус аниме"
                form={form}
                updateField={updateField}
                fieldName="animeStatus"
            />
            <CommonField
                placeholder="Студии (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="studios"
            />
        </View>
    );
}
