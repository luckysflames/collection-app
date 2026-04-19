import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const PasswordHeader = ({ hasPassword }) => (
    <View style={styles.cardHeader}>
        <View
            style={[
                styles.iconBadge,
                {
                    backgroundColor: hasPassword
                        ? "rgba(74, 222, 128, 0.1)"
                        : "rgba(255, 107, 107, 0.1)",
                },
            ]}
        >
            <Ionicons
                name={hasPassword ? "shield-checkmark" : "shield-outline"}
                size={22}
                color={hasPassword ? "#4ADE80" : "#FF6B6B"}
            />
        </View>
        <View style={styles.headerTextContainer}>
            <Text style={styles.cardMainTitle}>Мастер-пароль</Text>
            <Text
                style={[
                    styles.statusTag,
                    { color: hasPassword ? "#4ADE80" : "#FF6B6B" },
                ]}
            >
                {hasPassword ? "Защита активна" : "Уязвим: не задан"}
            </Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    headerTextContainer: {
        flex: 1,
    },
    cardMainTitle: {
        color: "#FFF",
        fontSize: 17,
        fontWeight: "700",
    },
    statusTag: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 2,
    },
});
