import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FolderOpen, Inbox } from "lucide-react-native";
import { useTheme } from "../../hooks/useTheme";

export const EmptyState = ({ category, isInsideFolder }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                {isInsideFolder ? (
                    <FolderOpen size={42} color={theme.accent} />
                ) : (
                    <Inbox size={42} color={theme.accent} />
                )}
            </View>

            {isInsideFolder ? (
                <>
                    <Text style={styles.emptyTitle}>В папке пока ничего нет</Text>
                    <Text style={styles.emptySubtitle}>
                        Вы можете добавить сюда карточки из вашей коллекции
                    </Text>
                </>
            ) : (
                <Text style={styles.emptyText}>В разделе "{category}" пока пусто</Text>
            )}
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        emptyContainer: {
            alignItems: "center",
            marginTop: 60,
            paddingHorizontal: 40,
        },
        emptyIconCircle: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: theme.main,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
        },
        emptyTitle: {
            color: theme.text,
            fontSize: 17,
            fontWeight: "600",
            marginBottom: 8,
        },
        emptySubtitle: {
            color: theme.textDark,
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            opacity: 0.7,
        },
        emptyText: {
            color: theme.textDark,
            fontSize: 15,
            textAlign: "center",
        },
    });
