// Вспомогательная функция для очистки HTML-тегов и BB-кодов
export const cleanHtml = (text) => {
    if (!text) return "";

    let cleaned = text;

    // 1. СТРАХОВКА: Если это HTML и мы видим пустые ссылки <a></a>,
    // пробуем вытащить русское имя из data-attrs прежде чем удалить теги
    if (cleaned.includes("data-attrs")) {
        cleaned = cleaned.replace(
            /<a[^>]*data-attrs="([^"]*)"[^>]*><\/a>/g,
            (match, encodedAttrs) => {
                try {
                    // Декодируем кавычки &quot; -> "
                    const decoded = encodedAttrs.replace(/&quot;/g, '"');
                    const attrs = JSON.parse(decoded);
                    return attrs.russian || attrs.name || "";
                } catch (e) {
                    return "";
                }
            },
        );
    }

    // 2. Обработка BB-кодов (на случай, если пришел description)
    cleaned = cleaned
        .replace(/\[\w+=[^\]]*\]/g, "")
        .replace(/\[\/\w+\]/g, "")
        .replace(/\[\[(.*?)\]\]/g, "$1")
        .replace(/\[[^\]]*\]/g, "");

    // 3. Основная чистка HTML
    cleaned = cleaned
        .replace(/<br\s*\/?>/gi, "\n") // Сохраняем переносы строк
        .replace(/<[^>]*>?/gm, "") // Удаляем все остальные теги
        .replace(/&nbsp;/g, " ") // Чистим сущности
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");

    // 4. Финальный лоск
    return cleaned
        .replace(/[ ]+/g, " ") // Убираем двойные пробелы
        .replace(/\n\s*\n/g, "\n\n") // Убираем лишние пустые строки
        .trim();
};

// Вспомогательная функция для получения чистого ID без префикса и номера страницы
export const getCleanId = (complexId, prefix) => complexId.replace(prefix, "").split("-")[0];

export const extractCreator = (personRoles) => {
    if (!Array.isArray(personRoles)) return null;

    const originalCreator = personRoles.find(
        (pr) => pr.rolesEn?.includes("Original Creator") || pr.rolesRu?.includes("Автор оригинала"),
    );
    if (originalCreator?.person?.name) {
        return originalCreator.person.name;
    }

    return null;
};
