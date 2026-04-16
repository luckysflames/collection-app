import { useMemo } from "react";
import { useCollectionStore } from "../store/useCollectionStore";

export const useMediaCategories = (section) => {
    // Получаем функцию-геттер из стора
    const getStatusesForSection = useCollectionStore(
        (state) => state.getStatusesForSection,
    );

    return useMemo(() => {
        // Получаем массив статусов напрямую из логики стора
        const rawStatuses = getStatusesForSection(section);

        // Добавляем "Папки" в начало
        const CATEGORIES = ["Всё", "Папки", ...rawStatuses];

        // Определяем человекочитаемое название для заголовков
        let sectionName = "";
        if (section === "Книги") sectionName = "книг";
        else if (section === "Игры") sectionName = "игр";
        else if (section === "Аниме") sectionName = "аниме";
        else sectionName = "фильмов";

        // Дефолтным активным элементом делаем "Папки"
        const defaultActive = "Всё";

        return { CATEGORIES, sectionName, defaultActive };
    }, [section, getStatusesForSection]);
};
