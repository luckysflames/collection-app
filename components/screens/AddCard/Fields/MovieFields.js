import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";
import SelectField from "./SelectField";
import { MOVIE_STATUSES } from "../../../../constants/index";

export default function MovieFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                label="Оригинальное название"
                placeholder="Oshi No Ko"
                form={form}
                updateField={updateField}
                fieldName="originalTitle"
            />

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Бюджет ($)"
                        placeholder="150000"
                        form={form}
                        updateField={updateField}
                        fieldName="budget"
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Длительность (мин)"
                        placeholder="254"
                        form={form}
                        updateField={updateField}
                        fieldName="duration"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={formStyles.rowInputs}>
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
                placeholder="Япония, США, ..."
                form={form}
                updateField={updateField}
                fieldName="countries"
            />

            <CommonField
                label="Компании"
                placeholder="Disney, Pixar, ..."
                form={form}
                updateField={updateField}
                fieldName="companies"
            />
        </View>
    );
}
