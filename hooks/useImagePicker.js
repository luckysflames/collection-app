import * as ImagePicker from "expo-image-picker";
import { useCollectionStore } from "../store/useCollectionStore";
import {
    savePersistentImageAsync,
    deletePersistentImageAsync,
    isPersistentImageUri,
} from "../utils/imageStorage";

export const useImagePicker = () => {
    const pickImage = async (
        aspect = [3, 4],
        oldImageUri = null,
        ignoreItemId = null,
    ) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Извините, нам нужны разрешения на доступ к галерее!");
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect,
            quality: 1,
        });

        if (result.canceled) {
            return null;
        }

        const selectedUri = result.assets[0].uri;
        const savedUri = await savePersistentImageAsync(selectedUri);

        if (
            oldImageUri &&
            oldImageUri !== savedUri &&
            isPersistentImageUri(oldImageUri)
        ) {
            const collection = useCollectionStore.getState().myCollection;
            const isReferencedElsewhere = collection.some(
                (item) =>
                    item.image === oldImageUri &&
                    String(item.id) !== String(ignoreItemId),
            );

            if (!isReferencedElsewhere) {
                await deletePersistentImageAsync(oldImageUri);
            }
        }

        return savedUri;
    };

    return { pickImage };
};
