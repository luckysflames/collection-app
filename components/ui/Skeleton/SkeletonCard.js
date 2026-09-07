import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const SkeletonCard = () => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    return (
        <View style={styles.cardContainer}>
            <Animated.View style={[styles.card, { opacity }]} />
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        cardContainer: {
            width: cardWidth,
            marginBottom: 16,
        },
        card: {
            width: "100%",
            height: 250,
            borderRadius: 20,
            backgroundColor: theme.textDark,
        },
    });
