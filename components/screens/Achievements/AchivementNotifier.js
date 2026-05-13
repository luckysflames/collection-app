import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WarnModal } from "../../ui/WarnModal";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { calculateAchievements } from "../../../utils/calculateAchievements";
import { AchievementToast } from "./AchivementToast";

export const AchivementNotifier = () => {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const {
        achievementQueue,
        showAchievement,
        dismissAchievement,
        shownAchievements,
        resetAchievementNotification,
    } = useNotificationStore();

    const currentAchievement = achievementQueue[0] || null;

    React.useEffect(() => {
        const achievements = calculateAchievements(myCollection);

        achievements.forEach((achievement) => {
            const isCompleted = achievement.isCompleted;
            const wasShown = shownAchievements.includes(achievement.id);
            const isInQueue = achievementQueue.some(
                (item) => item.id === achievement.id,
            );

            // СЛУЧАЙ 1: Ачивка только что выполнена и еще не была показана
            if (isCompleted && !wasShown && !isInQueue) {
                showAchievement(achievement);
            }

            // СЛУЧАЙ 2: Условие ачивки откатилось (например, удалил аниме)
            // Мы "забываем", что показывали её, чтобы при повторном выполнении она опять вылезла
            if (!isCompleted && wasShown) {
                resetAchievementNotification(achievement.id);
            }
        });
    }, [myCollection]); // Убрали лишние зависимости, чтобы не было циклов

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
