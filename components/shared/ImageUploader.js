import React from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Camera } from "lucide-react-native";

export default function ImageUploader({ image, onImagePick }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <TouchableOpacity onPress={onImagePick} style={styles.imagePlaceholder} activeOpacity={0.8}>
            {image ? (
                <Image source={{ uri: image }} style={styles.fullImage} />
            ) : (
                <View style={styles.uploadIcon}>
                    <Camera size={32} color={theme.accent} />
                    <Text style={styles.uploadText}>Постер</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        imagePlaceholder: {
            width: 120,
            height: 180,
            backgroundColor: theme.main,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            alignSelf: "center",
            overflow: "hidden",
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: theme.accent,
        },
        fullImage: { width: "100%", height: "100%" },
        uploadIcon: { alignItems: "center" },
        uploadText: { color: theme.accent, marginTop: 5 },
    });
