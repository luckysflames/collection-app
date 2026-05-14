import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sqliteZustandStorage } from "../utils/sqliteStorage";

export const useNotificationStore = create(
    persist(
        (set) => ({
            achievementQueue: [],
            shownAchievements: [],

            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            showAchievement: (achievement) =>
                set((state) => ({
                    achievementQueue: [...state.achievementQueue, achievement],
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

            resetAchievementNotification: (id) =>
                set((state) => ({
                    shownAchievements: state.shownAchievements.filter(
                        (aid) => aid !== id,
                    ),
                })),
        }),
        {
            name: "notification-storage",
            storage: createJSONStorage(() => sqliteZustandStorage),
            partialize: (state) => ({
                shownAchievements: state.shownAchievements,
            }),
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        },
    ),
);
