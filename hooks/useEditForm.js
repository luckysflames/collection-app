import { useEffect, useState, useRef } from "react";
import { parseList } from "../utils/listParser";

export const useEditForm = (isEditing, initialData) => {
    const [form, setForm] = useState({});
    const prevInitialDataRef = useRef();

    useEffect(() => {
        // Проверяем, изменились ли данные
        const hasDataChanged =
            JSON.stringify(prevInitialDataRef.current) !==
            JSON.stringify(initialData);

        if (
            isEditing &&
            initialData &&
            (prevInitialDataRef.current === undefined || hasDataChanged)
        ) {
            prevInitialDataRef.current = initialData;
            const preparedData = {};

            const fieldsToClean = [
                "duration",
                "pageCount",
                "budget",
                "episodes",
                "episodesAired",
                "episodesCount",
                "seasonsCount",
                "metacritic",
            ];

            const dateFields = ["airedOn", "releasedOn", "year"];

            // Поля селекторов - копируются как есть (ID значения)
            const selectFields = [
                "animeKind",
                "animeStatus",
                "rating",
                "movieStatus",
                "maturityRating",
                "esrb",
            ];

            const cleanNumeric = (value) => {
                const normalized = String(value).replace(",", ".").trim();
                const match = normalized.match(/^(\d*\.?\d+)/);
                return match ? match[0] : "";
            };

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

                // 2. Специально обрабатываем список платформ для редактирования
                if (key === "platforms") {
                    if (Array.isArray(value)) {
                        // Теперь сохраняем весь массив для мультивыбора
                        preparedData[key] = value;
                    } else if (typeof value === "string") {
                        // Если пришла строка (например, из старых данных), превращаем в массив
                        preparedData[key] = parseList(value);
                    } else {
                        preparedData[key] = [];
                    }
                    return;
                }

                // 3. Если в данных приходят API-поля сериалов,
                //    мапим их на форму с привычными полями.
                if (key === "seasonsCount") {
                    preparedData.seasons = cleanNumeric(value);
                    return;
                }
                if (key === "episodesCount") {
                    preparedData.episodes = cleanNumeric(value);
                    return;
                }

                // 4. Массивы в строку
                if (Array.isArray(value)) {
                    preparedData[key] = value.join(", ");
                    return;
                }

                // 5. Поля селекторов копируются как есть (уже содержат ID)
                if (selectFields.includes(key)) {
                    preparedData[key] = String(value);
                    return;
                }

                // 5. Обработка дат: преобразуем гггг-мм-дд в дд.мм.гггг для отображения
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

                // 6. Очистка числовых полей (с поддержкой десятичных значений)
                if (fieldsToClean.includes(key) && typeof value === "string") {
                    preparedData[key] = cleanNumeric(value);
                    return;
                }

                preparedData[key] = String(value);
            });

            setForm(preparedData);
        }

        if (!isEditing) {
            setForm({});
            prevInitialDataRef.current = undefined;
        }
    }, [isEditing]);

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return [form, updateField];
};
