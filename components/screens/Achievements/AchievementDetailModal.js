import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { BottomSheet } from "../../ui/BottomSheet";
import { DynamicIcon } from "./DynamicIcon";

export const AchievementDetailModal = ({ visible, onClose, achievement }) => {
    if (!achievement) return null;

    const isCompleted = achievement.current >= achievement.target;

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.sheetContainer}
        >
            <View style={styles.modalContent}>
                {/* Иконка (аналог avatarWrapper из DevModal) */}
                <View
                    style={[
                        styles.iconWrapper,
                        isCompleted && styles.completedGlow,
                    ]}
                >
                    <DynamicIcon
                        name={achievement.displayIconName}
                        size={54}
                        // Меняем цвет иконки в зависимости от статуса
                        color={isCompleted ? "#7D8AFF" : "#4f5670"}
                    />
                </View>

                <Text style={styles.modalTitle}>
                    {achievement.displayTitle}
                </Text>
                <Text style={styles.modalDesc}>{achievement.displayDesc}</Text>

                {achievement.hidden && achievement.isCompleted ? (
                    <Text style={styles.secretNote}>
                        Секретное достижение раскрыто!
                    </Text>
                ) : null}

                {/* Прогресс-бар */}
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
                    <Text
                        style={[
                            styles.progressText,
                            isCompleted && { color: "#7D8AFF" },
                        ]}
                    >
                        {achievement.current} из {achievement.target}
                    </Text>
                </View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
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
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    completedGlow: {
        borderColor: "#7D8AFF",
        backgroundColor: "rgba(125, 138, 255, 0.15)",
    },
    modalTitle: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 8,
    },
    modalDesc: {
        color: "#8E94A4",
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
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 10,
        backgroundColor: "#7D8AFF",
    },
    progressText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
        marginTop: 10,
    },
    secretNote: {
        color: "#7D8AFF",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
        textAlign: "center",
    },
});
