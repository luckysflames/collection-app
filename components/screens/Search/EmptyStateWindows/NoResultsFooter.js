import React from "react";
import { TouchableOpacity, Text, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./style";

export const NoResultsFooter = ({ onPress }) => (
    <View style={styles.content}>
        <View style={styles.card}>
            <View style={[styles.iconCircle, { backgroundColor: "#7D8AFF15" }]}>
                <Ionicons name="search" size={40} color="#7D8AFF" />
            </View>

            <Text style={styles.title}>Ничего не нашли?</Text>

            <Text style={styles.subtitle}>
                Добавьте это в свою коллекцию вручную, чтобы не потерять!
            </Text>

            <TouchableOpacity
                style={styles.addButton}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Ionicons
                    name="add-circle"
                    size={24}
                    color="#FFF"
                    style={{ marginRight: 8 }}
                />
                <Text style={styles.addButtonText}>Добавить вручную</Text>
            </TouchableOpacity>
        </View>
    </View>
);
