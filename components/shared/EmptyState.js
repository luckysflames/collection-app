import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FolderOpen, Inbox } from "lucide-react-native";

export const EmptyState = ({ category, isInsideFolder }) => {
    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                {isInsideFolder ? (
                    <FolderOpen size={42} color="rgba(125, 138, 255, 0.3)" />
                ) : (
                    <Inbox size={42} color="rgba(125, 138, 255, 0.3)" />
                )}
            </View>

            {isInsideFolder ? (
                <>
                    <Text style={styles.emptyTitle}>
                        В папке пока ничего нет
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Вы можете добавить сюда карточки из вашей коллекции
                    </Text>
                </>
            ) : (
                <Text style={styles.emptyText}>
                    В разделе "{category}" пока пусто
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: "center",
        marginTop: 60,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(125, 138, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8E94A4",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        opacity: 0.7,
    },
    emptyText: {
        color: "#4E5564",
        fontSize: 15,
        textAlign: "center",
    },
});
