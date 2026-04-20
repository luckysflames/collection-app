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
    }, [folder?.id, isEditing]);

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

        // Если сохраняем порядок (нажали "Применить" внизу)
        if (saveOnlyOrder || isReordering) {
            if (reorderBuffer && reorderBuffer.length > 0) {
                // reorderBuffer должен содержать полный набор ID в новом порядке
                updates.itemsOrder = reorderBuffer;
            }
        }

        // Если это полное сохранение (верхняя галочка)
        if (!saveOnlyOrder) {
            if (editForm.title.trim().length === 0) return;
            updates.title = editForm.title.trim();
            updates.image = editForm.image;
            updates.description = editForm.description;
            setIsEditing(false);
        }

        updateCard(folder.id, updates);

        // Если были в режиме сортировки — сбрасываем его
        if (isReordering) {
            setIsReordering(false);
            setReorderBuffer([]);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (isReordering) {
            setReorderBuffer([]);
            setIsReordering(false);
        }
    };

    const deleteEverything = () => {
        if (!folder || !folderItems) return;
        folderItems.forEach((item) => deleteCard(item.id));
        deleteCard(folder.id);
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
