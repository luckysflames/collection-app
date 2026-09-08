import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { Star, RotateCcw, Info, Gem } from "lucide-react-native"; // Добавил иконку Gem для красоты
import { useTheme } from "../../hooks/useTheme";

export const UserRating = ({ score, onSetScore, onInfoPress, isBrilliant, onToggleBrilliant }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [visualScore, setVisualScore] = useState(score);
    const prevScore = useRef(visualScore);
    const pendingScore = useRef(null);
    const [visualLock, setVisualLock] = useState(false);

    const starAnims = useRef(
        [...Array(10)].map((_, i) => new Animated.Value(i < visualScore ? 1 : 0)),
    ).current;

    const handleSetScore = (newScore) => {
        if (newScore === visualScore) return;

        starAnims.forEach((anim, index) => {
            anim.stopAnimation();
            anim.setValue(index < newScore ? 1 : 0);
        });
        prevScore.current = newScore;
        pendingScore.current = newScore;
        setVisualScore(newScore);
        onSetScore(newScore);
    };

    useEffect(() => {
        if (pendingScore.current !== null) {
            if (score !== pendingScore.current) return;
            pendingScore.current = null;
        }

        if (score !== visualScore) setVisualScore(score);
    }, [score, visualScore]);

    useEffect(() => {
        if (visualScore === prevScore.current) return;

        const isReducing = visualScore < prevScore.current;
        setVisualLock(true);

        starAnims.forEach((anim) => anim.stopAnimation());

        let animationObjects = starAnims.map((anim, i) => ({
            index: i,
            animation: Animated.timing(anim, {
                toValue: i < visualScore ? 1 : 0,
                duration: 30,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
        }));

        let activeAnimations = animationObjects.filter(({ index }) => {
            if (isReducing) {
                return index >= visualScore && index < prevScore.current;
            } else {
                return index >= prevScore.current && index < visualScore;
            }
        });

        if (isReducing) {
            activeAnimations.reverse();
        }

        const finalAnims = activeAnimations.map((obj) => obj.animation);

        if (finalAnims.length > 0) {
            Animated.parallel(finalAnims).start(() => {
                setVisualLock(false);
                prevScore.current = visualScore;
            });
        } else {
            setVisualLock(false);
            prevScore.current = visualScore;
        }
    }, [visualScore]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Моя оценка</Text>
                    <TouchableOpacity onPress={onInfoPress} hitSlop={10}>
                        <Info size={18} color={theme.accent} />
                    </TouchableOpacity>
                </View>
                {visualScore > 0 && (
                    <TouchableOpacity
                        onPress={() => handleSetScore(0)}
                        style={styles.resetBtn}
                        hitSlop={10}
                        activeOpacity={visualLock ? 1 : 0.7}
                    >
                        <RotateCcw size={14} color={visualLock ? theme.textDark : theme.accent} />
                        <Text style={[styles.resetText, visualLock && { color: theme.textDark }]}>
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
                                        color={theme.textDark}
                                        fill="transparent"
                                        strokeWidth={2}
                                    />
                                    <Animated.View style={[styles.activeStarMask, { width }]}>
                                        <Star
                                            size={26}
                                            color={isBrilliant ? theme.accent : theme.yellow}
                                            fill={isBrilliant ? theme.accent : theme.yellow}
                                            strokeWidth={1.5}
                                        />
                                    </Animated.View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={[styles.scoreBadge, isBrilliant && styles.scoreBadgeBrilliant]}>
                    <Text
                        style={[
                            styles.scoreValue,
                            visualScore > 0 && styles.scoreActive,
                            isBrilliant && styles.scoreBrilliantText,
                        ]}
                    >
                        {isBrilliant ? "∞" : visualScore > 0 ? visualScore : "--"}
                    </Text>
                    <Text style={styles.scoreTotal}>/ 10</Text>
                </View>
            </View>

            {visualScore === 10 && (
                <View style={styles.brilliantPrompt}>
                    <Text style={styles.brilliantPromptText}>
                        {isBrilliant ? "Это абсолютный пик!" : "Это абсолютный пик?"}
                    </Text>
                    <TouchableOpacity
                        style={[styles.brilliantBtn, isBrilliant && styles.brilliantBtnActive]}
                        onPress={onToggleBrilliant}
                        activeOpacity={0.8}
                    >
                        <Gem
                            size={14}
                            color={isBrilliant ? theme.text : theme.accent}
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { marginTop: 25 },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
        },
        labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
        label: { color: theme.text, fontSize: 18, fontWeight: "bold" },
        resetBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
        resetText: { color: theme.accent, fontSize: 12 },
        card: {
            backgroundColor: theme.main,
            borderRadius: 24,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
            backgroundColor: theme.accentMuted,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 16,
            alignItems: "center",
            minWidth: 65,
        },
        scoreBadgeBrilliant: {
            borderColor: theme.accent,
            borderWidth: 1,
        },
        scoreValue: { color: theme.textDark, fontSize: 24, fontWeight: "900" },
        scoreActive: { color: theme.yellow },
        scoreBrilliantText: { color: theme.accent, fontSize: 28, marginTop: -4 },
        scoreTotal: {
            color: theme.text,
            fontSize: 10,
            marginTop: -2,
            fontWeight: "600",
        },
        brilliantPrompt: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.main,
            borderRadius: 16,
            paddingVertical: 10,
            paddingHorizontal: 14,
            marginTop: 10,
        },
        brilliantPromptText: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "500",
            flex: 1,
        },
        brilliantBtn: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.accentMuted,
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 10,
        },
        brilliantBtnActive: {
            backgroundColor: theme.accent,
        },
        brilliantBtnText: {
            color: theme.accent,
            fontSize: 12,
            fontWeight: "bold",
        },
        brilliantBtnTextActive: {
            color: theme.text,
        },
    });
