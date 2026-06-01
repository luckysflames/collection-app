import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import { X } from "lucide-react-native";
import { DynamicIcon } from "./DynamicIcon";
import { useCollectionStore } from "../../../store/useCollectionStore";

const audioSource = require("../../../assets/sounds/achivement.wav");

export const AchievementToast = ({ achievement, onDismiss }) => {
    const isSound = useCollectionStore((state) => state.isSound);
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const player = useAudioPlayer(audioSource);

    useEffect(() => {
        if (player && isSound) {
            player.play();
        }

        // Анимация появления
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();

        // Автоматическое скрытие через 5 секунд
        const timer = setTimeout(() => {
            hide();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const hide = () => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 120,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss());
    };

    const handlePress = () => {
        hide();
        navigation.navigate("Achievements", { highlightId: achievement?.id });
    };

    // БЕЗОПАСНЫЙ СБОР ДАННЫХ (Защита от undefined и пустых полей display*)
    const actualTitle = achievement?.title || achievement?.displayTitle || "Достижение";
    const actualIcon = achievement?.iconName || achievement?.displayIconName || "Award";

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateX }],
                    opacity,
                },
            ]}
        >
            <View style={styles.blurWrapper}>
                <TouchableOpacity onPress={handlePress} activeOpacity={0.8} style={styles.content}>
                    <View style={styles.iconContainer}>
                        <DynamicIcon
                            // Защищаем иконку от значения "Lock", ведь ачивка уже получена!
                            name={
                                actualIcon === "Lock" && achievement?.iconName
                                    ? achievement.iconName
                                    : actualIcon
                            }
                            size={24}
                            color="#7D8AFF"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.achievementTitle} numberOfLines={1}>
                            {/* Если прилетело "Секретное достижение", но есть реальный title — берем реальный */}
                            {actualTitle === "Секретное достижение" && achievement?.title
                                ? achievement.title
                                : actualTitle}
                        </Text>
                        <Text style={styles.upperTitle}>
                            {achievement?.hidden
                                ? "Получено секретное достижение!"
                                : "Получено новое достижение!"}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Кнопка закрытия */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={hide}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <X size={20} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        zIndex: 9999,
    },
    blurWrapper: {
        width: "100%",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
        backgroundColor: "rgba(11, 21, 52, 1)",
        flexDirection: "row",
        alignItems: "center",
    },
    content: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    closeButton: {
        paddingHorizontal: 16,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    upperTitle: {
        color: "#7D8AFF",
        fontSize: 10,
        fontWeight: "800",
        textTransform: "uppercase",
        marginTop: 2,
    },
    achievementTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
