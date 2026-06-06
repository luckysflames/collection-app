import { useState, useMemo, useEffect, useRef } from "react";
import { calculateAchievements } from "../utils/achievements/index";
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
    });

    const groupedCategories = useMemo(() => {
        const achievements = processedAchievements;

        const sectionBuckets = achievements.reduce((acc, achievement) => {
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

                const totalInSection = data.length;
                const unlockedInSection = data.filter((i) => i.isCompleted).length;

                return {
                    id: sectionId,
                    title: ACHIEVEMENT_SECTIONS[sectionId] || sectionId,
                    groups,
                    stats: { total: totalInSection, unlocked: unlockedInSection },
                };
            },
        );
    }, [processedAchievements]);

    const totalStats = useMemo(() => {
        return {
            total: processedAchievements.length,
            unlocked: processedAchievements.filter((a) => a.isCompleted).length,
        };
    }, [processedAchievements]);

    const tabs = useMemo(() => {
        return groupedCategories.map((cat) => ({ id: cat.id, title: cat.title }));
    }, [groupedCategories]);

    useEffect(() => {
        if (!highlightId || !itemRefs[highlightId]) return;

        let idleHandle = null;
        let scrollTimeout = null;

        const performScroll = () => {
            scrollTimeout = setTimeout(() => {
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
            }, 250);
        };

        if (typeof requestIdleCallback !== "undefined") {
            idleHandle = requestIdleCallback(performScroll);
        } else {
            // Фолбек для старых сред выполнения, где нет requestIdleCallback
            performScroll();
        }

        const clearParamsTimer = setTimeout(() => {
            if (navigation.isFocused()) {
                navigation.setParams({ highlightId: undefined });
            }
        }, 3000);

        return () => {
            if (idleHandle && typeof cancelIdleCallback !== "undefined") {
                cancelIdleCallback(idleHandle);
            }
            if (scrollTimeout) clearTimeout(scrollTimeout);
            clearTimeout(clearParamsTimer);
        };
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
