import React, { useRef, useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
} from "react-native";
import { Star, RotateCcw, Info } from "lucide-react-native";

export const UserRating = ({ score, onSetScore, onInfoPress }) => {
    const prevScore = useRef(score);
    // Используем ref для мгновенной синхронной блокировки
    const isBlocking = useRef(false);
    // useState оставляем только для визуального изменения кнопок (серая/активная)
    const [visualLock, setVisualLock] = useState(false);

    const starAnims = useRef(
        [...Array(10)].map((_, i) => new Animated.Value(i < score ? 1 : 0)),
    ).current;

    const handleSetScore = (newScore) => {
        // Мгновенная проверка. Если заблокировано — просто выходим.
        if (isBlocking.current || newScore === score) return;

        onSetScore(newScore);
    };

    useEffect(() => {
        if (score === prevScore.current) return;

        const isReducing = score < prevScore.current;

        // Включаем "броню"
        isBlocking.current = true;
        setVisualLock(true);

        // Останавливаем все текущие анимации на звездах (на всякий случай)
        starAnims.forEach((anim) => anim.stopAnimation());

        let animationObjects = starAnims.map((anim, i) => ({
            index: i,
            animation: Animated.timing(anim, {
                toValue: i < score ? 1 : 0,
                duration: 30,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
        }));

        let activeAnimations = animationObjects.filter(({ index }) => {
            if (isReducing) {
                return index >= score && index < prevScore.current;
            } else {
                return index >= prevScore.current && index < score;
            }
        });

        if (isReducing) {
            activeAnimations.reverse();
        }

        const finalAnims = activeAnimations.map((obj) => obj.animation);

        if (finalAnims.length > 0) {
            Animated.stagger(100, finalAnims).start(() => {
                // Снимаем блокировку только по окончании всей очереди
                isBlocking.current = false;
                setVisualLock(false);
                prevScore.current = score;
            });
        } else {
            isBlocking.current = false;
            setVisualLock(false);
            prevScore.current = score;
        }
    }, [score]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Моя оценка</Text>
                    <TouchableOpacity onPress={onInfoPress} hitSlop={10}>
                        <Info size={18} color="#7D8AFF" />
                    </TouchableOpacity>
                </View>
                {score > 0 && (
                    <TouchableOpacity
                        onPress={() => handleSetScore(0)}
                        style={styles.resetBtn}
                        hitSlop={10}
                        activeOpacity={visualLock ? 1 : 0.7}
                    >
                        <RotateCcw
                            size={14}
                            color={visualLock ? "#4A4D57" : "#8E94A4"}
                        />
                        <Text
                            style={[
                                styles.resetText,
                                visualLock && { color: "#4A4D57" },
                            ]}
                        >
                            Сбросить
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.card}>
                <View style={styles.starsRow}>
                    {[...Array(10)].map((_, i) => {
                        const starValue = i + 1;
                        const width = starAnims[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                        });

                        return (
                            <TouchableOpacity
                                key={starValue}
                                activeOpacity={visualLock ? 1 : 0.7}
                                onPress={() => handleSetScore(starValue)}
                                style={styles.starTouch}
                            >
                                <View style={styles.starWrapper}>
                                    <Star
                                        size={26}
                                        color="#2A2F3E"
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                    <Animated.View
                                        style={[
                                            styles.activeStarMask,
                                            { width },
                                        ]}
                                    >
                                        <Star
                                            size={26}
                                            color="#FFD700"
                                            fill="#FFD700"
                                            strokeWidth={1.5}
                                        />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.scoreBadge}>
                    <Text
                        style={[
                            styles.scoreValue,
                            score > 0 && styles.scoreActive,
                        ]}
                    >
                        {score > 0 ? score : "--"}
                    </Text>
                    <Text style={styles.scoreTotal}>/ 10</Text>
                </View>
            </View>
        </View>
    );
};

// Стили остаются прежними
const styles = StyleSheet.create({
    container: { marginTop: 25 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    label: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    resetBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    resetText: { color: "#8E94A4", fontSize: 12 },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    starsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: 182,
        gap: 8,
    },
    starTouch: { padding: 2 },
    starWrapper: { width: 26, height: 26 },
    activeStarMask: {
        position: "absolute",
        top: 0,
        left: 0,
        height: 26,
        overflow: "hidden",
    },
    scoreBadge: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        alignItems: "center",
        minWidth: 65,
    },
    scoreValue: { color: "#2A2F3E", fontSize: 24, fontWeight: "900" },
    scoreActive: { color: "#FFD700" },
    scoreTotal: {
        color: "#8E94A4",
        fontSize: 10,
        marginTop: -2,
        fontWeight: "600",
    },
});
