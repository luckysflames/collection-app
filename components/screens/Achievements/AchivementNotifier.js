import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WarnModal } from "../../ui/WarnModal";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { useNotificationStore } from "../../../store/useNotificationStore";
import { calculateAchievements } from "../../../utils/calculateAchievements";
import { AchievementToast } from "./AchivementToast";

export const AchivementNotifier = () => {
    const myCollection = useCollectionStore((state) => state.myCollection);

    // Подписываемся на нужные части стора уведомлений
    const _hasHydrated = useNotificationStore((state) => state._hasHydrated);
    const achievementQueue = useNotificationStore(
        (state) => state.achievementQueue,
    );
    const shownAchievements = useNotificationStore(
        (state) => state.shownAchievements,
    );

    const showAchievement = useNotificationStore(
        (state) => state.showAchievement,
    );
    const dismissAchievement = useNotificationStore(
        (state) => state.dismissAchievement,
    );
    const resetAchievementNotification = useNotificationStore(
        (state) => state.resetAchievementNotification,
    );

    const currentAchievement = achievementQueue[0] || null;

    React.useEffect(() => {
        // Если AsyncStorage еще не прочитан — ничего не считаем!
        if (!_hasHydrated) return;

        const achievements = calculateAchievements(myCollection);

        achievements.forEach((achievement) => {
            const isCompleted = achievement.isCompleted;
            const wasShown = shownAchievements.includes(achievement.id);
            const isInQueue = achievementQueue.some(
                (item) => item.id === achievement.id,
            );

            // Кейс 1: Выполнил и не видел
            if (isCompleted && !wasShown && !isInQueue) {
                showAchievement(achievement);
            }

            // Кейс 2: Потерял ачивку (удаление данных)
            if (!isCompleted && wasShown) {
                resetAchievementNotification(achievement.id);
            }
        });
    }, [myCollection, _hasHydrated]); // Добавляем _hasHydrated в зависимости

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
