/**
 * Возвращает строковое представление выбранного значения фильтра
 */
export const renderFilterValue = (filter, value) => {
    if (!filter || value === undefined) return "";

    if (filter.type === "select") {
        const option = filter.options?.find((o) => o.id === value);
        return option ? option.label : "";
    }

    if (filter.type === "range") {
        if (Array.isArray(value)) {
            return `${value[0]} - ${value[1]}`;
        }
        return String(value);
    }

    return "";
};

/**
 * Генерирует быстрые пресеты для числовых диапазонов
 */
export const getPresetsForFilter = (id, min, max) => {
    const currentYear = new Date().getFullYear();

    if (id === "year") {
        return [
            {
                label: "Последние 5 лет",
                value: [currentYear - 5, currentYear],
            },
            { label: "2010-е", value: [2010, 2019] },
            { label: "2000-е", value: [2000, 2009] },
            { label: "90-е", value: [1990, 1999] },
            { label: "Ретро", value: [min, 1989] },
        ];
    }

    if (id === "duration" || id === "pageCount") {
        return [
            { label: "Короткие", value: [min, Math.round(max * 0.2)] },
            {
                label: "Средние",
                value: [Math.round(max * 0.2), Math.round(max * 0.5)],
            },
            { label: "Длинные", value: [Math.round(max * 0.5), max] },
        ];
    }

    // Дефолтный пресет (50/50)
    return [
        { label: "Минимум", value: [min, Math.round(max / 2)] },
        { label: "Максимум", value: [Math.round(max / 2), max] },
    ];
};

/**
 * Генерирует динамические фильтры на основе данных коллекции
 */
export const generateDynamicFilters = (myCollection, section) => {
    const dynamicFilters = [];

    // Поля, для которых генерируем динамические фильтры
    const dynamicFields = {
        genres: "Жанры",
        studios: "Студии",
        developers: "Разработчики",
        platforms: "Платформы",
        authors: "Авторы",
        companies: "Компании",
        countries: "Страны",
    };

    // Фильтруем коллекцию по секции
    const sectionItems = myCollection.filter(item => item.appSection === section);

    Object.entries(dynamicFields).forEach(([field, label]) => {
        const uniqueValues = new Set();

        sectionItems.forEach(item => {
            const value = item[field];
            if (value) {
                // Если значение - строка, разделяем по запятым
                if (typeof value === 'string') {
                    value.split(',').forEach(v => {
                        const trimmed = v.trim();
                        if (trimmed) uniqueValues.add(trimmed);
                    });
                }
                // Если массив, добавляем каждый элемент
                else if (Array.isArray(value)) {
                    value.forEach(v => {
                        const trimmed = typeof v === 'string' ? v.trim() : String(v).trim();
                        if (trimmed) uniqueValues.add(trimmed);
                    });
                }
            }
        });

        // Если есть уникальные значения, создаем фильтр
        if (uniqueValues.size > 0) {
            const options = Array.from(uniqueValues).sort().map(value => ({
                id: value,
                label: value,
            }));

            dynamicFilters.push({
                id: field,
                label,
                type: "select",
                options,
                isDynamic: true, // Помечаем как динамический
            });
        }
    });

    return dynamicFilters;
};
