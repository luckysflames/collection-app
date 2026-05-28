import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Star, RotateCcw, Info, Gem } from "lucide-react-native"; // Добавил иконку Gem для красоты

export const UserRating = ({ score, onSetScore, onInfoPress, isBrilliant, onToggleBrilliant }) => {
    const prevScore = useRef(score);
    const isBlocking = useRef(false);
    const [visualLock, setVisualLock] = useState(false);

    const starAnims = useRef(
        [...Array(10)].map((_, i) => new Animated.Value(i < score ? 1 : 0)),
    ).current;

    const handleSetScore = (newScore) => {
        if (isBlocking.current || newScore === score) return;
        onSetScore(newScore);
    };

    useEffect(() => {
        if (score === prevScore.current) return;

        const isReducing = score < prevScore.current;
        isBlocking.current = true;
        setVisualLock(true);

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
                        <RotateCcw size={14} color={visualLock ? "#4A4D57" : "#8E94A4"} />
                        <Text style={[styles.resetText, visualLock && { color: "#4A4D57" }]}>
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
                                    <Animated.View style={[styles.activeStarMask, { width }]}>
                                        <Star
                                            size={26}
                                            color={isBrilliant ? "#7D8AFF" : "#FFD700"} // Алмазные звезды, если включен шедевр
                                            fill={isBrilliant ? "#7D8AFF" : "#FFD700"}
                                            strokeWidth={1.5}
                                        />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* БАДЖ ОЦЕНКИ С ПОДДЕРЖКОЙ БЕСКОНЕЧНОСТИ */}
                <View style={[styles.scoreBadge, isBrilliant && styles.scoreBadgeBrilliant]}>
                    <Text
                        style={[
                            styles.scoreValue,
                            score > 0 && styles.scoreActive,
                            isBrilliant && styles.scoreBrilliantText,
                        ]}
                    >
                        {isBrilliant ? "∞" : score > 0 ? score : "--"}
                    </Text>
                    <Text style={styles.scoreTotal}>/ 10</Text>
                </View>
            </View>

            {/* БЛОК ПРЕДЛОЖЕНИЯ «ШЕДЕВРА» (ТОЛЬКО ДЛЯ 10/10) */}
            {score === 10 && (
                <View style={styles.brilliantPrompt}>
                    <Text style={styles.brilliantPromptText}>
                        {isBrilliant
                            ? "Это абсолютный пик!"
                            : "Это абсолютный пик?"}
                    </Text>
                    <TouchableOpacity
                        style={[styles.brilliantBtn, isBrilliant && styles.brilliantBtnActive]}
                        onPress={onToggleBrilliant}
                        activeOpacity={0.8}
                    >
                        <Gem
                            size={14}
                            color={isBrilliant ? "#fff" : "#7D8AFF"}
                            style={{ marginRight: 6 }}
                        />
                        <Text
                            style={[
                                styles.brilliantBtnText,
                                isBrilliant && styles.brilliantBtnTextActive,
                            ]}
                        >
                            {isBrilliant ? "Отобрать бриллиант" : "Выдать бриллиант"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

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
    scoreBadgeBrilliant: {
        backgroundColor: "rgba(125, 138, 255, 0.2)",
        borderColor: "rgba(125, 138, 255, 0.4)",
        borderWidth: 1,
    },
    scoreValue: { color: "#2A2F3E", fontSize: 24, fontWeight: "900" },
    scoreActive: { color: "#FFD700" },
    scoreBrilliantText: { color: "#7D8AFF", fontSize: 28, marginTop: -4 }, // Фикс размера для красивой бесконечности
    scoreTotal: {
        color: "#8E94A4",
        fontSize: 10,
        marginTop: -2,
        fontWeight: "600",
    },
    // Стили для нового интерактивного блока под карточкой
    brilliantPrompt: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.06)",
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.12)",
    },
    brilliantPromptText: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "500",
        flex: 1,
    },
    brilliantBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    brilliantBtnActive: {
        backgroundColor: "#7D8AFF",
    },
    brilliantBtnText: {
        color: "#7D8AFF",
        fontSize: 12,
        fontWeight: "bold",
    },
    brilliantBtnTextActive: {
        color: "#fff",
    },
});
