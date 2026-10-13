import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Camera } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";
import { getDisplayableImageUri, PosterImage } from "./PosterImage";

export const HeroPoster = ({
    image,
    isEditing,
    onPickImage,
    onPressPoster,
    posterWidth = 240,
    posterHeight = 340,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);
    const posterUri = getDisplayableImageUri(image);

    return (
        <TouchableOpacity
            style={[styles.posterFrame, { width: posterWidth, height: posterHeight }]}
            activeOpacity={isEditing ? 1 : 0.9}
            onPress={isEditing || !posterUri ? undefined : onPressPoster}
            disabled={isEditing && !onPickImage}
        >
            <PosterImage image={image} style={styles.image} iconColor={theme.textDark} />

            {isEditing && (
                <TouchableOpacity
                    style={styles.cameraOverlay}
                    onPress={onPickImage}
                    activeOpacity={0.8}
                >
                    <Camera size={32} color={theme.text} />
                    <Text style={styles.cameraText}>Изменить</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        posterFrame: {
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: theme.main,
        },
        image: {
            width: "100%",
            height: "100%",
        },
        cameraOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.overlay,
            justifyContent: "center",
            alignItems: "center",
        },
        cameraText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "700",
            marginTop: 8,
        },
    });
