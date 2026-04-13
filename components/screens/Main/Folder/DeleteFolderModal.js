import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trash2, FolderX, AlertCircle } from "lucide-react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function DeleteFolderModal({
    visible,
    onClose,
    onDeleteAll,
    onDeleteOnlyFolder,
}) {
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

    if (!shouldRender && !visible) return null;

    return (
        <Modal
            transparent
            visible={visible || shouldRender}
            animationType="none"
            statusBarTranslucent
            onRequestClose={closeModal}
        >
            <Animated.View
                style={[
                    styles.overlay,
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
                    onPress={closeModal}
                />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            paddingBottom:
                                insets.bottom > 0 ? insets.bottom + 10 : 20,
                            transform: [{ translateY: panY }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handle} />

                    <View style={styles.iconHeader}>
                        <AlertCircle
                            color="#FF4B4B"
                            size={40}
                            strokeWidth={1.5}
                        />
                    </View>

                    <Text style={styles.header}>Удаление папки</Text>
                    <Text style={styles.subHeader}>
                        В папке есть элементы. Выберите способ удаления:
                    </Text>

                    {/* Вариант 1: Удалить только папку */}
                    <TouchableOpacity
                        style={styles.optionBtn}
                        onPress={() => {
                            onDeleteOnlyFolder();
                            closeModal();
                        }}
                    >
                        <View
                            style={[
                                styles.iconBg,
                                { backgroundColor: "rgba(125, 138, 255, 0.1)" },
                            ]}
                        >
                            <FolderX color="#7D8AFF" size={22} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>
                                Удалить только папку
                            </Text>
                            <Text style={styles.optionDesc}>
                                Элементы переместятся в общую библиотеку
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Вариант 2: Удалить всё */}
                    <TouchableOpacity
                        style={[styles.optionBtn, styles.optionBtnDestructive]}
                        onPress={() => {
                            onDeleteAll();
                            closeModal();
                        }}
                    >
                        <View
                            style={[
                                styles.iconBg,
                                { backgroundColor: "rgba(255, 75, 75, 0.1)" },
                            ]}
                        >
                            <Trash2 color="#FF4B4B" size={22} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text
                                style={[
                                    styles.optionTitle,
                                    { color: "#FF4B4B" },
                                ]}
                            >
                                Удалить всё
                            </Text>
                            <Text style={styles.optionDesc}>
                                Папка и всё её содержимое будут стерты
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={closeModal}
                    >
                        <Text style={styles.cancelBtnText}>Отмена</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "flex-end",
    },
    content: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 25,
        paddingTop: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20,
    },
    iconHeader: {
        alignItems: "center",
        marginBottom: 10,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    subHeader: {
        color: "#8E94A4",
        fontSize: 15,
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    optionBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    optionBtnDestructive: {
        borderColor: "rgba(255, 75, 75, 0.1)",
    },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    optionTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    optionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    optionDesc: {
        color: "#62697D",
        fontSize: 12,
        marginTop: 2,
    },
    cancelBtn: {
        marginTop: 20,
        alignItems: "center",
        padding: 18,
    },
    cancelBtnText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
});
