import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCollectionStore = create(
    persist(
        (set) => ({
            myCollection: [],

            addToCollection: (item) =>
                set((state) => {
                    if (state.myCollection.find((i) => i.id === item.id))
                        return state;
                    return { myCollection: [item, ...state.myCollection] };
                }),

            updateCard: (id, updatedFields) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id)
                            ? { ...item, ...updatedFields }
                            : item,
                    ),
                })),

            removeFromCollection: (id) =>
                set((state) => ({
                    myCollection: state.myCollection.filter(
                        (item) => String(item.id) !== String(id),
                    ),
                })),
        }),
        {
            name: "user-collection-storage", // уникальное имя ключа в памяти
            storage: createJSONStorage(() => AsyncStorage), // используем AsyncStorage для сохранения
        },
    ),
);
