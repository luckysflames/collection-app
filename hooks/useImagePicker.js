import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
    const pickImage = async (aspect = [3, 4]) => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Извините, нам нужны разрешения на доступ к галерее!");
            return null;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: aspect,
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        }

        return null;
    };

    return { pickImage };
};
