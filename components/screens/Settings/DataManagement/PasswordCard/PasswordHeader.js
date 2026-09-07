import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../../hooks/useTheme";
import { ShieldAlert, ShieldCheck } from "lucide-react-native";

export const PasswordHeader = ({ hasPassword }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.cardHeader}>
            <View
                style={[
                    styles.iconBadge,
                    {
                        backgroundColor: hasPassword ? theme.accentMuted : theme.redMuted,
                    },
                ]}
            >
                {hasPassword ? (
                    <ShieldCheck size={24} color={theme.accent} />
                ) : (
                    <ShieldAlert size={24} color={theme.red} />
                )}
            </View>
            <View style={styles.headerTextContainer}>
                <Text style={styles.cardMainTitle}>Мастер-пароль</Text>
                <Text style={[styles.statusTag, { color: hasPassword ? theme.accent : theme.red }]}>
                    {hasPassword ? "Защита активна" : "Уязвим: не задан"}
                </Text>
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
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
            color: theme.text,
            fontSize: 17,
            fontWeight: "700",
        },
        statusTag: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 2,
        },
    });
