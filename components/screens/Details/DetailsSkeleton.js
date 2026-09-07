import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

export const DetailsSkeleton = () => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);
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
            {/* 1. Хедер: Название карточки + круглый Info */}
            <View style={styles.headerRow}>
                <View style={styles.titleMock} />
                <View style={styles.infoIconMock} />
            </View>

            {/* 2. Быстрая дата (Рейтинг, Тип, Ограничение) */}
            <View style={styles.quickInfoRow}>
                <View style={[styles.textMock, { width: "16%" }]} />
                <View style={[styles.textMock, { width: "20%" }]} />
                <View style={[styles.textMock, { width: "14%" }]} />
            </View>

            {/* 3. Статусная плашка "Смотрю" */}
            <View style={styles.statusBadgeMock} />

            {/* 4. Кнопки действий (Папка + Избранное) */}
            <View style={styles.actionButtonsRow}>
                <View style={styles.actionBtnMock} />
                <View style={styles.actionBtnMock} />
            </View>

            {/* 5. Блок основной информации (Период выхода, Эпизоды, Длительность, Статус) */}
            <View style={styles.statsBoxMock}>
                {/* Период выхода */}
                <View style={[styles.textMock, { width: "35%", height: 10, marginBottom: 6 }]} />
                <View style={[styles.textMock, { width: "65%", height: 16, marginBottom: 16 }]} />

                {/* Эпизоды / Длительность / Статус */}
                <View style={styles.statsRow}>
                    <View style={styles.statsColumn}>
                        <View
                            style={[styles.textMock, { width: "70%", height: 10, marginBottom: 6 }]}
                        />
                        <View style={[styles.textMock, { width: "85%", height: 14 }]} />
                    </View>
                    <View style={styles.statsColumn}>
                        <View
                            style={[styles.textMock, { width: "80%", height: 10, marginBottom: 6 }]}
                        />
                        <View style={[styles.textMock, { width: "90%", height: 14 }]} />
                    </View>
                    <View style={styles.statsColumn}>
                        <View
                            style={[styles.textMock, { width: "60%", height: 10, marginBottom: 6 }]}
                        />
                        <View style={[styles.textMock, { width: "75%", height: 14 }]} />
                    </View>
                </View>
            </View>

            {/* 6. Текстовые метаданные (Автор, Студия, Первоисточник) */}
            <View style={styles.metaBlock}>
                <View style={styles.metaRow}>
                    <View style={[styles.textMock, { width: "18%" }]} />
                    <View style={[styles.textMock, { width: "30%" }]} />
                </View>
                <View style={styles.metaRow}>
                    <View style={[styles.textMock, { width: "22%" }]} />
                    <View style={[styles.textMock, { width: "45%" }]} />
                </View>
                <View style={styles.metaRow}>
                    <View style={[styles.textMock, { width: "32%" }]} />
                    <View style={[styles.textMock, { width: "20%" }]} />
                </View>
            </View>

            {/* 7. Жанры (Баджи) */}
            <View style={styles.genreRow}>
                <View style={[styles.badgeMock, { width: 72 }]} />
                <View style={[styles.badgeMock, { width: 88 }]} />
                <View style={[styles.badgeMock, { width: 130 }]} />
                <View style={[styles.badgeMock, { width: 95 }]} />
            </View>

            {/* 8. Заголовок Описания */}
            <View style={[styles.sectionTitleMock, { width: "32%" }]} />

            {/* 9. Текст Описания + Линк "Показать полностью..." */}
            <View style={styles.descriptionBlock}>
                <View style={styles.descLine} />
                <View style={styles.descLine} />
                <View style={[styles.descLine, { width: "85%" }]} />
                <View style={[styles.textMock, { width: "40%", height: 14, marginTop: 4 }]} />
            </View>
        </Animated.View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            width: "100%",
        },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
            gap: 12,
        },
        titleMock: {
            height: 26,
            flex: 1,
            backgroundColor: theme.textDark,
            borderRadius: 6,
        },
        infoIconMock: {
            height: 26,
            width: 26,
            backgroundColor: theme.accentMuted,
            borderRadius: 13,
        },
        quickInfoRow: {
            flexDirection: "row",
            gap: 10,
            marginBottom: 16,
            alignItems: "center",
        },
        textMock: {
            height: 12,
            backgroundColor: theme.textDark,
            borderRadius: 4,
        },
        statusBadgeMock: {
            height: 48,
            backgroundColor: theme.accentMuted,
            borderRadius: 14,
            marginBottom: 12,
        },
        actionButtonsRow: {
            flexDirection: "row",
            gap: 10,
            marginBottom: 16,
        },
        actionBtnMock: {
            flex: 1,
            height: 44,
            backgroundColor: theme.accentMuted,
            borderRadius: 12,
        },
        statsBoxMock: {
            backgroundColor: theme.dark,
            borderRadius: 16,
            padding: 16,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        statsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 8,
        },
        statsColumn: {
            flex: 1,
        },
        metaBlock: {
            gap: 8,
            marginBottom: 14,
        },
        metaRow: {
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
        },
        genreRow: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 24,
        },
        badgeMock: {
            height: 28,
            backgroundColor: theme.accentMuted,
            borderRadius: 8,
        },
        sectionTitleMock: {
            height: 22,
            backgroundColor: theme.textDark,
            borderRadius: 6,
            marginBottom: 12,
        },
        descriptionBlock: {
            gap: 8,
        },
        descLine: {
            height: 13,
            backgroundColor: theme.textDark,
            borderRadius: 4,
            width: "100%",
        },
    });
