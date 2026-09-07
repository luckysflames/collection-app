import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Camera } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

export const HeroPoster = ({
    image,
    isEditing,
    onPickImage,
    posterWidth = 240,
    posterHeight = 340,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={[styles.posterFrame, { width: posterWidth, height: posterHeight }]}>
            <Image key={image} source={{ uri: image }} style={styles.image} resizeMode="cover" />

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
        </View>
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
