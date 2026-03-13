import React from "react";
import { TextInput } from "react-native";
import { formStyles } from "../styles/formStyles";

export default function CommonField({
    placeholder,
    form,
    updateField,
    fieldName,
    ...props
}) {
    return (
        <TextInput
            style={[formStyles.input, props.style]}
            placeholder={placeholder}
            placeholderTextColor="#4E5566"
            value={form[fieldName]}
            onChangeText={(text) => updateField(fieldName, text)}
            {...props}
        />
    );
}
