import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BottomSheet } from "../../ui/BottomSheet";
import { DynamicIcon } from "./DynamicIcon";
import { useTheme } from "../../../hooks/useTheme";

export const AchievementDetailModal = ({ visible, onClose, achievement }) => {
    if (!achievement) return null;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const isCompleted = achievement.current >= achievement.target;

    return (
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
            <View style={styles.modalContent}>
                <View style={[styles.iconWrapper, isCompleted && styles.completedGlow]}>
                    <DynamicIcon
                        name={achievement.displayIconName}
                        size={54}
                        color={isCompleted ? theme.accent : theme.textDark}
                    />
                </View>

                <Text style={styles.modalTitle}>{achievement.displayTitle}</Text>
                <Text style={styles.modalDesc}>{achievement.displayDesc}</Text>

                {achievement.hidden && achievement.isCompleted ? (
                    <Text style={styles.secretNote}>Секретное достижение раскрыто!</Text>
                ) : null}

                <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                        <View
                            style={[
                                styles.progressBar,
                                {
                                    width: `${Math.min((achievement.current / achievement.target) * 100, 100)}%`,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.progressText, isCompleted && { color: theme.accent }]}>
                        {achievement.current} из {achievement.target}
                    </Text>
                </View>
            </View>
        </BottomSheet>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 25,
            borderWidth: 0,
        },
        modalContent: {
            alignItems: "center",
            paddingBottom: 10,
        },
        iconWrapper: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: theme.textDark,
        },
        completedGlow: {
            borderColor: theme.accent,
        },
        modalTitle: {
            color: theme.text,
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 8,
        },
        modalDesc: {
            color: theme.textDark,
            fontSize: 15,
            textAlign: "center",
            lineHeight: 22,
            paddingHorizontal: 10,
        },
        progressContainer: {
            width: "100%",
            alignItems: "center",
            marginTop: 25,
        },
        progressBarContainer: {
            width: "100%",
            height: 8,
            backgroundColor: theme.accentMuted,
            borderRadius: 10,
            overflow: "hidden",
        },
        progressBar: {
            height: "100%",
            borderRadius: 10,
            backgroundColor: theme.accent,
        },
        progressText: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "bold",
            marginTop: 10,
        },
        secretNote: {
            color: theme.accent,
            fontSize: 14,
            fontWeight: "700",
            marginTop: 8,
            textAlign: "center",
        },
    });
