import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Dimensions } from "react-native";
import { PlusCircle, Search } from "lucide-react-native";
import { useTheme } from "../../../../hooks/useTheme";

const { width } = Dimensions.get("window");

export const NoResultsFooter = ({ onPress }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.content}>
            <View style={styles.card}>
                <View style={styles.iconCircle}>
                    <Search size={40} color={theme.accent} />
                </View>

                <Text style={styles.title}>Ничего не нашли?</Text>

                <Text style={styles.subtitle}>
                    Добавьте это в свою коллекцию вручную, чтобы не потерять!
                </Text>

                <TouchableOpacity style={styles.addButton} onPress={onPress} activeOpacity={0.8}>
                    <PlusCircle size={24} color={theme.text} style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Добавить вручную</Text>
                </TouchableOpacity>
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
        addButton: {
            backgroundColor: theme.accent,
            width: "100%",
            height: 58,
            borderRadius: 18,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        addButtonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
    });
