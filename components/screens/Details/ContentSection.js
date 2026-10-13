import React, { useState, memo, useCallback } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { InfoBlock } from "./InfoBlock/InfoBlock";
import { UserRating } from "../../shared/UserRating";
import { RelatedCarousel } from "./InfoBlock/RelatedCarousel";
import { ScreenshotCarousel } from "./InfoBlock/ScreenshotCarousel";
import { useTheme } from "../../../hooks/useTheme";

const ContentSectionComponent = ({
    displayData,
    savedItem,
    status,
    isInCollection,
    isFavorite,
    folderLabel,
    isAnyFolderSelected,
    isBrilliant,
    onToggleBrilliant,
    onStatusPress,
    onStudioPress,
    onFolderPress,
    onToggleFavorite,
    onUpdateNotes,
    onSetScore,
    onInfoPress,
    onNavigateToDetails,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [isExpanded, setIsExpanded] = useState(false);

    const handleDescriptionPress = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const handleStatusPressLocal = useCallback(() => {
        onStatusPress?.();
    }, [onStatusPress]);

    const handleStudioPressLocal = useCallback(() => {
        onStudioPress?.();
    }, [onStudioPress]);

    const handleFolderPressLocal = useCallback(() => {
        onFolderPress?.();
    }, [onFolderPress]);

    const handleToggleFavoriteLocal = useCallback(() => {
        onToggleFavorite?.();
    }, [onToggleFavorite]);

    const handleScoreLoca = useCallback(
        (score) => {
            onSetScore?.(score);
        },
        [onSetScore],
    );

    const handleInfoPressLocal = useCallback(() => {
        onInfoPress?.();
    }, [onInfoPress]);

    const handleNotesUpdate = useCallback(
        (text) => {
            onUpdateNotes?.(text);
        },
        [onUpdateNotes],
    );

    const handleNavigateLocal = useCallback(
        (item) => {
            onNavigateToDetails?.(item);
        },
        [onNavigateToDetails],
    );

    const handleToggleBrilliantLocal = useCallback(() => {
        onToggleBrilliant?.();
    }, [onToggleBrilliant]);

    const canShowBrilliant = savedItem?.userScore === 10;

    return (
        <View>
            <InfoBlock
                status={status}
                isInCollection={isInCollection}
                isFavorite={isFavorite}
                folderLabel={folderLabel}
                isAnyFolderSelected={isAnyFolderSelected}
                selectedStudio={savedItem?.selectedStudio}
                onStudioPress={handleStudioPressLocal}
                onStatusPress={handleStatusPressLocal}
                onFolderPress={handleFolderPressLocal}
                onToggleFavorite={handleToggleFavoriteLocal}
                displayData={displayData}
            />

            <Text style={styles.sectionTitle}>Описание</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleDescriptionPress}>
                <Text style={styles.description} numberOfLines={isExpanded ? 0 : 3}>
                    {displayData.description || "Описание временно отсутствует."}
                </Text>
                {!isExpanded && displayData.description?.length > 100 && (
                    <Text style={styles.moreText}>Показать полностью...</Text>
                )}
            </TouchableOpacity>

            <View style={styles.separator} />

            {displayData.type === "anime" && displayData.screenshots.length > 0 && (
                <ScreenshotCarousel screenshots={displayData.screenshots} />
            )}

            {isInCollection && (
                <View style={styles.userSection}>
                    <UserRating
                        score={savedItem?.userScore || 0}
                        onSetScore={handleScoreLoca}
                        onInfoPress={handleInfoPressLocal}
                        isBrilliant={isBrilliant}
                        onToggleBrilliant={handleToggleBrilliantLocal}
                        showBrilliantPrompt={canShowBrilliant}
                    />
                </View>
            )}

            {(displayData.type === "anime" ||
                displayData.type === "manga" ||
                displayData.type === "tv") && (
                <RelatedCarousel
                    related={displayData.related}
                    onNavigateToDetails={handleNavigateLocal}
                />
            )}

            {isInCollection && (
                <View style={styles.userSection}>
                    <Text style={styles.sectionTitle}>Мои заметки</Text>
                    <TextInput
                        style={styles.notesInput}
                        multiline
                        value={savedItem.userNotes || ""}
                        onChangeText={handleNotesUpdate}
                        placeholder="Ваши мысли..."
                        placeholderTextColor={theme.textDark}
                        textAlignVertical="top"
                    />
                </View>
            )}
        </View>
    );
};

export const ContentSection = memo(ContentSectionComponent);

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sectionTitle: {
            color: theme.text,
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 25,
            marginBottom: 12,
        },
        description: {
            color: theme.textDark,
            fontSize: 16,
            lineHeight: 24,
        },
        moreText: {
            color: theme.accent,
            fontSize: 14,
            marginTop: 5,
            fontWeight: "500",
        },
        userSection: {
            paddingBottom: 20,
        },
        notesInput: {
            backgroundColor: theme.main,
            borderRadius: 15,
            padding: 15,
            color: theme.text,
            minHeight: 120,
        },
    });
