import { useState, useMemo } from "react";
import { calculateAchievements } from "../utils/achievements/index";
import { useNotificationStore } from "../store/useNotificationStore";
import { ACHIEVEMENT_SECTIONS, ACHIEVEMENT_SUBGROUPS } from "../constants";

const SECTION_ORDER = Object.keys(ACHIEVEMENT_SECTIONS);

export function useAchievements(myCollection) {
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

    const groupedCategories = useMemo(() => {
        const sectionBuckets = processedAchievements.reduce((acc, achievement) => {
            const section = achievement.section || "common";
            if (!acc[section]) acc[section] = [];
            acc[section].push(achievement);
            return acc;
        }, {});

        return SECTION_ORDER.filter((sectionId) => sectionBuckets[sectionId]?.length).map(
            (sectionId) => {
                const data = sectionBuckets[sectionId];

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

                return {
                    id: sectionId,
                    title: ACHIEVEMENT_SECTIONS[sectionId] || sectionId,
                    groups,
                    stats: {
                        total: data.length,
                        unlocked: data.filter((i) => i.isCompleted).length,
                    },
                };
            },
        );
    }, [processedAchievements]);

    const totalStats = useMemo(() => {
        let unlocked = 0;
        for (let i = 0; i < processedAchievements.length; i++) {
            if (processedAchievements[i].isCompleted) unlocked++;
        }
        return {
            total: processedAchievements.length,
            unlocked,
        };
    }, [processedAchievements]);

    const tabs = useMemo(
        () => groupedCategories.map((cat) => ({ id: cat.id, title: cat.title })),
        [groupedCategories],
    );

    return {
        groupedCategories,
        totalStats,
        tabs,
        selectedAchiv,
        setSelectedAchiv,
    };
}
