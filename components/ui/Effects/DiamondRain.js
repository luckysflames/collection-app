import React, { useEffect, useRef, memo, useState } from "react";
import { StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import DiamondsPattern from "./DiamondsPattern";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LAYER_HEIGHT = 800;

const DiamondLayer = memo(() => (
    <View style={{ height: LAYER_HEIGHT, width: SCREEN_WIDTH }}>
        <DiamondsPattern width={SCREEN_WIDTH} height={LAYER_HEIGHT} />
    </View>
));

export const DiamondRain = ({ isBrilliant, contentHeight = 1700 }) => {
    const animation = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [shouldRender, setShouldRender] = useState(isBrilliant);
    const loopRef = useRef(null);

    useEffect(() => {
        if (isBrilliant) {
            setShouldRender(true);

            // Запускаем бесконечный цикл падения внутри слоев, если он еще не запущен
            if (!loopRef.current) {
                loopRef.current = Animated.loop(
                    Animated.timing(animation, {
                        toValue: 1,
                        duration: 15000,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                );
                loopRef.current.start();
            }

            // Просто проявляем слой (подхватывает текущее значение)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 10000, // Можно настроить комфортную скорость
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else {
            // Просто гасим слой
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 5000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(({ finished }) => {
                // Если анимация реально дошла до конца (не была прервана включением)
                if (finished) {
                    setShouldRender(false);
                    if (loopRef.current) {
                        loopRef.current.stop();
                        loopRef.current = null;
                    }
                }
            });
        }
    }, [isBrilliant]);

    // Если полностью скрыто — выгружаем из памяти
    if (!shouldRender) return null;

    const getLayerStyle = (index) => ({
        transform: [
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                        index * -LAYER_HEIGHT,
                        (1 - index) * LAYER_HEIGHT,
                    ],
                }),
            },
        ],
    });

    return (
        <Animated.View
            style={[
                styles.rainOverlay,
                {
                    height: contentHeight,
                    opacity: fadeAnim, // Работаем только с прозрачностью
                },
            ]}
            pointerEvents="none"
        >
            <Animated.View style={[styles.animatedLayer, getLayerStyle(0)]}>
                <DiamondLayer />
            </Animated.View>
            <Animated.View style={[styles.animatedLayer, getLayerStyle(1)]}>
                <DiamondLayer />
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    rainOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99,
        overflow: "hidden",
    },
    animatedLayer: {
        position: "absolute",
        left: 0,
        right: 0,
        height: LAYER_HEIGHT,
    },
});
