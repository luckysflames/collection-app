import React from "react";
import { View } from "react-native";

import CommonField from "./CommonField";
import MaskedDateInput from "./MaskedDateInput";
import SelectField from "./SelectField";
import { MANGA_KINDS, MANGA_STATUSES } from "../../../../constants/index";
import { useFormStyles } from "../styles/formStyles";

export default function MangaFields({ form, updateField }) {
    const formStyles = useFormStyles();

    return (
        <View>
            <CommonField
                label="Английское название"
                placeholder="One Piece"
                form={form}
                updateField={updateField}
                fieldName="englishTitle"
            />
            <CommonField
                label="Японское название"
                placeholder="ワンピース"
                form={form}
                updateField={updateField}
                fieldName="japaneseTitle"
            />

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <MaskedDateInput
                        label="С (дд.мм.гггг)"
                        placeholder="22.07.1997"
                        form={form}
                        updateField={updateField}
                        fieldName="airedOn"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <MaskedDateInput
                        label="По (дд.мм.гггг)"
                        placeholder="13.10.2026"
                        form={form}
                        updateField={updateField}
                        fieldName="releasedOn"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Томов"
                        placeholder="110"
                        form={form}
                        updateField={updateField}
                        fieldName="volumes"
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Глав"
                        placeholder="1120"
                        form={form}
                        updateField={updateField}
                        fieldName="chapters"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Тип"
                        placeholder="Манга"
                        form={form}
                        updateField={updateField}
                        fieldName="mangaKind"
                        options={MANGA_KINDS}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Статус публикации"
                        placeholder="Выходит"
                        form={form}
                        updateField={updateField}
                        fieldName="mangaStatus"
                        options={MANGA_STATUSES}
                    />
                </View>
            </View>

            <CommonField
                label="Авторы"
                placeholder="Эйитиро Ода"
                form={form}
                updateField={updateField}
                fieldName="authors"
            />
            <CommonField
                label="Издатели"
                placeholder="Shueisha"
                form={form}
                updateField={updateField}
                fieldName="publishers"
            />
        </View>
    );
}
