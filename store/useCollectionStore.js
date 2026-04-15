import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCollectionStore = create(
    persist(
        (set, get) => ({
            // --- STATE ---
            myCollection: [],
            isCompactMenu: false,
            collectionGoal: 500,

            availableStatuses: {
                Movies: [
                    "Смотрю",
                    "В планах",
                    "Просмотрено",
                    "Пересматриваю",
                    "Брошено",
                    "Отложено",
                ],
                Books: [
                    "Читаю",
                    "В планах",
                    "Прочитано",
                    "Перечитываю",
                    "Брошено",
                    "Отложено",
                ],
                Games: [
                    "Играю",
                    "В планах",
                    "Прошёл",
                    "Переигрываю",
                    "Брошено",
                    "Отложено",
                ],
            },

            // --- GETTERS (HELPERS) ---
            getStatusesForSection: (section) => {
                const statuses = get().availableStatuses;
                const mapping = {
                    Фильмы: "Movies",
                    Книги: "Books",
                    Игры: "Games",
                };
                const key = mapping[section] || "Movies";
                return statuses[key];
            },

            // --- ACTIONS ---
            setCollectionGoal: (goal) => set({ collectionGoal: goal }),
            setIsCompactMenu: (value) => set({ isCompactMenu: value }),

            addCustomStatus: (section, newStatus) =>
                set((state) => {
                    const mapping = {
                        Фильмы: "Movies",
                        Книги: "Books",
                        Игры: "Games",
                    };
                    const key = mapping[section] || section;

                    return {
                        availableStatuses: {
                            ...state.availableStatuses,
                            [key]: [
                                ...(state.availableStatuses[key] || []),
                                newStatus,
                            ],
                        },
                    };
                }),

            reorderCollection: (newOrder) => set({ myCollection: newOrder }),

            addToCollection: (item) =>
                set((state) => {
                    if (
                        state.myCollection.some(
                            (i) => String(i.id) === String(item.id),
                        )
                    ) {
                        return state;
                    }
                    const newItem = {
                        ...item,
                        parentFolderIds: item.parentFolderIds || [],
                        createdAt: item.createdAt || Date.now(),
                    };
                    return { myCollection: [newItem, ...state.myCollection] };
                }),

            updateCard: (id, updatedFields) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id)
                            ? { ...item, ...updatedFields }
                            : item,
                    ),
                })),

            deleteCard: (id) =>
                set((state) => {
                    const itemToDelete = state.myCollection.find(
                        (i) => String(i.id) === String(id),
                    );
                    if (!itemToDelete) return state;

                    // 1. Удаляем сам элемент
                    let nextCollection = state.myCollection.filter(
                        (item) => String(item.id) !== String(id),
                    );

                    // 2. Если удаляемый объект - папка, чистим ссылки на неё у детей
                    if (itemToDelete.isFolder) {
                        nextCollection = nextCollection.map((item) => ({
                            ...item,
                            parentFolderIds: (
                                item.parentFolderIds || []
                            ).filter((fId) => String(fId) !== String(id)),
                        }));
                    } else {
                        // 3. Если это карточка, чистим её ID из списков сортировки (itemsOrder) внутри папок
                        nextCollection = nextCollection.map((item) => {
                            if (
                                item.isFolder &&
                                item.itemsOrder?.includes(id)
                            ) {
                                return {
                                    ...item,
                                    itemsOrder: item.itemsOrder.filter(
                                        (itemId) =>
                                            String(itemId) !== String(id),
                                    ),
                                };
                            }
                            return item;
                        });
                    }
                    return { myCollection: nextCollection };
                }),

            // --- FOLDER METHODS ---
            createFolder: (folderName, section, status, selectedItemIds) =>
                set((state) => {
                    const folderId = `folder_${Date.now()}`;
                    const newFolder = {
                        id: folderId,
                        title: folderName,
                        isFolder: true,
                        appSection: section,
                        status: status,
                        createdAt: Date.now(),
                        itemsOrder: selectedItemIds,
                        rating: 0,
                        image:
                            state.myCollection.find(
                                (i) => i.id === selectedItemIds[0],
                            )?.image || null,
                    };

                    const updatedCollection = state.myCollection.map((item) =>
                        selectedItemIds.includes(item.id)
                            ? {
                                  ...item,
                                  parentFolderIds: Array.from(
                                      new Set([
                                          ...(item.parentFolderIds || []),
                                          folderId,
                                      ]),
                                  ),
                              }
                            : item,
                    );

                    return { myCollection: [newFolder, ...updatedCollection] };
                }),

            addItemsToFolder: (itemIds, folderId) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) => {
                        if (itemIds.includes(item.id)) {
                            return {
                                ...item,
                                parentFolderIds: Array.from(
                                    new Set([
                                        ...(item.parentFolderIds || []),
                                        folderId,
                                    ]),
                                ),
                            };
                        }
                        return item;
                    }),
                })),

            removeFromFolder: (itemId, folderId) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(itemId)
                            ? {
                                  ...item,
                                  parentFolderIds: (
                                      item.parentFolderIds || []
                                  ).filter((id) => id !== folderId),
                              }
                            : item,
                    ),
                })),

            updateFolderOrder: (folderId, orderedIds) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(folderId)
                            ? { ...item, itemsOrder: orderedIds }
                            : item,
                    ),
                })),
        }),
        {
            name: "user-collection-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
