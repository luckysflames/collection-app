import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function BookFields({ form, updateField }) {
    return (
        <View>
            <CommonField
                label="Авторы"
                placeholder="Дж. К. Роулинг, ..."
                form={form}
                updateField={updateField}
                fieldName="authors"
            />

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Объём (стр)"
                        placeholder="254"
                        form={form}
                        updateField={updateField}
                        fieldName="pageCount"
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Возраст"
                        placeholder="18+"
                        form={form}
                        updateField={updateField}
                        fieldName="maturity"
                    />
                </View>
            </View>

            <CommonField
                label="Издатель"
                placeholder="РОСМЭН"
                form={form}
                updateField={updateField}
                fieldName="publisher"
            />
        </View>
    );
}
