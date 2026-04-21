import { useEffect, useState } from "react";

export const useEditForm = (isEditing, initialData) => {
    const [form, setForm] = useState({});

    useEffect(() => {
        if (isEditing && initialData) {
            const preparedData = {};

            const fieldsToClean = [
                "duration",
                "pageCount",
                "budget",
                "episodes",
                "episodesAired",
                "metacritic",
            ];

            const dateFields = ["airedOn", "releasedOn", "year"];

            // Поля селекторов - копируются как есть (ID значения)
            const selectFields = [
                "animeKind",
                "animeStatus",
                "rating",
                "movieStatus",
                "maturity",
                "esrb",
            ];

            Object.keys(initialData).forEach((key) => {
                let value = initialData[key];

                // 1. Если значения нет или это заглушка "?"
                if (
                    value === null ||
                    value === undefined ||
                    value === "?" ||
                    value === "?. мин."
                ) {
                    preparedData[key] = "";
                    return;
                }

                // 2. Массивы в строку
                if (Array.isArray(value)) {
                    preparedData[key] = value.join(", ");
                    return;
                }

                // 3. Поля селекторов копируются как есть (уже содержат ID)
                if (selectFields.includes(key)) {
                    preparedData[key] = String(value);
                    return;
                }

                // 4. Обработка дат: преобразуем гггг-мм-дд в дд.мм.гггг для отображения
                // MaskedDateInput будет преобразовывать обратно
                if (dateFields.includes(key) && typeof value === "string") {
                    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        // ISO формат гггг-мм-дд → дд.мм.гггг
                        const [year, month, day] = value.split("-");
                        preparedData[key] = `${day}.${month}.${year}`;
                    } else {
                        preparedData[key] = value;
                    }
                    return;
                }

                // 5. Очистка числовых полей (только цифры)
                if (fieldsToClean.includes(key) && typeof value === "string") {
                    let cleaned = value.replace(/[^0-9]/g, "");
                    preparedData[key] = cleaned;
                    return;
                }

                preparedData[key] = String(value);
            });

            setForm(preparedData);
        }

        if (!isEditing) {
            setForm({});
        }
    }, [isEditing]);

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return [form, updateField];
};
