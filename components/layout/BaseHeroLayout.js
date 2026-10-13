import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";
import { getDisplayableImageUri } from "../ui/PosterImage";

export const BaseHeroLayout = ({
    image,
    insets,
    leftButton,
    centerButton,
    rightButton,
    children,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);
    const backgroundImage = getDisplayableImageUri(image);
    const [failedBackgroundImage, setFailedBackgroundImage] = useState(null);

    return (
        <View style={styles.heroSection}>
            {/* ФОНОВЫЙ СЛОЙ */}
            {backgroundImage && failedBackgroundImage !== backgroundImage && (
                <Image
                    source={{ uri: backgroundImage }}
                    style={styles.blurBackground}
                    blurRadius={1}
                    onError={() => setFailedBackgroundImage(backgroundImage)}
                />
            )}

            <LinearGradient
                colors={[theme.dark, "transparent", theme.dark, theme.dark]}
                style={styles.gradient}
            />

            {/* ЛЕВАЯ КНОПКА */}
            {leftButton && (
                <TouchableOpacity
                    style={[
                        !leftButton?.unstyled && styles.roundButton,
                        { top: insets.top - 20, left: 15 },
                        leftButton?.style,
                    ]}
                    onPress={leftButton?.onPress}
                    activeOpacity={leftButton?.unstyled ? 0.7 : 0.2}
                >
                    {leftButton?.icon}
                </TouchableOpacity>
            )}

            {/* ДЕКОРАТИВНЫЙ ЦЕНТРАЛЬНЫЙ ЭЛЕМЕНТ (АЛМАЗ) */}
            {centerButton && (
                <View
                    style={[
                        styles.centerDecorationWrapper,
                        { top: insets.top },
                        centerButton.style,
                    ]}
                >
                    {centerButton.icon}
                </View>
            )}

            {/* ПРАВАЯ КНОПКА */}
            {rightButton && (
                <TouchableOpacity
                    style={[
                        !rightButton.unstyled && styles.roundButton,
                        { top: insets.top - 20, right: 15 },
                        rightButton.style,
                    ]}
                    onPress={rightButton.onPress}
                    activeOpacity={rightButton.unstyled ? 0.7 : 0.2}
                >
                    {rightButton.icon}
                </TouchableOpacity>
            )}

            {/* КОНТЕНТ */}
            <View style={[styles.mainPosterWrapper, { paddingTop: insets.top + 50 }]}>
                {children}
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        heroSection: {
            minHeight: 450,
            width: "100%",
            justifyContent: "flex-start",
            backgroundColor: theme.dark,
        },
        blurBackground: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 550,
            opacity: 0.4,
        },
        gradient: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 550,
        },
        roundButton: {
            position: "absolute",
            zIndex: 10,
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        centerDecorationWrapper: {
            position: "absolute",
            zIndex: 10,
            alignSelf: "center",
            left: "50%",
            justifyContent: "center",
            alignItems: "center",
        },
        mainPosterWrapper: {
            zIndex: 5,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
        },
    });
