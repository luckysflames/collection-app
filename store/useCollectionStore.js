import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUSES,
    SECTION_MAPPING,
} from "../constants";

// Хелпер для получения ключа
const getSectionKey = (section) => SECTION_MAPPING[section] || section;

export const useCollectionStore = create(
    persist(
        (set, get) => ({
            // --- STATE ---
            myCollection: [],
            isCompactMenu: false,
            collectionGoal: 500,
            availableStatuses: {},
            defaultTabs: {
                Movies: "Всё",
                Books: "Всё",
                Games: "Всё",
                Anime: "Всё",
            },
            version: 0,

            incVersion: () => set((state) => ({ version: state.version + 1 })),

            // --- GETTERS ---
            getStatusesForSection: (section) => {
                const key = getSectionKey(section);
                const saved = get().availableStatuses[key];

                let baseList =
                    saved && saved.length > 0
                        ? saved
                        : [...(DEFAULT_STATUSES[key] || [])];

                // ПРИНУДИТЕЛЬНАЯ ПРОВЕРКА (чтобы появились у старых пользователей)
                const mandatory = ["Всё", "Папки", DEFAULT_FALLBACK_STATUS];
                mandatory.forEach((status) => {
                    if (!baseList.includes(status)) {
                        baseList = [status, ...baseList];
                    }
                });

                return baseList;
            },

            // --- ACTIONS ---
            setCollectionGoal: (goal) => set({ collectionGoal: goal }),
            setIsCompactMenu: (value) => set({ isCompactMenu: value }),

            setDefaultTab: (section, status) => {
                const key = getSectionKey(section);
                set((state) => ({
                    defaultTabs: {
                        ...state.defaultTabs,
                        [key]: status,
                    },
                    version: state.version + 1,
                }));
            },

            setStatusesForSection: (section, newStatuses) => {
                const key = getSectionKey(section);
                set((state) => ({
                    availableStatuses: {
                        ...state.availableStatuses,
                        [key]: newStatuses,
                    },
                    version: state.version + 1,
                }));
            },

            addCustomStatus: (section, newStatus) => {
                const key = getSectionKey(section);
                const current = get().getStatusesForSection(section);

                if (current.includes(newStatus)) return;

                set((state) => ({
                    availableStatuses: {
                        ...state.availableStatuses,
                        [key]: [...current, newStatus],
                    },
                    version: state.version + 1,
                }));
            },

            removeCustomStatus: (section, statusToDelete) => {
                const systemStatuses = [
                    "Всё",
                    "Папки",
                    DEFAULT_FALLBACK_STATUS,
                ];
                if (systemStatuses.includes(statusToDelete)) return;

                const key = getSectionKey(section);
                const currentStatuses = get().getStatusesForSection(section);
                const nextStatuses = currentStatuses.filter(
                    (s) => s !== statusToDelete,
                );

                set((state) => {
                    // Если удаляемый статус был дефолтным, сбрасываем на "Всё"
                    const isDefault = state.defaultTabs[key] === statusToDelete;
                    const nextDefaultTabs = isDefault
                        ? { ...state.defaultTabs, [key]: "Всё" }
                        : state.defaultTabs;

                    return {
                        availableStatuses: {
                            ...state.availableStatuses,
                            [key]: nextStatuses,
                        },
                        defaultTabs: nextDefaultTabs,
                        myCollection: state.myCollection.map((item) =>
                            item.appSection === section &&
                            item.status === statusToDelete
                                ? { ...item, status: DEFAULT_FALLBACK_STATUS }
                                : item,
                        ),
                        version: state.version + 1,
                    };
                });
            },

            // --- COLLECTION CRUD ---
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
                        // Если статус не передан, ставим дефолтный
                        status: item.status || DEFAULT_FALLBACK_STATUS,
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

                    let nextCollection = state.myCollection.filter(
                        (i) => String(i.id) !== String(id),
                    );

                    if (itemToDelete.isFolder) {
                        nextCollection = nextCollection.map((i) => ({
                            ...i,
                            parentFolderIds: (i.parentFolderIds || []).filter(
                                (fId) => String(fId) !== String(id),
                            ),
                        }));
                    } else {
                        nextCollection = nextCollection.map((i) =>
                            i.isFolder && i.itemsOrder?.includes(id)
                                ? {
                                      ...i,
                                      itemsOrder: i.itemsOrder.filter(
                                          (itemId) =>
                                              String(itemId) !== String(id),
                                      ),
                                  }
                                : i,
                        );
                    }
                    return { myCollection: nextCollection };
                }),

            reorderCollection: (newOrder) => set({ myCollection: newOrder }),

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
