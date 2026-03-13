import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export const HeroSection = ({
    image,
    insets,
    onBack,
    isCustom, // Проверяем, можно ли редактировать
    isEditing,
    onEditToggle,
}) => (
    <View style={styles.heroSection}>
        <Image
            source={{ uri: image }}
            style={styles.blurBackground}
            blurRadius={1}
        />
        <LinearGradient
            colors={["#050B18", "transparent", "#050B18", "#050B18"]}
            style={styles.gradient}
        />

        {/* Кнопка Назад */}
        <TouchableOpacity
            style={[styles.roundButton, { top: insets.top, left: 15 }]}
            onPress={onBack}
        >
            <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Кнопка Редактировать (только для кастомных) */}
        {isCustom && (
            <TouchableOpacity
                style={[
                    styles.roundButton,
                    { top: insets.top, right: 15 },
                    isEditing && { backgroundColor: "#7D8AFF" }, // Подсветка при активе
                ]}
                onPress={onEditToggle}
            >
                <Ionicons
                    name={isEditing ? "close" : "create-outline"}
                    size={22}
                    color="#fff"
                />
            </TouchableOpacity>
        )}

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
    blurBackground: {
        ...StyleSheet.absoluteFill,
        opacity: 0.4,
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 450,
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
});
