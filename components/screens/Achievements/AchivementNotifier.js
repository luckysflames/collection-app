import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WarnModal } from "../../ui/WarnModal";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { calculateAchievements } from "../../../utils/achievements/index";
import { AchievementToast } from "./AchivementToast";

export const AchivementNotifier = () => {
    const myCollection = useCollectionStore((state) => state.myCollection);

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

            // Кейс один и единственный: Выполнил условия прямо сейчас,
            // но никогда раньше эту ачивку не получал и её нет в очереди
            if (isCompletedNow && !wasShownBefore && !isInQueue) {
                showAchievement({
                    ...achievement,
                    isCompleted: true,
                    current: achievement.target,
                });
            }
        });
    }, [myCollection, _hasHydrated, shownAchievements, achievementQueue]);

    if (!currentAchievement) return null;

    return (
        <AchievementToast
            key={currentAchievement.id}
            achievement={currentAchievement}
            onDismiss={dismissAchievement}
        />
    );
};

const styles = StyleSheet.create({
    achievementInfo: {
        width: "100%",
        alignItems: "center",
        marginBottom: 6,
    },
    achievementTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },
});
