import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";

export default function GameFields({ form, updateField }) {
    return (
        <View>
            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Metacritic"
                        placeholder="73"
                        form={form}
                        updateField={updateField}
                        fieldName="metacritic"
                        keyboardType="numeric"
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CommonField
                        label="ESRB рейтинг"
                        placeholder="E10+"
                        form={form}
                        updateField={updateField}
                        fieldName="esrb"
                    />
                </View>
            </View>

            <CommonField
                label="Разработчики"
                placeholder="Team Cherry, ..."
                form={form}
                updateField={updateField}
                fieldName="developers"
            />
            <CommonField
                label="Платформы"
                placeholder="PC, Playstation, ..."
                form={form}
                updateField={updateField}
                fieldName="platforms"
            />
            <CommonField
                label="Время прохождения (часы)"
                placeholder="150"
                form={form}
                updateField={updateField}
                fieldName="duration"
                keyboardType="numeric"
            />
        </View>
    );
}
