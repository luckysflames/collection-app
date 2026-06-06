export const parseList = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => (item === undefined || item === null ? "" : String(item).trim()))
            .filter(Boolean);
    }

    if (value === undefined || value === null) {
        return [];
    }

    const text = String(value).trim();
    if (!text) {
        return [];
    }

    let hasSemicolon = false;
    let quoteChar = null;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];
        if (quoteChar) {
            if (char === quoteChar) {
                quoteChar = null;
            }
            continue;
        }

        if (char === '"' || char === "'") {
            quoteChar = char;
            continue;
        }

        if (char === ";") {
            hasSemicolon = true;
            break;
        }
    }

    const separators = hasSemicolon ? [";"] : [","];
    const items = [];
    let current = "";
    quoteChar = null;

    for (let index = 0; index < text.length; index += 1) {
        const char = text[index];

        if (quoteChar) {
            if (char === quoteChar) {
                quoteChar = null;
                continue;
            }
            current += char;
            continue;
        }

        if (char === '"' || char === "'") {
            quoteChar = char;
            continue;
        }

        if (separators.includes(char)) {
            items.push(current.trim());
            current = "";
            continue;
        }

        current += char;
    }

    items.push(current.trim());

    return items.filter(Boolean);
};
