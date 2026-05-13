import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useNotificationStore = create(
    persist(
        (set) => ({
            achievementQueue: [],
            // Храним ID ачивок, которые мы уже "отпищали"
            shownAchievements: [],

            showAchievement: (achievement) =>
                set((state) => ({
                    achievementQueue: [...state.achievementQueue, achievement],
                    // Добавляем в список показанных, чтобы не спамить при перезаходе
                    shownAchievements: [
                        ...new Set([
                            ...state.shownAchievements,
                            achievement.id,
                        ]),
                    ],
                })),

            dismissAchievement: () =>
                set((state) => ({
                    achievementQueue: state.achievementQueue.slice(1),
                })),

            // Метод для "сброса" ачивки (если ты откатил условие)
            resetAchievementNotification: (id) =>
                set((state) => ({
                    shownAchievements: state.shownAchievements.filter(
                        (aid) => aid !== id,
                    ),
                })),
        }),
        {
            name: "notification-storage",
            storage: createJSONStorage(() => AsyncStorage),
            // Мы сохраняем ТОЛЬКО список показанных, саму очередь сохранять не обязательно
            partialize: (state) => ({
                shownAchievements: state.shownAchievements,
            }),
        },
    ),
);
