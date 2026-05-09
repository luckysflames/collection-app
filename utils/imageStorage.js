import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

export const IMAGES_DIR = `${FileSystem.documentDirectory}images/`;
export const LOCAL_IMAGE_TAG = "LOCAL_IMAGE:";
const IMAGE_WIDTH = 720;
const IMAGE_QUALITY = 0.7;

export const ensureImagesDirectoryAsync = async () => {
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, {
            intermediates: true,
        });
    }
};

export const isPersistentImageUri = (uri) =>
    typeof uri === "string" && uri.startsWith(IMAGES_DIR);

export const getLocalImageName = (uri) => {
    if (!uri || typeof uri !== "string") return null;
    if (uri.startsWith(LOCAL_IMAGE_TAG)) {
        return uri.slice(LOCAL_IMAGE_TAG.length);
    }
    return uri.split("/").pop();
};

export const getImageFileUri = (fileName) => `${IMAGES_DIR}${fileName}`;

export const getLocalImageReference = (uri) => {
    const fileName = getLocalImageName(uri);
    return fileName ? `${LOCAL_IMAGE_TAG}${fileName}` : null;
};

export const savePersistentImageAsync = async (sourceUri) => {
    await ensureImagesDirectoryAsync();

    const fileName = `image_${Date.now()}_${Math.floor(
        Math.random() * 10000,
    )}.jpg`;
    const destinationUri = getImageFileUri(fileName);

    const result = await ImageManipulator.manipulateAsync(
        sourceUri,
        [{ resize: { width: IMAGE_WIDTH } }],
        {
            compress: IMAGE_QUALITY,
            format: ImageManipulator.SaveFormat.JPEG,
        },
    );

    await FileSystem.moveAsync({
        from: result.uri,
        to: destinationUri,
    });

    return destinationUri;
};

export const deletePersistentImageAsync = async (uri) => {
    if (!isPersistentImageUri(uri)) return;

    try {
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        }
    } catch (error) {
        console.warn("Failed to delete persistent image:", error);
    }
};

export const collectImageFilesForZip = async (items) => {
    const imagePathsToCopy = [];

    const collection = items.map((item) => {
        let image = item.image;
        if (isPersistentImageUri(image)) {
            const fileName = getLocalImageName(image);
            imagePathsToCopy.push({
                fullUri: image,
                fileName: fileName,
            });
            // В JSON сохраняем только метку
            image = `${LOCAL_IMAGE_TAG}${fileName}`;
        }
        return { ...item, image };
    });

    return { collection, imagePathsToCopy };
};

// Функция для перемещения картинок из временной папки распаковки в основную
export const moveImagesFromTemp = async (tempFolderUri) => {
    await ensureImagesDirectoryAsync();
    const files = await FileSystem.readDirectoryAsync(tempFolderUri);
    const restoredMap = new Map();

    for (const fileName of files) {
        const from = `${tempFolderUri}${fileName}`;
        const to = `${IMAGES_DIR}${fileName}`;

        // Проверяем, нет ли там уже такого файла, чтобы не поймать ошибку записи
        const checkTarget = await FileSystem.getInfoAsync(to);
        if (checkTarget.exists) {
            await FileSystem.deleteAsync(to);
        }

        await FileSystem.copyAsync({ from, to });
        restoredMap.set(`${LOCAL_IMAGE_TAG}${fileName}`, to);
    }
    return restoredMap;
};

export const restoreCollectionImageUris = (items, restoredMap) =>
    items.map((item) => {
        let image = item.image;
        if (typeof image === "string" && image.startsWith(LOCAL_IMAGE_TAG)) {
            image = restoredMap.get(image) || image;
        }
        return { ...item, image };
    });
