import React, { useRef, useEffect, useState } from "react";
import {
    Modal,
    View,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export const BottomSheet = ({ visible, onClose, children, containerStyle }) => {
    const insets = useSafeAreaInsets();
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

    const handleClose = () => {
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
            onMoveShouldSetPanResponder: (_, { dy }) => dy > 5, // Чтобы не перехватывать мелкие тапы
            onPanResponderMove: (_, { dy }) => {
                if (dy > 0) panY.setValue(dy);
            },
            onPanResponderRelease: (_, { dy, vy }) => {
                if (dy > 150 || vy > 0.5) {
                    handleClose();
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
            transparent
            visible={visible || shouldRender}
            animationType="none"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <View style={styles.overlayContainer}>
                {/* Overlay Background */}
                <Animated.View
                    style={[
                        styles.darkOverlay,
                        {
                            opacity: panY.interpolate({
                                inputRange: [0, SCREEN_HEIGHT / 2],
                                outputRange: [1, 0],
                                extrapolate: "clamp",
                            }),
                        },
                    ]}
                >
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={handleClose}
                    />
                </Animated.View>

                {/* Content Container */}
                <Animated.View
                    style={[
                        styles.modalContent,
                        containerStyle,
                        {
                            transform: [{ translateY: panY }],
                            paddingBottom:
                                insets.bottom > 0 ? insets.bottom + 20 : 40,
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.pullIndicator} />
                    {children}
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlayContainer: { flex: 1, justifyContent: "flex-end" },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#1E2127", // Ваш основной цвет фона
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        width: "100%",
    },
    pullIndicator: {
        width: 40,
        height: 5,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 3,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 20,
    },
});
