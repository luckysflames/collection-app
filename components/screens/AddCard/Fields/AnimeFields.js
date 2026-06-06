import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";
import MaskedDateInput from "./MaskedDateInput";
import SelectField from "./SelectField";
import { ANIME_RATINGS, ANIME_KINDS, ANIME_STATUSES } from "../../../..//constants/index";

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
                    <MaskedDateInput
                        label="С (дд.мм.гггг)"
                        placeholder="12.04.2023"
                        form={form}
                        updateField={updateField}
                        fieldName="airedOn"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <MaskedDateInput
                        label="По (дд.мм.гггг)"
                        placeholder="28.06.2023"
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
                        label="Длител. эпизода"
                        placeholder="25"
                        form={form}
                        updateField={updateField}
                        fieldName="duration"
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Тип"
                        placeholder="Выберите тип"
                        form={form}
                        updateField={updateField}
                        fieldName="animeKind"
                        options={ANIME_KINDS}
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Статус"
                        placeholder="Онгоинг"
                        form={form}
                        updateField={updateField}
                        fieldName="animeStatus"
                        options={ANIME_STATUSES}
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Рейтинг"
                        placeholder="Выберите рейтинг"
                        form={form}
                        updateField={updateField}
                        fieldName="rating"
                        options={ANIME_RATINGS}
                    />
                </View>
            </View>

            <CommonField
                label="Студии"
                placeholder="Doga Kobo; Studio Ghibli; ..."
                form={form}
                updateField={updateField}
                fieldName="studios"
            />
        </View>
    );
}
