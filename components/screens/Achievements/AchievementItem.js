import React, { useEffect, useRef, memo } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Animated } from "react-native";
import { ChevronRight, CheckCircle2 } from "lucide-react-native";
import { DynamicIcon } from "./DynamicIcon";
import { useTheme } from "../../../hooks/useTheme";

export const AchievementItem = memo(function AchievementItem({
    achievement,
    onPress,
    isHighlighted,
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const isCompleted = achievement.isCompleted;
    const progress = isCompleted ? 1 : Math.min(achievement.current / achievement.target, 1);

    const isLockedSecret = achievement.hidden && !isCompleted;
    const isUnlockedSecret = achievement.hidden && isCompleted;

    // Использование opacity позволяет включить useNativeDriver: true
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!isHighlighted) {
            pulseAnim.setValue(0);
            return;
        }

        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true, // Включаем нативный драйвер!
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            { iterations: 3 },
        );

        animation.start();

        return () => animation.stop();
    }, [isHighlighted, pulseAnim]);

    const handlePress = () => {
        onPress(achievement);
    };

    return (
        <View
            style={[
                styles.item,
                !isCompleted && styles.lockedItem,
                isUnlockedSecret && styles.secretUnlocked,
            ]}
        >
            {/* Нативный оверлей для пульсации подсветки без нагружения JS-потока */}
            {isHighlighted && (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        styles.highlightOverlay,
                        { opacity: pulseAnim },
                    ]}
                    pointerEvents="none"
                />
            )}

            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.touchableArea}
            >
                <View style={styles.leftContainer}>
                    <View style={[styles.iconWrapper, isCompleted && styles.completedIcon]}>
                        <DynamicIcon
                            name={achievement.displayIconName}
                            size={22}
                            color={isCompleted ? theme.accent : theme.textDark}
                        />
                    </View>

                    <View style={styles.textInfo}>
                        <Text
                            style={[styles.label, !isLockedSecret && styles.labelWithMargin]}
                            numberOfLines={1}
                        >
                            {achievement.displayTitle}
                        </Text>
                        {!isLockedSecret && (
                            <View style={styles.progressTrack}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { width: `${progress * 100}%` },
                                        isCompleted && styles.completedFill,
                                    ]}
                                />
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.rightContainer}>
                    {isCompleted ? (
                        <CheckCircle2 size={18} color={theme.accent} />
                    ) : (
                        <Text style={styles.progressText}>
                            {isLockedSecret
                                ? "? / ?"
                                : `${achievement.current}/${achievement.target}`}
                        </Text>
                    )}
                    <ChevronRight size={18} color={theme.textDark} style={styles.chevron} />
                </View>
            </TouchableOpacity>
        </View>
    );
});

const createLocalStyles = (theme) =>
    StyleSheet.create({
        item: {
            borderRadius: 20,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.accent,
            overflow: "hidden",
            backgroundColor: theme.main,
            position: "relative",
        },
        highlightOverlay: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
            borderWidth: 1,
            borderRadius: 20,
        },
        touchableArea: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 14,
            paddingHorizontal: 16,
            zIndex: 1,
        },
        secretUnlocked: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        lockedItem: {
            opacity: 0.4,
        },
        leftContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        iconWrapper: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.dark,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        completedIcon: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        textInfo: {
            flex: 1,
            justifyContent: "center",
            marginRight: 10,
        },
        label: {
            color: theme.text,
            fontSize: 15,
            fontWeight: "600",
        },
        labelWithMargin: {
            marginBottom: 6,
        },
        progressTrack: {
            height: 4,
            backgroundColor: theme.dark,
            borderRadius: 2,
            width: "90%",
            overflow: "hidden",
        },
        progressFill: {
            height: "100%",
            backgroundColor: theme.accent,
            borderRadius: 2,
        },
        completedFill: {
            backgroundColor: theme.accent,
        },
        rightContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        progressText: {
            color: theme.textDark,
            fontSize: 11,
            fontWeight: "700",
        },
        chevron: {
            marginLeft: 8,
        },
    });
