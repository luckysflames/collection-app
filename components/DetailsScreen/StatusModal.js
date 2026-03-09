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

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function StatusModal({
    visible,
    category,
    onClose,
    onSelect,
    currentStatus,
    removeCard,
}) {
    const getStatuses = () => {
        if (category === "Книги")
            return [
                "Читаю",
                "В планах",
                "Прочитано",
                "Перечитываю",
                "Брошено",
                "Отложено",
            ];
        if (category === "Игры")
            return [
                "Играю",
                "В планах",
                "Прошёл",
                "Переигрываю",
                "Брошено",
                "Отложено",
            ];
        return [
            "Смотрю",
            "В планах",
            "Просмотрено",
            "Пересматриваю",
            "Брошено",
            "Отложено",
        ];
    };

    const STATUSES = getStatuses();

    const insets = useSafeAreaInsets();

    // Локальный стейт, чтобы модалка не исчезала раньше времени
    const [shouldRender, setShouldRender] = useState(visible);
    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // Синхронизируем пропс visible с локальным состоянием
    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            Animated.spring(panY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
            }).start();
        } else {
            // Если родитель скрыл модалку (например, через стейт),
            // но мы еще не запустили closeModal, делаем это принудительно
            // Но чаще всего закрытие идет через нашу функцию closeModal ниже
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                // Разрешаем тянуть только вниз (dy > 0)
                if (gestureState.dy > 0) {
                    panY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Если смахнули вниз больше чем на 150 пикселей — закрываем
                if (gestureState.dy > 150 || gestureState.vy > 0.5) {
                    closeModal();
                } else {
                    // Иначе возвращаем на место с эффектом пружины
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;

    const closeModal = () => {
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 250, // Чуть медленнее для плавности
            useNativeDriver: true,
        }).start(() => {
            setShouldRender(false); // Сначала убираем рендер
            onClose(); // Потом уведомляем родителя
        });
    };

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
                        // Плавно проявляем черный фон
                        opacity: panY.interpolate({
                            inputRange: [0, SCREEN_HEIGHT / 2],
                            outputRange: [1, 0],
                            extrapolate: "clamp",
                        }),
                    },
                ]}
            >
                {/* Кликабельный фон для закрытия */}
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={closeModal}
                />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            paddingBottom:
                                insets.bottom > 0 ? insets.bottom + 20 : 80,
                            transform: [{ translateY: panY }],
                        },
                    ]}
                    {...panResponder.panHandlers} // Привязываем жесты к контенту
                >
                    <View style={styles.handle} />
                    <Text style={styles.header}>Статус</Text>

                    {STATUSES.map((s) => (
                        <TouchableOpacity
                            key={s}
                            onPress={() => {
                                onSelect(s);
                                closeModal();
                            }}
                            style={styles.option}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    currentStatus === s && {
                                        color: "#7D8AFF",
                                        fontWeight: "600",
                                    },
                                ]}
                            >
                                {s}
                            </Text>
                            {currentStatus === s && (
                                <View style={styles.activeDot} />
                            )}
                        </TouchableOpacity>
                    ))}

                    {!!removeCard && (
                        <TouchableOpacity
                            onPress={removeCard}
                            style={styles.removeBtn}
                        >
                            <Text style={styles.removeText}>
                                Удалить из коллекции
                            </Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
        marginTop: -50,
        marginBottom: -50,
    },
    content: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 15,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 15,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    optionText: { color: "#fff", fontSize: 18 },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#7D8AFF",
    },
    removeBtn: {
        marginTop: 40,
        alignItems: "center",
        padding: 15,
        backgroundColor: "#FF4B4B",
        borderRadius: 20,
    },
    removeText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
