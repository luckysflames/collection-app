import React from "react";
import { View } from "react-native";
import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function BookFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                placeholder="Авторы (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="authors"
            />

            <View style={formStyles.rowInputs}>
                <CommonField
                    placeholder="Объём (стр)"
                    form={form}
                    updateField={updateField}
                    fieldName="pageCount"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1 }]}
                />
                <CommonField
                    placeholder="Maturity (18+...)"
                    form={form}
                    updateField={updateField}
                    fieldName="maturity"
                    style={[formStyles.input, { flex: 1, marginLeft: 10 }]}
                />
            </View>

            <CommonField
                placeholder="Издатель"
                form={form}
                updateField={updateField}
                fieldName="publisher"
            />
        </View>
    );
}
