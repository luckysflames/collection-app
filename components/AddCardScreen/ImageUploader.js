import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ImageUploader({ image, onImagePick }) {
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 3],
            quality: 0.7,
        });
        if (!result.canceled) onImagePick(result.assets[0].uri);
    };

    return (
        <TouchableOpacity onPress={pickImage} style={styles.imagePlaceholder}>
            {image ? (
                <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
                <View style={styles.uploadIcon}>
                    <Ionicons name="camera-outline" size={32} color="#7D8AFF" />
                    <Text style={styles.uploadText}>Постер</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    imagePlaceholder: {
        width: 120,
        height: 180,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        alignSelf: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: "#7D8AFF",
    },
    fullImage: { width: "100%", height: "100%" },
    uploadIcon: { alignItems: "center" },
    uploadText: { color: "#7D8AFF", marginTop: 5 },
});
