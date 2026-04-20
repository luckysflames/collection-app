import { useMemo } from "react";
import { useCollectionStore } from "../store/useCollectionStore";

export const useFolderData = (folderId) => {
    const { myCollection } = useCollectionStore();

    const folder = useMemo(
        () => myCollection.find((item) => item.id === folderId),
        [myCollection, folderId],
    );

    const folderItems = useMemo(
        () =>
            myCollection.filter((item) =>
                item.parentFolderIds?.includes(folderId),
            ),
        [myCollection, folderId],
    );

    const availableItems = useMemo(() => {
        if (!folder) return [];
        return myCollection.filter(
            (item) =>
                !item.isFolder &&
                item.appSection === folder.appSection &&
                !item.parentFolderIds?.includes(folderId),
        );
    }, [myCollection, folder, folderId]);

    return { folder, folderItems, availableItems };
};
