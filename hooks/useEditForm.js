import { useState, useEffect } from "react";

export const useEditForm = (isEditing, initialData) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (isEditing && initialData) {
            const preparedData = {};

            // Проходим по ключам initialData и готовим их для инпутов
            Object.keys(initialData).forEach((key) => {
                const value = initialData[key];

                if (Array.isArray(value)) {
                    preparedData[key] = value.join(", ");
                } else if (value === null || value === undefined) {
                    preparedData[key] = "";
                } else {
                    preparedData[key] = String(value);
                }
            });

            setForm(preparedData);
        }
        // Если закрываем редактирование — чистим форму
        if (!isEditing) {
            setForm({});
        }
    }, [isEditing]); // Только при смене режима

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return [form, updateField];
};
