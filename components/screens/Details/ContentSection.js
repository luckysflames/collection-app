import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from "react-native";
import { Star } from "lucide-react-native";
import { InfoBlock } from "./InfoBlock/InfoBlock";
import { UserRating } from "../../shared/UserRating";
import { RelatedCarousel } from "./InfoBlock/RelatedCarousel";
import { ScreenshotCarousel } from "./InfoBlock/ScreenshotCarousel";

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
    onNavigateToDetails,
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
                    numberOfLines={isExpanded ? 0 : 3}
                >
                    {displayData.description ||
                        "Описание временно отсутствует."}
                </Text>
                {!isExpanded && displayData.description?.length > 100 && (
                    <Text style={styles.moreText}>Показать полностью...</Text>
                )}
            </TouchableOpacity>

            <View style={styles.separator} />

            {displayData.type === "anime" && (
                <ScreenshotCarousel screenshots={displayData.screenshots} />
            )}

            {isInCollection && (
                <View style={styles.userSection}>
                    <UserRating
                        score={savedItem?.userScore || 0}
                        onSetScore={onSetScore}
                        onInfoPress={onInfoPress}
                    />
                </View>
            )}

            {/* Связанное аниме */}
            {displayData.type === "anime" && (
                <RelatedCarousel
                    related={displayData.related}
                    onNavigateToDetails={onNavigateToDetails}
                />
            )}

            {isInCollection && (
                <View style={styles.userSection}>
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
    userSection: {
        paddingBottom: 20,
    },
    notesInput: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        padding: 15,
        color: "#fff",
        minHeight: 120,
    },
});
