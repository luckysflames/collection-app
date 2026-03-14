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

export const DevelopersModal = ({ visible, onClose }) => {
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
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
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

    if (!shouldRender && !visible) return null;

    return (
        <Modal
            visible={visible || shouldRender}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={closeModal}
        >
            <View style={styles.overlay}>
                {/* Блюр фон с анимацией прозрачности */}
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

                {/* Контент модалки */}
                <Animated.View
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: panY }] },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.dragIndicator} />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View style={styles.center}>
                            <View style={styles.avatarWrapper}>
                                <Text style={{ fontSize: 40 }}>👨‍💻</Text>
                            </View>
                            <Text style={styles.devName}>luckyflame</Text>
                            <Text style={styles.devRole}>
                                Главный разработчик
                            </Text>
                        </View>

                        <View style={styles.separator} />

                        <Text style={styles.subTitle}>
                            Отдел разрушения (QA)
                        </Text>
                        <View
                            style={[styles.specialCard, { marginBottom: 20 }]}
                        >
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 24 }}>🤡</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.specialTitle}>Черти</Text>
                                <Text style={styles.specialDesc}>
                                    Тестировщики, чья единственная цель в жизни
                                    — нажать кнопку в приложении так, чтобы
                                    умерла чья-то мать. (Michaelills, Vladonikc)
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.subTitle}>При поддержке</Text>
                        <View style={styles.specialCard}>
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 24 }}>🐾</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.specialTitle}>
                                    Кошко-девочки
                                </Text>
                                <Text style={styles.specialDesc}>
                                    Морально поддерживали проект своим мурчанием
                                    и не давали выгореть.
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingHorizontal: 25,
        paddingBottom: 40,
        height: "70%",
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
        marginBottom: 25,
    },
    center: { alignItems: "center", marginBottom: 20 },
    avatarWrapper: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#7D8AFF",
    },
    devName: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
    devRole: {
        color: "#7D8AFF",
        fontSize: 14,
        marginTop: 5,
        fontWeight: "600",
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginVertical: 20,
    },
    subTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 10,
    },
    specialCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        padding: 15,
        borderRadius: 20,
        gap: 15,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    specialTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    specialDesc: { color: "#8E94A4", fontSize: 13, marginTop: 2 },
});
