import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Gem } from "lucide-react-native";

export const BaseHeroLayout = ({
    image,
    insets,
    leftButton,
    centerButton,
    rightButton,
    children,
}) => (
    <View style={styles.heroSection}>
        {/* ФОНОВЫЙ СЛОЙ (как в старом HeroSection) */}
        <Image
            source={{ uri: image }}
            style={styles.blurBackground}
            blurRadius={1} // Возвращаем слабую размытость
        />

        <LinearGradient
            colors={["#050B18", "transparent", "#050B18", "#050B18"]}
            style={styles.gradient}
        />

        {/* КНОПКИ (используем новые конфиги, но старые стили) */}
        <TouchableOpacity
            style={[
                styles.roundButton,
                { top: insets.top, left: 15 }, // Координаты из старой версии
                leftButton.style,
            ]}
            onPress={leftButton.onPress}
        >
            {leftButton.icon}
        </TouchableOpacity>

        {centerButton && (
            <TouchableOpacity
                style={[
                    styles.roundButton,
                    styles.centerButton,
                    { top: insets.top },
                ]}
                onPress={centerButton.onPress}
            >
               {centerButton.icon}
            </TouchableOpacity>
        )}

        {rightButton && (
            <TouchableOpacity
                style={[
                    styles.roundButton,
                    { top: insets.top, right: 15 },
                    rightButton.style,
                ]}
                onPress={rightButton.onPress}
            >
                {rightButton.icon}
            </TouchableOpacity>
        )}

        {/* КОНТЕНТ (Постер теперь четко центрируется) */}
        <View
            style={[styles.mainPosterWrapper, { paddingTop: insets.top + 50 }]}
        >
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    heroSection: {
        minHeight: 450, // Фиксированная высота из старой версии
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
        backgroundColor: "rgba(11, 21, 52, 0.8)", // Старый цвет
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        // Добавим легкую рамку для стиля
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    centerButton: {
        alignSelf: "center",
        left: "50%",
        marginLeft: -22.5, // половина ширины кнопки (45/2) для точного центра
    },
    mainPosterWrapper: {
        zIndex: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20, // Небольшая компенсация под кнопки
    },
});
