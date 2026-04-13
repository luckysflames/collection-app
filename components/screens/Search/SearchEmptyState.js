import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export const SearchEmptyState = () => (
    <View style={styles.content}>
        <LinearGradient colors={["#1E293B", "#0F172A"]} style={styles.card}>
            <Ionicons
                name="search"
                size={64}
                color="#7D8AFF"
                style={styles.icon}
            />
            <Text style={styles.title}>Предупреждение</Text>
            <Text style={styles.subtitle}>
                Мы не отвечаем за результаты поиска. Подробнее:{"\n"}
                "Настройки" &gt; "Используемые API"
            </Text>
        </LinearGradient>
    </View>
);

const styles = StyleSheet.create({
    content: {
        marginVertical: 30,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    card: {
        width: "100%",
        padding: 10,
        borderRadius: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)", // Тонкая светящаяся рамка
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        marginBottom: 15,
    },
    subtitle: {
        fontSize: 16,
        color: "#8E94A4",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 30,
    },
});
