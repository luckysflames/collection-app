import React from "react";
import { View } from "react-native";

import { useFormStyles } from "../styles/formStyles";
import CommonField from "./CommonField";
import SelectField from "./SelectField";
import { BOOK_MATURITY_RATINGS } from "../../../../constants/index";

export default function BookFields({ form, updateField }) {
    const formStyles = useFormStyles();

    return (
        <View>
            <CommonField
                label="Авторы"
                placeholder="Дж. К. Роулинг; Джордж Р. Р. Мартин; ..."
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
                    <SelectField
                        label="Возраст"
                        placeholder="Выберите рейтинг"
                        form={form}
                        updateField={updateField}
                        fieldName="maturityRating"
                        options={BOOK_MATURITY_RATINGS}
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
