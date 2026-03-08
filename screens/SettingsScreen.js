import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Хедер с кнопкой назад */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Настройки</Text>
            </View>

            {/* Контент заглушки */}
            <View style={styles.content}>
                <LinearGradient
                    colors={["#1E293B", "#0F172A"]}
                    style={styles.card}
                >
                    <Ionicons
                        name="construct-outline"
                        size={64}
                        color="#7D8AFF"
                        style={styles.icon}
                    />

                    <Text style={styles.title}>Раздел в разработке</Text>

                    <Text style={styles.subtitle}>
                        Мы уже вовсю работаем над этим экраном. Скоро здесь
                        появятся кошко-девочки!
                    </Text>
                </LinearGradient>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18", // Твой основной темный фон
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        height: 60,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#fff",
        marginLeft: 15,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    card: {
        width: "100%",
        padding: 40,
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
    button: {
        backgroundColor: "#7D8AFF",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
