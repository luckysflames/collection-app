import { useEffect, useState, useCallback } from "react";
import { Dimensions } from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { useImagePicker } from "./useImagePicker";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;
const cardHeight = 280;

export const useFolderActions = (
    folder,
    folderItems,
    isReordering,
    reorderBuffer,
    setIsReordering,
    setReorderBuffer,
) => {
    const { updateCard, deleteCard } = useCollectionStore();
    const { pickImage: openPicker } = useImagePicker();
    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        title: "",
        image: null,
        description: "",
    });

    // Синхронизация формы только при смене папки или начале редактирования
    useEffect(() => {
        if (folder && isEditing) {
            setEditForm({
                title: folder.title || "",
                image: folder.image || null,
                description: folder.description || "",
            });
        }
    }, [folder, isEditing]);

    const updateField = useCallback((field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const pickImage = async () => {
        const uri = await openPicker([cardWidth, cardHeight]);
        if (uri) updateField("image", uri);
    };

    // Универсальный метод сохранения
    const handleSave = (saveOnlyOrder = false) => {
        if (!folder) return;

        const updates = {};

        // 1. Собираем изменения порядка, если они есть
        if (saveOnlyOrder || isReordering) {
            if (reorderBuffer && reorderBuffer.length > 0) {
                updates.itemsOrder = reorderBuffer;
            }
            setIsReordering(false);
            setReorderBuffer([]);
        }

        // 2. ВСЕГДА добавляем данные из формы (даже если нажали только порядок)
        // Это гарантирует, что набранный текст не пропадет
        if (editForm.title.trim().length > 0) {
            updates.title = editForm.title.trim();
            updates.image = editForm.image;
            updates.description = editForm.description;
        }

        // 3. Выполняем ОДИН общий апдейт в стор
        if (Object.keys(updates).length > 0) {
            updateCard(folder.id, updates);
        }

        // 4. Всегда выходим из режима редактирования
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (isReordering) {
            setReorderBuffer([]);
            setIsReordering(false);
        }
    };

    const deleteEverything = () => {
        // Делаем копию ID и айтемов ДО удаления, чтобы не зависеть от состояния folder
        const currentFolderId = folder?.id;
        const itemsToDelete = [...folderItems];

        if (!currentFolderId) return;

        navigation.goBack(); // Навигация должна быть первой

        // Небольшая задержка, чтобы экран успел размонтироваться
        setTimeout(() => {
            itemsToDelete.forEach((item) => deleteCard(item.id));
            deleteCard(currentFolderId);
        }, 100);
    };

    const deleteFolderOnly = () => {
        if (!folder) return;
        folderItems.forEach((item) => {
            const newFolders = (item.parentFolderIds || []).filter(
                (id) => String(id) !== String(folder.id),
            );
            updateCard(item.id, { parentFolderIds: newFolders });
        });
        deleteCard(folder.id);
    };

    return {
        isEditing,
        setIsEditing,
        editForm,
        updateField,
        pickImage,
        handleSave,
        handleCancel,
        deleteEverything,
        deleteFolderOnly,
    };
};
