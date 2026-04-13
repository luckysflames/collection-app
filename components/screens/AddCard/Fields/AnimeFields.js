import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function AnimeFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                label="Английское название"
                placeholder="Oshi No Ko"
                form={form}
                updateField={updateField}
                fieldName="englishTitle"
            />
            <CommonField
                label="Японское название"
                placeholder="推しの子"
                form={form}
                updateField={updateField}
                fieldName="japaneseTitle"
            />

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="С (ГГГГ-ММ-ДД)"
                        placeholder="2023-04-12"
                        form={form}
                        updateField={updateField}
                        fieldName="airedOn"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="По (ГГГГ-ММ-ДД)"
                        placeholder="2023-06-28"
                        form={form}
                        updateField={updateField}
                        fieldName="releasedOn"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Эпизодов всего"
                        placeholder="12"
                        form={form}
                        updateField={updateField}
                        fieldName="episodes"
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Эпизодов вышло"
                        placeholder="11"
                        form={form}
                        updateField={updateField}
                        fieldName="episodesAired"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Длительность эпизода"
                        placeholder="25"
                        form={form}
                        updateField={updateField}
                        fieldName="duration"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Статус аниме"
                        placeholder="Вышло"
                        form={form}
                        updateField={updateField}
                        fieldName="animeStatus"
                    />
                </View>
            </View>

            <CommonField
                label="Студии"
                placeholder="Doga Kobo, ..."
                form={form}
                updateField={updateField}
                fieldName="studios"
            />
        </View>
    );
}
