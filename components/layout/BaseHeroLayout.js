import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const BaseHeroLayout = ({
    image,
    insets,
    leftButton,
    centerButton, // Теперь это просто конфигурация для декоративного элемента
    rightButton,
    children,
}) => (
    <View style={styles.heroSection}>
        {/* ФОНОВЫЙ СЛОЙ */}
        <Image source={{ uri: image }} style={styles.blurBackground} blurRadius={1} />

        <LinearGradient
            colors={["#050B18", "transparent", "#050B18", "#050B18"]}
            style={styles.gradient}
        />

        {/* ЛЕВАЯ КНОПКА */}
        {leftButton && (
            <TouchableOpacity
                style={[
                    !leftButton?.unstyled && styles.roundButton,
                    { top: insets.top, left: 15 },
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
            <View style={[styles.centerDecorationWrapper, { top: insets.top }, centerButton.style]}>
                {centerButton.icon}
            </View>
        )}

        {/* ПРАВАЯ КНОПКА */}
        {rightButton && (
            <TouchableOpacity
                style={[
                    !rightButton.unstyled && styles.roundButton,
                    { top: insets.top, right: 15 },
                    rightButton.style,
                ]}
                onPress={rightButton.onPress}
                activeOpacity={rightButton.unstyled ? 0.7 : 0.2}
            >
                {rightButton.icon}
            </TouchableOpacity>
        )}

        {/* КОНТЕНТ */}
        <View style={[styles.mainPosterWrapper, { paddingTop: insets.top + 50 }]}>{children}</View>
    </View>
);

const styles = StyleSheet.create({
    heroSection: {
        minHeight: 450,
        width: "100%",
        justifyContent: "flex-start",
        backgroundColor: "#050B18",
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
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    // Чистый, невидимка-контейнер чисто для позиционирования Lottie по центру
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
