import { useEffect, useState } from "react";
import { Dimensions } from "react-native"; // Добавляем импорт для расчета
import * as ImagePicker from "expo-image-picker";
import { useCollectionStore } from "../store/useCollectionStore";
import { useImagePicker } from "./useImagePicker";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;
const cardHeight = 280;

export const useFolderActions = (folder, folderItems) => {
    const { updateCard, deleteCard } = useCollectionStore();
    const { pickImage: openPicker } = useImagePicker();
    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        title: folder?.title || "",
        image: folder?.image || null,
        description: folder?.description || "",
    });

    // Синхронизируем форму с данными папки при входе или сбросе
    useEffect(() => {
        if (folder) {
            setEditForm({
                title: folder.title || "",
                image: folder.image || null,
                description: folder.description || "",
            });
        }
    }, [folder, isEditing]);

    const updateField = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const pickImage = async () => {
        const uri = await openPicker([cardWidth, cardHeight]);
        if (uri) {
            updateField("image", uri);
        }
    };

    const handleSave = () => {
        if (editForm.title.trim().length === 0) return;
        updateCard(folder.id, {
            title: editForm.title.trim(),
            image: editForm.image,
            description: editForm.description,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({
            title: folder.title,
            image: folder.image,
            description: folder.description,
        });
        setIsEditing(false);
    };

    const deleteEverything = () => {
        if (!folder || !folderItems) return; // Добавь проверку на folderItems

        folderItems.forEach((item) => deleteCard(item.id));
        deleteCard(folder.id);
    };

    const deleteFolderOnly = () => {
        folderItems.forEach((item) => {
            // Исправляем: у тебя в сторе parentFolderIds (массив), а не parentId
            const newFolders = (item.parentFolderIds || []).filter(
                (id) => id !== folder.id,
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
        deleteEverything, // Экспортируем методы
        deleteFolderOnly,
    };
};
