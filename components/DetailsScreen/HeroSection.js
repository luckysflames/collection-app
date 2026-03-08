import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export const HeroSection = ({
    image,
    insets,
    onBack,
    onCollect,
    isInCollection,
    iconSources,
}) => (
    <View style={styles.heroSection}>
        <Image
            source={{ uri: image }}
            style={styles.blurBackground}
            blurRadius={1}
        />
        <LinearGradient
            colors={["transparent", "#050B18"]}
            style={styles.gradient}
        />

        {/* Кнопки управления */}
        <TouchableOpacity
            style={[styles.roundButton, { top: insets.top + 10, left: 15 }]}
            onPress={onBack}
        >
            <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* <TouchableOpacity
            style={[
                styles.roundButton,
                styles.collectBtn,
                { top: insets.top + 10, right: 15 },
                isInCollection && styles.activeCollect,
            ]}
            onPress={onCollect}
        >
            <Image
                source={
                    isInCollection ? iconSources.active : iconSources.inactive
                }
                style={styles.iconSmall}
            />
        </TouchableOpacity> */}

        <View style={styles.mainPosterWrapper}>
            <Image source={{ uri: image }} style={styles.mainPoster} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    heroSection: {
        height: 450,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    blurBackground: { ...StyleSheet.absoluteFillObject, opacity: 0.4 },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 600,
    },
    mainPoster: { width: 240, height: 340, borderRadius: 20 },
    roundButton: {
        position: "absolute",
        zIndex: 10,
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    activeCollect: { backgroundColor: "#7D8AFF" },
    iconSmall: { width: 22, height: 22, resizeMode: "contain" },
});
