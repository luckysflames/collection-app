import React from "react";
import { Animated, Easing } from "react-native";
import { X, ChevronLeft, Check, Pen, RefreshCcw } from "lucide-react-native";
import { BaseHeroLayout } from "../../ui/BaseHeroLayout";
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
}) => {
    // Создаем значение для вращения
    const spinValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
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

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
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
                                <Animated.View
                                    style={{ transform: [{ rotate: spin }] }}
                                >
                                    <RefreshCcw
                                        size={22}
                                        color={
                                            isRefreshing ? "#7D8AFF" : "#fff"
                                        }
                                    />
                                </Animated.View>
                            ),
                        }
                      : null
            }
        >
            <HeroPoster
                image={image}
                isEditing={isEditing}
                onPickImage={onPickImage}
            />
        </BaseHeroLayout>
    );
};
