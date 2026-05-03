import React, { useRef, useEffect } from "react";
import {
    Modal,
    StyleSheet,
    Dimensions,
    Pressable,
    Animated,
    PanResponder,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const ImageModal = ({ visible, imageUri, onClose }) => {
    // Значения для анимации
    const scale = useRef(new Animated.Value(1)).current;
    const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    // Состояние
    const isZoomed = useRef(false);
    const lastTap = useRef(0);

    // Логика двойного тапа
    const handleDoubleTap = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < 300) {
            if (isZoomed.current) {
                // Сброс в исходное состояние
                Animated.parallel([
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }),
                ]).start();
            } else {
                // Увеличение
                Animated.spring(scale, {
                    toValue: 2,
                    useNativeDriver: true,
                }).start();
            }
            isZoomed.current = !isZoomed.current;
        } else {
            lastTap.current = now;
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Разрешаем перемещение только если картинка увеличена
                // и палец действительно двигается (чтобы не блокировать тапы)
                return (
                    isZoomed.current &&
                    (Math.abs(gestureState.dx) > 2 ||
                        Math.abs(gestureState.dy) > 2)
                );
            },
            onPanResponderGrant: () => {
                // Устанавливаем начальную точку, чтобы картинка не прыгала
                pan.setOffset({
                    x: pan.x._value,
                    y: pan.y._value,
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }, // Offset не дружит с nativeDriver в некоторых версиях
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset(); // Склеиваем оффсет и значение

                // Опционально: можно добавить "границы", чтобы картинка не улетала за экран
                // Но для простоты оставим свободное перемещение
            },
        }),
    ).current;

    // Сброс при закрытии
    useEffect(() => {
        if (!visible) {
            scale.setValue(1);
            pan.setValue({ x: 0, y: 0 });
            isZoomed.current = false;
        }
    }, [visible]);

    if (!imageUri) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.centeredView}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={{
                            transform: [
                                { translateX: pan.x },
                                { translateY: pan.y },
                                { scale: scale },
                            ],
                        }}
                    >
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                handleDoubleTap();
                            }}
                        >
                            <Animated.Image
                                source={{ uri: imageUri }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        </Pressable>
                    </Animated.View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: width,
        aspectRatio: 16 / 9,
    },
});
