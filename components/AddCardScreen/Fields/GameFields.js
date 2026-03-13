import React from "react";
import { View } from "react-native";
import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function GameFields({ form, updateField }) {
    return (
        <View>
            <View style={formStyles.rowInputs}>
                <CommonField
                    placeholder="Metacritic"
                    form={form}
                    updateField={updateField}
                    fieldName="metacritic"
                    keyboardType="numeric"
                    style={[formStyles.input, { flex: 1 }]}
                />
                <CommonField
                    placeholder="ESRB рейтинг"
                    form={form}
                    updateField={updateField}
                    fieldName="esrb"
                    style={[formStyles.input, { flex: 1, marginLeft: 10 }]}
                />
            </View>

            <CommonField
                placeholder="Разработчики (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="developers"
            />
            <CommonField
                placeholder="Платформы (через запятую)"
                form={form}
                updateField={updateField}
                fieldName="platforms"
            />
            <CommonField
                placeholder="Время прохождения (часов)"
                form={form}
                updateField={updateField}
                fieldName="duration"
                keyboardType="numeric"
            />
        </View>
    );
}
