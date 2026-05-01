import React from "react";
import { View } from "react-native";

import { formStyles } from "../styles/formStyles";
import CommonField from "./CommonField";
import SelectField from "./SelectField";
import { ESRB_RATINGS, GAME_PLATFORMS } from "../../../../constants";

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
                    <SelectField
                        label="ESRB рейтинг"
                        placeholder="Выберите рейтинг"
                        form={form}
                        updateField={updateField}
                        fieldName="esrb"
                        options={ESRB_RATINGS}
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

            <View style={formStyles.rowInputs}>
                <View style={{ flex: 1 }}>
                    <SelectField
                        label="Платформа"
                        placeholder="PC, ..."
                        form={form}
                        updateField={updateField}
                        fieldName="platforms"
                        options={GAME_PLATFORMS}
                        isMulti
                    />
                </View>

                <View style={{ flex: 1 }}>
                    <CommonField
                        label="Время прохождения"
                        placeholder="1.5"
                        form={form}
                        updateField={updateField}
                        fieldName="duration"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );
}
