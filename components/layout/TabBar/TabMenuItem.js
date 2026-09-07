import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

export const TabMenuItem = ({
    onPress,
    isFocused,
    isCompactMenu,
    routeName,
    iconSet,
    ICON_CONTAINER_SIZE,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const scaleValue = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.7,
            useNativeDriver: true,
        }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const borderRadius = isCompactMenu ? 15 : 20;

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            activeOpacity={1}
            style={styles.tabItem}
        >
            <Animated.View
                style={[
                    styles.iconContainer,
                    isFocused && styles.activeIconContainer,
                    {
                        width: ICON_CONTAINER_SIZE,
                        height: ICON_CONTAINER_SIZE,
                        borderRadius: borderRadius,
                        transform: [{ scale: scaleValue }],
                    },
                ]}
            >
                <Image
                    source={isFocused ? iconSet.active : iconSet.inactive}
                    style={[
                        styles.iconStyle,
                        {
                            tintColor: theme.text,
                            width: isCompactMenu ? 22 : 24,
                            height: isCompactMenu ? 22 : 24,
                        },
                    ]}
                />
                {!isCompactMenu && <Text style={styles.tabText}>{routeName}</Text>}
            </Animated.View>
        </TouchableOpacity>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        tabItem: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        iconContainer: {
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
        activeIconContainer: {
            backgroundColor: theme.accent,
        },
        iconStyle: {
            resizeMode: "contain",
        },
        tabText: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 5,
            color: theme.text,
        },
    });
