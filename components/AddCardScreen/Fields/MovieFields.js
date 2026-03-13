import React from "react";
import { View } from "react-native";
import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function MovieFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                placeholder="Оригинальное название"
                form={form}
                updateField={updateField}
                fieldName="originalTitle"
            />

            <View style={formStyles.rowInputs}>
                <CommonField
                    placeholder="Бюджет"
                    form={form}
                    updateField={updateField}
                    fieldName="budget"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1 }]}
                />
                <CommonField
                    placeholder="Длительность (мин)"
                    form={form}
                    updateField={updateField}
                    fieldName="duration"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1, marginLeft: 10 }]}
                />
            </View>

            <CommonField
                placeholder="Страны (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="countries"
            />

            <CommonField
                placeholder="Компании (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="companies"
            />
        </View>
    );
}
