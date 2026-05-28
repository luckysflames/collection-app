import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sqliteZustandStorage } from "../utils/sqliteStorage";

import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUSES,
    SECTION_MAPPING,
    FAVORITE_STATUS,
    DEFAULT_STATUS_BY_SECTION,
    DEFAULT_CATEGORY_ORDER,
    getOrderedCategories,
} from "../constants/index";
import { deletePersistentImageAsync, isPersistentImageUri } from "../utils/imageStorage";

// --- HELPERS ---
const getSectionKey = (section) => SECTION_MAPPING[section] || section;

export const useCollectionStore = create(
    persist(
        (set, get) => ({
            // --- STATE ---
            myCollection: [],
            _hasHydrated: false,
            isCompactMenu: true,
            isVibration: true,
            isSound: true,
            collectionGoal: 500,
            availableStatuses: {},
            defaultTabs: {
                Movies: "Всё",
                Books: "Всё",
                Games: "Всё",
                Anime: "Всё",
                TV: "Всё",
            },
            defaultSorts: {
                Movies: "date_desc",
                Books: "date_desc",
                Games: "date_desc",
                Anime: "date_desc",
                TV: "date_desc",
            },
            categoryOrder: DEFAULT_CATEGORY_ORDER,
            deletionPassword: null,
            version: 0,
            activeRainScreens: [],

            // --- SYSTEM ACTIONS ---
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            incVersion: () => set((state) => ({ version: state.version + 1 })),
            setRaining: (id, isActive) =>
                set((state) => {
                    const exists = state.activeRainScreens.includes(id);

                    if (isActive && !exists) {
                        return {
                            activeRainScreens: [...state.activeRainScreens, id],
                        };
                    }
                    if (!isActive && exists) {
                        return {
                            activeRainScreens: state.activeRainScreens.filter(
                                (screenId) => screenId !== id,
                            ),
                        };
                    }
                    return state;
                }),

            isRainGlobalActive: (state) => state.activeRainScreens.length > 0,

            // --- GETTERS ---
            getStatusesForSection: (section) => {
                const key = getSectionKey(section);
                const saved = get().availableStatuses[key];

                let baseList =
                    saved && saved.length > 0 ? saved : [...(DEFAULT_STATUSES[key] || [])];

                // Принудительные статусы для обратной совместимости
                const mandatory = ["Всё", "Папки", FAVORITE_STATUS];
                mandatory.forEach((status) => {
                    if (!baseList.includes(status)) {
                        baseList = [status, ...baseList];
                    }
                });

                return baseList;
            },

            // --- GENERAL SETTINGS ---
            setCollectionGoal: (goal) => set({ collectionGoal: goal }),
            setIsCompactMenu: (value) => set({ isCompactMenu: value }),
            setIsVibration: (value) => set({ isVibration: value }),
            setIsSound: (value) => set({ isSound: value }),

            // --- PASSWORD MANAGEMENT ---
            setDeletionPassword: (newPassword) => set({ deletionPassword: newPassword }),
            removePassword: () => set({ deletionPassword: null }),
            changePassword: (oldPassword, newPassword) => {
                const current = get().deletionPassword;
                if (!current || oldPassword === current) {
                    set({ deletionPassword: newPassword });
                    return { success: true };
                }
                return { success: false, error: "Неверный старый пароль" };
            },

            // --- STATUS & TAB MANAGEMENT ---
            setDefaultTab: (section, status) => {
                const key = getSectionKey(section);
                set((state) => ({
                    defaultTabs: { ...state.defaultTabs, [key]: status },
                    version: state.version + 1,
                }));
            },

            setDefaultSort: (section, sortType) => {
                const key = getSectionKey(section);
                set((state) => ({
                    defaultSorts: { ...state.defaultSorts, [key]: sortType },
                    version: state.version + 1,
                }));
            },

            setCategoryOrder: (newCategoryOrder) =>
                set((state) => ({
                    categoryOrder: newCategoryOrder,
                    version: state.version + 1,
                })),

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
                const protectedStatuses = ["Всё", "Папки", FAVORITE_STATUS];
                if (protectedStatuses.includes(statusToDelete)) return;

                const key = getSectionKey(section);
                const currentStatuses = get().getStatusesForSection(section);
                const nextStatuses = currentStatuses.filter((s) => s !== statusToDelete);

                set((state) => {
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
                            item.appSection === section && item.status === statusToDelete
                                ? {
                                      ...item,
                                      status: null,
                                  }
                                : item,
                        ),
                        version: state.version + 1,
                    };
                });
            },

            // --- COLLECTION CRUD ---
            addToCollection: (item) =>
                set((state) => {
                    const exists = state.myCollection.some((i) => String(i.id) === String(item.id));
                    if (exists) return state;

                    const newItem = {
                        ...item,
                        status: item.status,
                        isFavorite: item.isFavorite || false,
                        userScore: item.userScore || 0,
                        parentFolderIds: item.parentFolderIds || [],
                        createdAt: item.createdAt || Date.now(),
                    };
                    return { myCollection: [newItem, ...state.myCollection] };
                }),

            updateCard: (id, updatedFields) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id) ? { ...item, ...updatedFields } : item,
                    ),
                    version: state.version + 1,
                })),

            setUserScore: (id, score) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id)
                            ? {
                                  ...item,
                                  userScore: Math.max(0, Math.min(10, score)),
                              }
                            : item,
                    ),
                })),

            setFavorite: (id, value) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(id) ? { ...item, isFavorite: value } : item,
                    ),
                })),

            deleteCard: (id) => {
                const state = get();
                const itemToDelete = state.myCollection.find((i) => String(i.id) === String(id));
                if (!itemToDelete) return;

                let nextCollection = state.myCollection.filter((i) => String(i.id) !== String(id));

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
                                      (itemId) => String(itemId) !== String(id),
                                  ),
                              }
                            : i,
                    );
                }

                set({ myCollection: nextCollection });

                if (itemToDelete.image && isPersistentImageUri(itemToDelete.image)) {
                    const isReferencedElsewhere = state.myCollection.some(
                        (item) =>
                            String(item.id) !== String(id) && item.image === itemToDelete.image,
                    );

                    if (!isReferencedElsewhere) {
                        deletePersistentImageAsync(itemToDelete.image);
                    }
                }
            },

            reorderCollection: (newOrder) => set({ myCollection: newOrder }),

            // --- FOLDER METHODS ---
            createFolder: (folderName, section, status, selectedItemIds) =>
                set((state) => {
                    // 1. Проверяем, существует ли папка с таким же именем в этом разделе
                    // (Обычно уникальность проверяют внутри одного appSection)
                    const isDuplicate = state.myCollection.some(
                        (item) =>
                            item.isFolder &&
                            item.appSection === section &&
                            item.title.trim().toLowerCase() === folderName.trim().toLowerCase(),
                    );

                    // 2. Если дубликат найден, можно либо прервать выполнение,
                    // либо модифицировать имя. Вот пример с добавлением (1), (2) и т.д.
                    let finalName = folderName;
                    if (isDuplicate) {
                        let counter = 1;
                        while (
                            state.myCollection.some(
                                (item) =>
                                    item.isFolder &&
                                    item.appSection === section &&
                                    item.title.toLowerCase() ===
                                        `${folderName} (${counter})`.toLowerCase(),
                            )
                        ) {
                            counter++;
                        }
                        finalName = `${folderName} (${counter})`;
                    }

                    const folderId = `folder_${Date.now()}`;
                    const shouldBeFavorite = status === FAVORITE_STATUS;

                    const newFolder = {
                        id: folderId,
                        title: finalName,
                        isFolder: true,
                        appSection: section,
                        status: shouldBeFavorite ? null : status,
                        isFavorite: shouldBeFavorite,
                        createdAt: Date.now(),
                        itemsOrder: selectedItemIds,
                        userScore: 0,
                        image:
                            state.myCollection.find((i) => i.id === selectedItemIds[0])?.image ||
                            null,
                    };

                    const updatedCollection = state.myCollection.map((item) =>
                        selectedItemIds.includes(item.id)
                            ? {
                                  ...item,
                                  parentFolderIds: Array.from(
                                      new Set([...(item.parentFolderIds || []), folderId]),
                                  ),
                              }
                            : item,
                    );

                    return { myCollection: [newFolder, ...updatedCollection] };
                }),

            addItemsToFolder: (itemIds, folderId) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        itemIds.includes(item.id)
                            ? {
                                  ...item,
                                  parentFolderIds: Array.from(
                                      new Set([...(item.parentFolderIds || []), folderId]),
                                  ),
                              }
                            : item,
                    ),
                })),

            removeFromFolder: (itemId, folderId) =>
                set((state) => ({
                    myCollection: state.myCollection.map((item) =>
                        String(item.id) === String(itemId)
                            ? {
                                  ...item,
                                  parentFolderIds: (item.parentFolderIds || []).filter(
                                      (id) => id !== folderId,
                                  ),
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

            // --- RESET ACTIONS ---
            clearCollection: async () => {
                const state = get();
                const imageUris = Array.from(
                    new Set(
                        state.myCollection.map((item) => item.image).filter(isPersistentImageUri),
                    ),
                );

                set({ myCollection: [], version: state.version + 1 });

                await Promise.all(imageUris.map((uri) => deletePersistentImageAsync(uri)));
            },

            setMyCollection: (newCollection) =>
                set({
                    myCollection: newCollection,
                    version: get().version + 1,
                }),

            resetAllStatuses: () =>
                set((state) => ({
                    availableStatuses: {},
                    defaultTabs: {
                        Movies: "Всё",
                        Books: "Всё",
                        Games: "Всё",
                        Anime: "Всё",
                    },
                    defaultSorts: {
                        Movies: "date_desc",
                        Books: "date_desc",
                        Games: "date_desc",
                        Anime: "date_desc",
                    },
                    categoryOrder: DEFAULT_CATEGORY_ORDER,
                    categoryOrder: DEFAULT_CATEGORY_ORDER,
                    version: state.version + 1,
                })),

            resetFullStore: async () => {
                const state = get();
                const imageUris = Array.from(
                    new Set(
                        state.myCollection.map((item) => item.image).filter(isPersistentImageUri),
                    ),
                );

                (set({
                    myCollection: [],
                    isCompactMenu: true,
                    collectionGoal: 500,
                    availableStatuses: {},
                    defaultTabs: {
                        Movies: "Всё",
                        Books: "Всё",
                        Games: "Всё",
                        Anime: "Всё",
                    },
                    defaultSorts: {
                        Movies: "date_desc",
                        Books: "date_desc",
                        Games: "date_desc",
                        Anime: "date_desc",
                    },
                    version: 0,
                }),
                    await Promise.all(imageUris.map((uri) => deletePersistentImageAsync(uri))));
            },
        }),
        {
            name: "user-collection-storage",
            storage: createJSONStorage(() => sqliteZustandStorage),
            partialize: (state) => {
                const { activeRainScreens, ...rest } = state;
                return rest;
            },
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            },
        },
    ),
);
