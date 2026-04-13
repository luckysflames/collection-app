import React from "react";
import { ChevronDown } from "lucide-react-native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const FolderInfo = ({ folder, count, onStatusPress, onAddPress }) => {
    return (
        <View style={styles.container}>
            {/* Название и описание */}
            <Text style={styles.folderTitle}>{folder.title}</Text>

            {folder.description ? (
                <Text style={styles.folderDescription}>
                    {folder.description}
                </Text>
            ) : null}

            <View style={styles.controlsRow}>
                {/* Кнопка статуса */}
                <TouchableOpacity
                    onPress={onStatusPress}
                    style={styles.folderStatusBtn}
                >
                    <Text style={styles.folderStatusText}>
                        {folder.status || "Нет статуса"}
                    </Text>
                    <ChevronDown
                        color="#fff"
                        size={16}
                        style={{ alignSelf: "flex-end" }}
                    />
                </TouchableOpacity>

                {/* Новая кнопка добавления рядом или под статусом */}
                <TouchableOpacity
                    onPress={onAddPress}
                    style={styles.addCardsBtn}
                >
                    <Text style={styles.addCardsText}>+ Карточки</Text>
                </TouchableOpacity>
            </View>

            {/* Мета-бейдж */}
            <View style={styles.metaBadge}>
                <Text style={styles.metaText}>
                    {count} карточек • {folder.appSection || "Общее"}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 18,
        alignItems: "center",
    },
    folderTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#fff",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    folderDescription: {
        fontSize: 15,
        color: "#8E94A4",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
    controlsRow: {
        width: "100%", // Убеждаемся, что ряд занимает всю ширину
        flexDirection: "row",
        alignItems: "stretch", // Растягиваем кнопки по высоте ряда
        gap: 12,
        marginTop: 20,
        paddingHorizontal: 0, // Внутри контейнера уже есть paddingHorizontal
    },
    folderStatusBtn: {
        flex: 1, // Занимает ровно 50% (минус половина gap)
        flexDirection: "row",
        borderColor: "#7D8AFF",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1.5,
        justifyContent: "center", // Важно для выравнивания текста
        alignItems: "center",
    },
    addCardsBtn: {
        flex: 1, // Занимает ровно 50% (минус половина gap)
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
        justifyContent: "center", // Важно для выравнивания текста
        alignItems: "center",
    },
    addCardsText: {
        color: "#7D8AFF",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 14,
    },
    folderStatusText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 14,
    },
    metaBadge: {
        marginVertical: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderRadius: 8,
    },
    metaText: {
        fontSize: 11,
        color: "#7D8AFF",
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});
