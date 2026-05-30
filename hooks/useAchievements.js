import { useState, useMemo, useEffect, useRef } from "react";
import { InteractionManager } from "react-native";
import { calculateAchievements } from "../utils/achievements/index";
// ДОБАВЛЕНО: Импортируем стор уведомлений, чтобы знать историю полученных ачивок
import { useNotificationStore } from "../store/useNotificationStore";
import { ACHIEVEMENT_SECTIONS, ACHIEVEMENT_SUBGROUPS } from "../constants";

const SECTION_ORDER = Object.keys(ACHIEVEMENT_SECTIONS);

export function useAchievements(myCollection, highlightId, navigation) {
    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const itemRefs = useRef({}).current;

    const [selectedAchiv, setSelectedAchiv] = useState(null);

    const shownAchievements = useNotificationStore((state) => state.shownAchievements);

    const processedAchievements = useMemo(() => {
        const rawAchievements = calculateAchievements(myCollection) || [];

        return rawAchievements.map((achiv) => {
            const hasBeenUnlockedBefore = shownAchievements.includes(achiv.id);
            const currentIsCompleted = achiv.current >= achiv.target;
            const finalCompleted = currentIsCompleted || hasBeenUnlockedBefore;
            const isLockedSecret = achiv.hidden && !finalCompleted;

            return {
                ...achiv,
                isCompleted: finalCompleted,
                current: finalCompleted ? achiv.target : achiv.current,

                displayTitle: isLockedSecret ? "Секретное достижение" : achiv.title,
                displayDesc: isLockedSecret ? "Постарайся, постарайся" : achiv.description,
                displayIconName: isLockedSecret ? "Lock" : achiv.iconName,
            };
        });
    }, [myCollection, shownAchievements]);

    // 1. Формируем структуру данных
    const groupedCategories = useMemo(() => {
        // ИСПОЛЬЗУЕМ: Уже обработанные ачивки вместо сырых
        const achievements = processedAchievements;

        // Группируем по секциям
        const sectionBuckets = achievements.reduce((acc, achievement) => {
            const section = achievement.section || "common";
            if (!acc[section]) acc[section] = [];
            acc[section].push(achievement);
            return acc;
        }, {});

        return SECTION_ORDER.filter((sectionId) => sectionBuckets[sectionId]?.length).map(
            (sectionId) => {
                const data = sectionBuckets[sectionId];

                // Внутри секции группируем ачивки по их внутреннему groupId
                const groupBuckets = data.reduce((acc, achievement) => {
                    const groupId = achievement.groupId || "other";
                    if (!acc[groupId]) acc[groupId] = [];
                    acc[groupId].push(achievement);
                    return acc;
                }, {});

                const groups = Object.keys(groupBuckets).map((groupId) => ({
                    id: groupId,
                    title: ACHIEVEMENT_SUBGROUPS[groupId] || "Прочее",
                    data: groupBuckets[groupId],
                }));

                const totalInSection = data.length;
                // Теперь этот фильтр корректно учтет перманентные ачивки!
                const unlockedInSection = data.filter((i) => i.isCompleted).length;

                return {
                    id: sectionId,
                    title: ACHIEVEMENT_SECTIONS[sectionId] || sectionId,
                    groups,
                    stats: { total: totalInSection, unlocked: unlockedInSection },
                };
            },
        );
    }, [processedAchievements]); // Зависим от обработанного массива

    // 2. Общая статистика по всем ачивкам
    const totalStats = useMemo(() => {
        // ИСПОЛЬЗУЕМ: Обработанный массив, чтобы счётчик в Header тоже не сбрасывался
        return {
            total: processedAchievements.length,
            unlocked: processedAchievements.filter((a) => a.isCompleted).length,
        };
    }, [processedAchievements]);

    // Список доступных табов для верхнего меню
    const tabs = useMemo(() => {
        return groupedCategories.map((cat) => ({ id: cat.id, title: cat.title }));
    }, [groupedCategories]);

    // 3. Авто-скролл к highlightId
    useEffect(() => {
        if (highlightId && itemRefs[highlightId]) {
            const interactionPromise = InteractionManager.runAfterInteractions(() => {
                const timer = setTimeout(() => {
                    if (itemRefs[highlightId] && containerRef.current) {
                        itemRefs[highlightId].measureLayout(
                            containerRef.current,
                            (x, y) => {
                                scrollRef.current?.scrollTo({
                                    y: Math.max(0, y - 150),
                                    animated: true,
                                });
                            },
                            (error) => console.error("Scroll error:", error),
                        );
                    }
                }, 400);

                return () => clearTimeout(timer);
            });

            const clearParamsTimer = setTimeout(() => {
                if (navigation.isFocused()) {
                    navigation.setParams({ highlightId: undefined });
                }
            }, 3000);

            return () => {
                interactionPromise.cancel();
                clearTimeout(clearParamsTimer);
            };
        }
    }, [highlightId, navigation, itemRefs]);

    return {
        groupedCategories,
        totalStats,
        tabs,
        selectedAchiv,
        setSelectedAchiv,
        scrollRef,
        containerRef,
        itemRefs,
    };
}
