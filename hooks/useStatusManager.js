import { useState, useMemo } from "react";
import { Keyboard } from "react-native";
import {
    SECTION_MAPPING,
    SECTIONS,
    DEFAULT_CATEGORY_ORDER,
    getOrderedCategories,
} from "../constants/index";

export const useStatusManager = (store) => {
    // Извлекаем экшены и реактивные данные.
    // Если это Zustand, лучше обращаться к store.categoryOrder напрямую в useMemo,
    // чтобы всегда иметь свежие данные после вызова экшенов.
    const {
        getStatusesForSection,
        defaultTabs,
        defaultSorts,
        categoryOrder,
        setStatusesForSection,
        setDefaultTab,
        setDefaultSort,
        setCategoryOrder,
    } = store;

    // Инициализируем состояние для ВСЕХ секций сразу
    const [allLocalStatuses, setAllLocalStatuses] = useState(() => {
        const initial = {};
        SECTIONS.forEach((s) => {
            initial[s.id] = getStatusesForSection(s.id);
        });
        return initial;
    });

    const [allLocalDefaults, setAllLocalDefaults] = useState(() => {
        const initial = {};
        SECTIONS.forEach((s) => {
            const key = SECTION_MAPPING[s.id];
            initial[s.id] = defaultTabs[key] || "Всё";
        });
        return initial;
    });

    const [allLocalSorts, setAllLocalSorts] = useState(() => {
        const initial = {};
        SECTIONS.forEach((s) => {
            const key = SECTION_MAPPING[s.id];
            initial[s.id] = defaultSorts[key] || "date_desc";
        });
        return initial;
    });

    const [allLocalCategoryOrder, setAllLocalCategoryOrder] = useState(
        () =>
            getOrderedCategories(categoryOrder || DEFAULT_CATEGORY_ORDER).map(
                (category) => category.id,
            ),
    );

    const [newStatus, setNewStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Проверка изменений по всем секциям
    const hasChanges = useMemo(() => {
        const statusesChanged = SECTIONS.some(
            (s) =>
                JSON.stringify(allLocalStatuses[s.id]) !==
                JSON.stringify(store.getStatusesForSection(s.id)), // берём актуальный метод из store
        );
        const defaultsChanged = SECTIONS.some((s) => {
            const key = SECTION_MAPPING[s.id];
            return allLocalDefaults[s.id] !== (store.defaultTabs[key] || "Всё"); // берём актуальный объект из store
        });
        const sortsChanged = SECTIONS.some((s) => {
            const key = SECTION_MAPPING[s.id];
            return allLocalSorts[s.id] !== (store.defaultSorts[key] || "date_desc"); // берём актуальный объект из store
        });
        const orderChanged =
            JSON.stringify(allLocalCategoryOrder) !==
            JSON.stringify(store.categoryOrder || DEFAULT_CATEGORY_ORDER); // берём актуальный массив из store

        return statusesChanged || defaultsChanged || sortsChanged || orderChanged;
    }, [
        allLocalStatuses,
        allLocalDefaults,
        allLocalSorts,
        allLocalCategoryOrder,
        store, // КРИТИЧЕСКИ ВАЖНО: следим за изменением самого стора
    ]);

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;
        setIsSaving(true);

        // Сохраняем каждую секцию и порядок категорий в стор
        setTimeout(() => {
            SECTIONS.forEach((s) => {
                setStatusesForSection(s.id, allLocalStatuses[s.id]);
                setDefaultTab(s.id, allLocalDefaults[s.id]);
                setDefaultSort(s.id, allLocalSorts[s.id]);
            });
            setCategoryOrder(allLocalCategoryOrder);
            setIsSaving(false);
            Keyboard.dismiss();
        }, 600);
    };

    // Методы для обновления конкретной секции
    const updateSectionStatuses = (sectionId, newStatuses) => {
        setAllLocalStatuses((prev) => ({ ...prev, [sectionId]: newStatuses }));
    };

    const updateSectionDefault = (sectionId, newDefault) => {
        setAllLocalDefaults((prev) => ({ ...prev, [sectionId]: newDefault }));
    };

    const updateSectionSort = (sectionId, newSort) => {
        setAllLocalSorts((prev) => ({ ...prev, [sectionId]: newSort }));
    };

    const updateCategoryOrder = (newOrder) => {
        setAllLocalCategoryOrder(newOrder);
    };

    return {
        allLocalStatuses,
        allLocalDefaults,
        allLocalSorts,
        allLocalCategoryOrder,
        newStatus,
        isSaving,
        hasChanges,
        setNewStatus,
        handleSave,
        updateSectionStatuses,
        updateSectionDefault,
        updateSectionSort,
        updateCategoryOrder,
    };
};
