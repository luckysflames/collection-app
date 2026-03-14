import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
    Animated,
    PanResponder,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const ApiInfoModal = ({ visible, onClose }) => {
    const [shouldRender, setShouldRender] = useState(visible);
    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            Animated.spring(panY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
            }).start();
        }
    }, [visible]);

    const closeModal = () => {
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setShouldRender(false);
            onClose();
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) panY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150 || gestureState.vy > 0.5) {
                    closeModal();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;

    const apiServices = [
        {
            name: "RAWG API",
            desc: "Крупнейшая база видеоигр. Скриншоты, даты выхода и платформы.",
            url: "https://rawg.io/apidocs",
            icon: "game-controller-outline",
        },
        {
            name: "TMDB API",
            desc: "Информация о фильмах и сериалах: постеры, трейлеры и рейтинги.",
            url: "https://www.themoviedb.org",
            icon: "film-outline",
        },
        {
            name: "Shikimori",
            desc: "Энциклопедия аниме и манги с огромным комьюнити.",
            url: "https://shikimori.one",
            icon: "leaf-outline",
        },
        {
            name: "Google Books",
            desc: "Поиск книг по названию, автору или ISBN по всему миру.",
            url: "https://books.google.com",
            icon: "book-outline",
        },
    ];

    if (!shouldRender && !visible) return null;

    return (
        <Modal
            visible={visible || shouldRender}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            opacity: panY.interpolate({
                                inputRange: [0, SCREEN_HEIGHT / 2],
                                outputRange: [1, 0],
                                extrapolate: "clamp",
                            }),
                        },
                    ]}
                >
                    <BlurView
                        intensity={60}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeModal}
                    />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: panY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.dragIndicator} />

                    <Text style={styles.modalTitle}>Используемые API</Text>
                    <Text style={styles.modalSubtitle}>
                        Приложение использует данные следующих сервисов для
                        поиска контента:
                    </Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        {apiServices.map((api, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.apiCard}
                                onPress={() => Linking.openURL(api.url)}
                            >
                                <View style={styles.apiIconWrapper}>
                                    <Ionicons
                                        name={api.icon}
                                        size={24}
                                        color="#7D8AFF"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.apiName}>
                                        {api.name}
                                    </Text>
                                    <Text style={styles.apiDesc}>
                                        {api.desc}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="open-outline"
                                    size={18}
                                    color="#4A5568"
                                />
                            </TouchableOpacity>
                        ))}

                        <View style={styles.disclaimer}>
                            <Text style={styles.disclaimerText}>
                                Все права на контент (постеры, описания,
                                скриншоты) принадлежат их правообладателям.
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    modalContent: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 25,
        paddingBottom: 40,
        height: "75%",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    dragIndicator: {
        width: 40,
        height: 5,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 12,
        marginBottom: 20,
    },
    modalTitle: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    modalSubtitle: {
        color: "#8E94A4",
        fontSize: 14,
        marginBottom: 25,
        lineHeight: 20,
    },
    apiCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        gap: 16,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.03)",
    },
    apiIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    apiName: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
    apiDesc: { color: "#8E94A4", fontSize: 13, marginTop: 4, lineHeight: 18 },
    disclaimer: { marginTop: 20, paddingHorizontal: 10, opacity: 0.6 },
    disclaimerText: {
        color: "#8E94A4",
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
});
