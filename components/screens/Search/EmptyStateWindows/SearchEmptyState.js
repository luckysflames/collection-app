import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./style";

export const SearchEmptyState = () => (
    <View style={styles.content}>
        <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: "#7D8AFF15" }]}>
                <Ionicons name="information-circle" size={40} color="#7D8AFF" />
            </View>

            <Text style={styles.title}>Предупреждение</Text>

            <Text style={styles.subtitle}>
                Мы не отвечаем{"\n"}за результаты поиска.{"\n"}Подробнее:{"\n"}
                "Настройки" &gt; "Используемые API"
            </Text>
        </View>
    </View>
);
