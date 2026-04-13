import { useCollectionStore } from "../store/useCollectionStore";

export const useDetailsActions = (item, displayData, category) => {
    const { myCollection, addToCollection, updateCard, deleteCard } =
        useCollectionStore();

    const savedItem = myCollection.find(
        (fav) => String(fav.id) === String(item.id),
    );
    const isInCollection = !!savedItem;

    // Поиск подходящих папок для текущей секции (Фильмы/Аниме и т.д.)
    const currentSection = category || item.appSection || "Фильмы";
    const existingFolders = myCollection.filter((i) => {
        if (!i.isFolder) return false;
        const folderSection = String(i.appSection || "")
            .trim()
            .toLowerCase();
        const activeSection = String(currentSection).trim().toLowerCase();
        return folderSection === activeSection;
    });

    // Логика добавления/удаления из папки (Toggle)
    const handleAddToFolder = (folderId) => {
        if (!isInCollection) {
            // Если айтема еще нет в коллекции, добавляем его сразу с массивом папок
            addToCollection({
                ...item,
                ...displayData,
                status: displayData.status || "В планах",
                appSection: currentSection,
                parentFolderIds: [folderId], // Сразу создаем массив
            });
        } else {
            // Если айтем уже в коллекции, работаем с массивом ID папок
            const currentFolders = savedItem.parentFolderIds || [];
            let newFolderIds;

            if (currentFolders.includes(folderId)) {
                // Если уже есть в этой папке — удаляем из неё
                newFolderIds = currentFolders.filter((id) => id !== folderId);
            } else {
                // Если нет — добавляем в массив
                newFolderIds = [...currentFolders, folderId];
            }

            // Обновляем карточку в сторе
            updateCard(item.id, { parentFolderIds: newFolderIds });
        }
    };

    // Обновление статуса
    const handleStatusUpdate = (newStatus) => {
        if (isInCollection) {
            updateCard(item.id, { status: newStatus });
        } else {
            addToCollection({
                ...item,
                ...displayData,
                status: newStatus,
                appSection: currentSection,
                parentFolderIds: [], // Инициализируем пустым массивом
            });
        }
    };

    return {
        savedItem,
        isInCollection,
        existingFolders,
        handleAddToFolder,
        handleStatusUpdate,
        updateCard,
        deleteCard,
    };
};
