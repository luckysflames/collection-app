import { useMemo } from "react";
import { useCollectionStore } from "../store/useCollectionStore";
import { SECTION_MAPPING } from "../constants/index"; // Импортируем маппинг

export const useMediaCategories = (sectionId) => {
    // sectionId теперь "movie"
    const getStatusesForSection = useCollectionStore(
        (state) => state.getStatusesForSection,
    );
    const defaultTabs = useCollectionStore((state) => state.defaultTabs);

    return useMemo(() => {
        // Теперь передаем в стор латинский id напрямую
        const CATEGORIES = getStatusesForSection(sectionId);

        const sectionKey = SECTION_MAPPING[sectionId] || sectionId;
        const defaultActive = defaultTabs[sectionKey] || "Всё";

        let sectionName = "";
        // Исправляем case под латиницу
        switch (sectionId) {
            case "book":
                sectionName = "книг";
                break;
            case "game":
                sectionName = "игр";
                break;
            case "anime":
                sectionName = "аниме";
                break;
            case "movie":
                sectionName = "фильмов";
                break;
            default:
                sectionName = "элементов";
        }

        return {
            CATEGORIES,
            statuses: CATEGORIES,
            sectionName,
            defaultActive,
        };
    }, [sectionId, getStatusesForSection, defaultTabs]);
};
