import { useState, useMemo } from "react";
import { Keyboard } from "react-native";
import { SECTION_MAPPING, SECTIONS } from "../constants";

export const useStatusManager = (store) => {
    const {
        getStatusesForSection,
        defaultTabs,
        setStatusesForSection,
        setDefaultTab,
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

    const [newStatus, setNewStatus] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Проверка изменений по всем секциям
    const hasChanges = useMemo(() => {
        const statusesChanged = SECTIONS.some(
            (s) =>
                JSON.stringify(allLocalStatuses[s.id]) !==
                JSON.stringify(getStatusesForSection(s.id)),
        );
        const defaultsChanged = SECTIONS.some((s) => {
            const key = SECTION_MAPPING[s.id];
            return allLocalDefaults[s.id] !== (defaultTabs[key] || "Всё");
        });
        return statusesChanged || defaultsChanged;
    }, [allLocalStatuses, allLocalDefaults, store]);

    const handleSave = async () => {
        if (!hasChanges || isSaving) return;
        setIsSaving(true);

        // Сохраняем каждую секцию в стор
        setTimeout(() => {
            SECTIONS.forEach((s) => {
                setStatusesForSection(s.id, allLocalStatuses[s.id]);
                setDefaultTab(s.id, allLocalDefaults[s.id]);
            });
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

    return {
        allLocalStatuses,
        allLocalDefaults,
        newStatus,
        isSaving,
        hasChanges,
        setNewStatus,
        handleSave,
        updateSectionStatuses,
        updateSectionDefault,
    };
};
