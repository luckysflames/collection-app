import React, { useState } from "react"; // Добавили useState
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from "react-native";
import { Star } from "lucide-react-native"; // Импортируем звезду для рейтинга
import { InfoBlock } from "./InfoBlock/index";
import { UserRating } from "./UserRating";

export const ContentSection = ({
    displayData,
    savedItem,
    isInCollection,
    isFavorite,
    folderLabel,
    isAnyFolderSelected,
    onStatusPress,
    onFolderPress,
    onToggleFavorite,
    onUpdateNotes,
    onSetScore,
    onInfoPress,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View>
            <InfoBlock
                status={savedItem?.status}
                isInCollection={isInCollection}
                isFavorite={isFavorite}
                folderLabel={folderLabel}
                isAnyFolderSelected={isAnyFolderSelected}
                onStatusPress={onStatusPress}
                onFolderPress={onFolderPress}
                onToggleFavorite={onToggleFavorite}
                displayData={displayData}
            />

            <Text style={styles.sectionTitle}>Описание</Text>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <Text
                    style={styles.description}
                    numberOfLines={isExpanded ? 0 : 3} // 0 означает без ограничений
                >
                    {displayData.description ||
                        "Описание временно отсутствует."}
                </Text>
                {!isExpanded && displayData.description?.length > 100 && (
                    <Text style={styles.moreText}>Показать полностью...</Text>
                )}
            </TouchableOpacity>

            {isInCollection && (
                <View style={styles.userSection}>
                    <UserRating
                        score={savedItem?.userScore || 0}
                        onSetScore={onSetScore}
                        onInfoPress={onInfoPress}
                    />

                    <Text style={styles.sectionTitle}>Мои заметки</Text>
                    <TextInput
                        style={styles.notesInput}
                        multiline
                        value={savedItem.userNotes || ""}
                        onChangeText={onUpdateNotes}
                        placeholder="Ваши мысли..."
                        placeholderTextColor="#444"
                        textAlignVertical="top"
                    />
                </View>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    editToggle: {
        alignSelf: "flex-start",
        marginTop: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#7D8AFF",
    },
    editToggleText: {
        color: "#7D8AFF",
        fontSize: 14,
        fontWeight: "500",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 12,
    },
    description: {
        color: "#8E94A4",
        fontSize: 16,
        lineHeight: 24,
    },
    moreText: {
        color: "#7D8AFF",
        fontSize: 14,
        marginTop: 5,
        fontWeight: "500",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "rgba(255,255,255,0.03)",
        padding: 12,
        borderRadius: 15,
        gap: 6,
    },
    starButton: {
        padding: 2,
    },
    scoreText: {
        color: "#FFD700",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    userSection: {
        marginTop: 10,
        paddingBottom: 60,
    },
    notesInput: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        padding: 15,
        color: "#fff",
        minHeight: 120,
    },
});
