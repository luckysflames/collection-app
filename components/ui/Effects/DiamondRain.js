import React, { useEffect, useRef, memo, useState, useCallback } from "react";
import { StyleSheet, View, Animated, Easing, Dimensions } from "react-native";
import DiamondsPattern from "./DiamondsPattern";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LAYER_HEIGHT = 800;

// === КОНФИГУРАЦИЯ ОПТИМИЗАЦИИ ===
const FADE_IN_DURATION = 1500; // Быстрое проявление при активации
const FADE_OUT_DURATION = 1500; // Более плавное затухание
const DEACTIVATION_DELAY = 2000; // Задержка перед началом затухания (даёт время на микро-переходы)
const ANIMATION_LOOP_DURATION = 15000; // Длительность цикла движения

const DiamondLayer = memo(() => (
    <View
        style={{ height: LAYER_HEIGHT, width: SCREEN_WIDTH }}
        renderToHardwareTextureAndroid={true}
    >
        <DiamondsPattern width={SCREEN_WIDTH} height={LAYER_HEIGHT} />
    </View>
));

const DiamondRainComponent = ({ isActive, contentHeight = 1000 }) => {
    const animation = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [shouldRender, setShouldRender] = useState(isActive);

    const loopRef = useRef(null);
    const stopTimerRef = useRef(null);
    const fadeOutTimerRef = useRef(null);

    // Используем useCallback для оптимизации
    const startFadeOut = useCallback(() => {
        if (fadeOutTimerRef.current) {
            clearTimeout(fadeOutTimerRef.current);
        }

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: FADE_OUT_DURATION,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                if (loopRef.current) {
                    loopRef.current.stop();
                    loopRef.current = null;
                }
                setShouldRender(false);
                animation.setValue(0);
            }
        });
    }, [animation, fadeAnim]);

    const startFadeIn = useCallback(() => {
        setShouldRender(true);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: FADE_IN_DURATION,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
        }).start();

        if (!loopRef.current) {
            loopRef.current = Animated.loop(
                Animated.timing(animation, {
                    toValue: 1,
                    duration: ANIMATION_LOOP_DURATION,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            );
            loopRef.current.start();
        }
    }, [animation, fadeAnim]);

    useEffect(() => {
        if (isActive) {
            // Отменяем любые ожидающие операции выключения
            if (stopTimerRef.current) {
                clearTimeout(stopTimerRef.current);
                stopTimerRef.current = null;
            }
            if (fadeOutTimerRef.current) {
                clearTimeout(fadeOutTimerRef.current);
                fadeOutTimerRef.current = null;
            }

            startFadeIn();
        } else {
            // Запускаем таймер на задержку перед затуханием
            // Это даёт время на микро-переходы между экранами
            stopTimerRef.current = setTimeout(() => {
                startFadeOut();
            }, DEACTIVATION_DELAY);
        }

        return () => {
            if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
            if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
        };
    }, [isActive, startFadeIn, startFadeOut]);

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
                    opacity: fadeAnim,
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

// Мемоизируем компонент чтобы он не ре-рендерился без необходимости
export const DiamondRain = memo(DiamondRainComponent);

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
