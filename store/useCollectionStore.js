import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useCollectionStore = create(
    persist(
        (set) => ({
            myCollection: [],
            isCompactMenu: false,

            // Метод для обновления всего массива (после перетаскивания)
            reorderCollection: (newOrder) => set({ myCollection: newOrder }),

            setIsCompactMenu: (value) => set({ isCompactMenu: value }),

            addToCollection: (item) =>
                set((state) => {
                    if (state.myCollection.find((i) => i.id === item.id))
                        return state;

                    const newItem = {
                        ...item,
                        createdAt: item.createdAt || Date.now(),
                    };

                    return { myCollection: [newItem, ...state.myCollection] };
                }),

            // --- МЕТОДЫ ДЛЯ ПАПОК ---

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

            // Массовое добавление карточек в папку
            addItemsToFolder: (itemIds, folderId) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) => {
                        if (itemIds.includes(item.id)) {
                            const currentParents = item.parentFolderIds || [];
                            return {
                                ...item,
                                parentFolderIds: Array.from(
                                    new Set([...currentParents, folderId]),
                                ),
                            };
                        }
                        return item;
                    }),
                })),

            updateFolderOrder: (folderId, orderedIds) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        item.id === folderId
                            ? { ...item, itemsOrder: orderedIds }
                            : item,
                    ),
                })),

            // Удаление карточки из конкретной папки
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

            deleteCard: (id) =>
                set((state) => {
                    const itemToDelete = state.myCollection.find(
                        (i) => String(i.id) === String(id),
                    );

                    if (!itemToDelete) return state;

                    // 1. Удаляем сам элемент из коллекции
                    let nextCollection = state.myCollection.filter(
                        (item) => String(item.id) !== String(id),
                    );

                    // 2. Если удаляли ПАПКУ — чистим упоминание этой папки во всех карточках
                    if (itemToDelete.isFolder) {
                        nextCollection = nextCollection.map((item) => ({
                            ...item,
                            parentFolderIds: (
                                item.parentFolderIds || []
                            ).filter(
                                (folderId) => String(folderId) !== String(id),
                            ),
                        }));
                    }

                    // Логика удаления айтема, который был в папке,
                    // теперь не требует чистки itemIds внутри папки,
                    // так как мы строим список динамически через фильтрацию по parentFolderIds.

                    return { myCollection: nextCollection };
                }),

            updateCard: (id, updatedFields) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id)
                            ? { ...item, ...updatedFields }
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
