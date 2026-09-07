import React from "react";
import { View } from "react-native";

import CommonField from "./CommonField";
import MaskedDateInput from "./MaskedDateInput";
import SelectField from "./SelectField";
import { MOVIE_STATUSES } from "../../../../constants/index";
import { useFormStyles } from "../styles/formStyles";

export default function TVFields({ form, updateField }) {
    const formStyles = useFormStyles();

    return (
        <View>
            <CommonField
                label="Оригинальное название"
                placeholder="Supernatural"
                form={form}
                updateField={updateField}
                fieldName="originalTitle"
            />

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <MaskedDateInput
                        label="С (дд.мм.гггг)"
                        placeholder="12.04.2023"
                        form={form}
                        updateField={updateField}
                        fieldName="first_air_date"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <MaskedDateInput
                        label="По (дд.мм.гггг)"
                        placeholder="28.06.2023"
                        form={form}
                        updateField={updateField}
                        fieldName="last_air_date"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Сезонов"
                        placeholder="1"
                        form={form}
                        updateField={updateField}
                        fieldName="seasons"
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Эпизодов"
                        placeholder="12"
                        form={form}
                        updateField={updateField}
                        fieldName="episodes"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Длительность (мин)"
                        placeholder="45"
                        form={form}
                        updateField={updateField}
                        fieldName="duration"
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Статус"
                        placeholder="Выберите статус"
                        form={form}
                        updateField={updateField}
                        fieldName="movieStatus"
                        options={MOVIE_STATUSES}
                    />
                </View>
            </View>

            <CommonField
                label="Страны"
                placeholder="Япония; США; ..."
                form={form}
                updateField={updateField}
                fieldName="countries"
            />

            <CommonField
                label="Компании"
                placeholder="Netflix; Sony Pictures Entertainment, LLC"
                form={form}
                updateField={updateField}
                fieldName="companies"
            />
        </View>
    );
}
