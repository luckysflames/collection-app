import { useMemo } from "react";
import { FAVORITE_STATUS } from "../constants";

export const useCollectionCounter = (
    myCollection,
    currentSection,
    activeCategory,
    showFoldersOnly,
) => {
    return useMemo(() => {
        const items = myCollection.filter(
            (item) => item.appSection === currentSection,
        );

        if (activeCategory === "Всё") {
            return items.filter((i) =>
                showFoldersOnly
                    ? i.isFolder || !i.parentFolderIds?.length
                    : !i.isFolder,
            ).length;
        }

        if (activeCategory === "Папки") {
            return items.filter((i) => i.isFolder).length;
        }

        if (activeCategory === FAVORITE_STATUS) {
            const favorites = items.filter((i) => i.isFavorite);
            return showFoldersOnly
                ? favorites.length
                : favorites.filter((i) => !i.isFolder).length;
        }

        const statusItems = items.filter((i) => i.status === activeCategory);
        if (showFoldersOnly) {
            return statusItems.filter((item) => {
                if (item.isFolder) return true;
                const hasSameStatusParent = item.parentFolderIds?.some(
                    (parentId) => {
                        const parent = myCollection.find(
                            (d) => d.id === parentId,
                        );
                        return parent && parent.status === activeCategory;
                    },
                );
                return !hasSameStatusParent;
            }).length;
        }

        return statusItems.filter((i) => !i.isFolder).length;
    }, [myCollection, currentSection, activeCategory, showFoldersOnly]);
};
