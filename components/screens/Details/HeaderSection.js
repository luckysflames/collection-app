import React, { useRef, useEffect } from "react";
import { Animated, Easing, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { X, ChevronLeft, Check, Pen, RefreshCcw } from "lucide-react-native";
import { BaseHeroLayout } from "../../layout/BaseHeroLayout";
import { HeroPoster } from "../../ui/HeroPoster";

export const HeaderSection = ({
    isEditing,
    image,
    onLeftPress,
    onRightPress,
    onPickImage,
    insets,
    showEditButton,
    showRefreshButton,
    isRefreshing,
    isBrilliant, // Используем только для отображения крутящегося алмаза
    isFocused,
}) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const headerLottieRef = useRef(null);

    // Вращение для иконки обновления (Refresh)
    useEffect(() => {
        if (isRefreshing) {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ).start();
        } else {
            spinValue.stopAnimation(() => spinValue.setValue(0));
        }
    }, [isRefreshing]);

    // Контроль воспроизведения Lottie-анимации алмаза
    useEffect(() => {
        if (isBrilliant && isFocused) {
            headerLottieRef.current?.play();
        } else {
            headerLottieRef.current?.pause();
        }
    }, [isFocused, isBrilliant]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "-360deg"],
    });

    return (
        <BaseHeroLayout
            image={image}
            insets={insets}
            leftButton={{
                onPress: onLeftPress,
                icon: isEditing ? (
                    <X size={24} color="#FF6B6B" />
                ) : (
                    <ChevronLeft size={24} color="#fff" />
                ),
            }}
            // Если у карточки активирован статус шедевра,
            // рендерим парящий и крутящийся алмаз без подложки и экшенов
            centerButton={
                isBrilliant
                    ? {
                          unstyled: true,
                          style: styles.lottieContainer,
                          icon: (
                              <LottieView
                                  ref={headerLottieRef}
                                  source={require("../../../assets/diamond.json")}
                                  style={styles.headerLottie}
                                  autoPlay={isFocused}
                                  loop={true}
                                  resizeMode="contain"
                              />
                          ),
                      }
                    : null
            }
            rightButton={
                showEditButton
                    ? {
                          onPress: onRightPress,
                          icon: isEditing ? (
                              <Check size={24} color="#7D8AFF" />
                          ) : (
                              <Pen size={22} color="#fff" />
                          ),
                      }
                    : showRefreshButton
                      ? {
                            onPress: onRightPress,
                            icon: (
                                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                    <RefreshCcw
                                        size={22}
                                        color={isRefreshing ? "#7D8AFF" : "#fff"}
                                    />
                                </Animated.View>
                            ),
                        }
                      : null
            }
        >
            <HeroPoster image={image} isEditing={isEditing} onPickImage={onPickImage} />
        </BaseHeroLayout>
    );
};

const styles = StyleSheet.create({
    lottieContainer: {
        width: 100,
        height: 100,
        marginLeft: -50,
        marginTop: -15,
        justifyContent: "center",
        alignItems: "center",
    },
    headerLottie: {
        width: "100%",
        height: "100%",
    },
});
