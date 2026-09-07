import React from "react";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { calculateAchievements } from "../../../utils/achievements/index";
import { AchievementToast } from "./AchivementToast";

export const AchivementNotifier = () => {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const isNotify = useCollectionStore((state) => state.isNotify);

    const _hasHydrated = useNotificationStore((state) => state._hasHydrated);
    const achievementQueue = useNotificationStore((state) => state.achievementQueue);
    const shownAchievements = useNotificationStore((state) => state.shownAchievements);
    const showAchievement = useNotificationStore((state) => state.showAchievement);
    const dismissAchievement = useNotificationStore((state) => state.dismissAchievement);

    const currentAchievement = achievementQueue[0] || null;

    React.useEffect(() => {
        if (!_hasHydrated) return;

        const achievements = calculateAchievements(myCollection);

        achievements.forEach((achievement) => {
            const isCompletedNow = achievement.isCompleted;
            const wasShownBefore = shownAchievements.includes(achievement.id);
            const isInQueue = achievementQueue.some((item) => item.id === achievement.id);

            if (isCompletedNow && !wasShownBefore && !isInQueue) {
                showAchievement({
                    ...achievement,
                    isCompleted: true,
                    current: achievement.target,
                });
            }
        });
    }, [myCollection, _hasHydrated, shownAchievements, achievementQueue]);

    if (!currentAchievement || !isNotify) return null;

    return (
        <AchievementToast
            key={currentAchievement.id}
            achievement={currentAchievement}
            onDismiss={dismissAchievement}
        />
    );
};
