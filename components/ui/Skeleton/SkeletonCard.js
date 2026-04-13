import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const SkeletonCard = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Запускаем бесконечный цикл пульсации
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

const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16,
    },
    card: {
        width: "100%",
        height: 280,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
});
