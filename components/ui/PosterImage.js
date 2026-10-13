import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Image as ImageIcon } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

export const getDisplayableImageUri = (image) => {
    if (typeof image !== "string") return null;

    const uri = image.trim();
    if (!uri || uri.startsWith("LOCAL_IMAGE:") || /via\.placeholder\.com/i.test(uri)) {
        return null;
    }

    return uri;
};

export const PosterImage = ({
    image,
    style,
    iconSize = 48,
    iconColor,
    placeholder,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);
    const [failedImage, setFailedImage] = useState(null);
    const imageUri = getDisplayableImageUri(image);
    const showImage = imageUri && failedImage !== imageUri;

    return (
        <View style={[styles.container, style]}>
            {showImage ? (
                <Image
                    key={imageUri}
                    source={{ uri: imageUri }}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    onError={() => setFailedImage(imageUri)}
                />
            ) : (
                placeholder || (
                    <ImageIcon size={iconSize} color={iconColor || theme.textDark} />
                )
            )}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.main,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
    });
