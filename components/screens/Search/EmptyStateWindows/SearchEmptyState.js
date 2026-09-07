import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Info } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

const { width } = Dimensions.get("window");

export const SearchEmptyState = () => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.content}>
            <View style={styles.card}>
                <View style={styles.iconCircle}>
                    <Info size={40} color={theme.accent} />
                </View>

                <Text style={styles.title}>Предупреждение</Text>

                <Text style={styles.subtitle}>
                    Мы не отвечаем{"\n"}за результаты поиска.{"\n"}Подробнее:{"\n"}
                    "Настройки" &gt; "Используемые API"
                </Text>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        content: {
            marginTop: 40,
            alignItems: "center",
            paddingHorizontal: 20,
        },
        card: {
            width: width * 0.85,
            backgroundColor: theme.main,
            borderRadius: 32,
            padding: 24,
            alignItems: "center",
        },
        iconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: theme.accentMuted,
        },
        title: {
            color: theme.text,
            fontSize: 22,
            fontWeight: "700",
            marginBottom: 12,
            textAlign: "center",
        },
        subtitle: {
            color: theme.textDark,
            fontSize: 16,
            textAlign: "center",
            lineHeight: 24,
            marginBottom: 24,
        },
    });
