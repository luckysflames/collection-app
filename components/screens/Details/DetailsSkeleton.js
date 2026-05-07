// components/screens/Details/DetailsSkeleton.js
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

export const DetailsSkeleton = () => {
    // Анимация пульсации (изменение прозрачности)
    const pulseAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 0.7,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, [pulseAnim]);

    return (
        <Animated.View style={[styles.container, { opacity: pulseAnim }]}>
            {/* 1. Хедер: Название карточки + иконка Info */}
            <View style={styles.headerRow}>
                <View style={styles.titleMock} />
                <View style={styles.infoIconMock} />
            </View>

            {/* 2. Быстрая дата (Рейтинг, Эпизоды/Главы) */}
            <View style={styles.quickInfoRow}>
                <View style={[styles.textMock, { width: "25%" }]} />
                <View style={[styles.textMock, { width: "20%" }]} />
                <View style={[styles.textMock, { width: "15%" }]} />
            </View>

            {/* 3. Кнопка "Добавить в коллекцию" / Статус */}
            <View style={styles.statusBadgeMock} />

            {/* 4. Кнопки действий (Папка + Избранное) */}
            <View style={styles.actionButtonsRow}>
                <View style={styles.actionBtnMock} />
                <View style={styles.actionBtnMock} />
            </View>

            {/* 5. Блок основной информации (InfoStats) */}
            <View style={styles.statsBoxMock}>
                <View style={styles.statsRow}>
                    <View style={styles.statsItem} />
                    <View style={styles.statsItem} />
                    <View style={styles.statsItem} />
                </View>
            </View>

            {/* 6. Жанры (Значки / Баджи) */}
            <View style={styles.genreRow}>
                <View style={[styles.badgeMock, { width: 70 }]} />
                <View style={[styles.badgeMock, { width: 90 }]} />
                <View style={[styles.badgeMock, { width: 60 }]} />
            </View>

            {/* 7. Заголовок Описания */}
            <View style={[styles.sectionTitleMock, { width: "35%" }]} />

            {/* 8. Строки Описания */}
            <View style={styles.descriptionBlock}>
                <View style={styles.descLine} />
                <View style={styles.descLine} />
                <View style={[styles.descLine, { width: "70%" }]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    // Вся подложка использует полупрозрачный белый поверх глубокого синего #050B18
    mockBase: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 8,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        gap: 10,
    },
    titleMock: {
        height: 28,
        flex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 8,
    },
    infoIconMock: {
        height: 25,
        width: 25,
        backgroundColor: "rgba(125, 138, 255, 0.15)", // Слегка фиолетовый оттенок lucide иконки
        borderRadius: 50,
    },
    quickInfoRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 18,
    },
    textMock: {
        height: 14,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 4,
    },
    statusBadgeMock: {
        height: 46,
        backgroundColor: "rgba(125, 138, 255, 0.2)", // Имитирует яркую кнопку/бордер
        borderRadius: 12,
        marginBottom: 20,
    },
    actionButtonsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
        marginTop: -5,
    },
    actionBtnMock: {
        flex: 1,
        height: 38,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
    },
    statsBoxMock: {
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.03)",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    statsItem: {
        flex: 1,
        height: 45,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 8,
    },
    genreRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginBottom: 25,
    },
    badgeMock: {
        height: 24,
        backgroundColor: "rgba(125, 138, 255, 0.06)", // Оттенок твоих жанровых баджей
        borderRadius: 8,
    },
    sectionTitleMock: {
        height: 22,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 6,
        marginBottom: 14,
    },
    descriptionBlock: {
        gap: 8,
    },
    descLine: {
        height: 14,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 4,
        width: "100%",
    },
});
