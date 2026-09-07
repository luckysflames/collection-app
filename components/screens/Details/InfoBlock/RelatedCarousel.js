import React, { useCallback, memo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MediaCard } from "../../../ui/MediaCard";
import { useTheme } from "../../../../hooks/useTheme";

const CARD_WIDTH = 140;
const GAP = 12;
const BASE_PADDING = 20;

const isNavigableItem = (id) =>
    typeof id === "string" &&
    (id.startsWith("movie-") ||
        id.startsWith("tv-") ||
        id.startsWith("anime-") ||
        id.startsWith("book-") ||
        id.startsWith("game-"));

const RelatedCarouselItem = memo(({ item, onNavigateToDetails, styles }) => {
    const handlePress = () => {
        if (isNavigableItem(item?.id)) {
            onNavigateToDetails?.(item);
        }
    };

    return (
        <View style={styles.cardWrapper}>
            <MediaCard
                item={{
                    ...item,
                    type: "anime",
                    isAnime: true,
                }}
                onPress={handlePress}
                small={true}
            />
            {item?.relationText && (
                <View style={styles.relationLabel} pointerEvents="none">
                    <Text style={styles.relationText} numberOfLines={1}>
                        {item.relationText}
                    </Text>
                </View>
            )}
        </View>
    );
});

RelatedCarouselItem.displayName = "RelatedCarouselItem";

const RelatedCarouselComponent = ({ related = [], onNavigateToDetails }) => {
    if (!related || related.length === 0) return null;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const renderItem = useCallback(
        ({ item }) => (
            <RelatedCarouselItem
                item={item}
                onNavigateToDetails={onNavigateToDetails}
                styles={styles}
            />
        ),
        [onNavigateToDetails, styles],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Связанное</Text>

            <View style={styles.carouselWrapper} pointerEvents="box-none">
                <FlatList
                    data={related}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                    removeClippedSubviews={true}
                    initialNumToRender={3}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={50}
                    scrollEventThrottle={16}
                    windowSize={5}
                />
            </View>
        </View>
    );
};

export const RelatedCarousel = memo(RelatedCarouselComponent);

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            marginHorizontal: -BASE_PADDING,
            backgroundColor: theme.main,
            paddingVertical: 20,
        },
        sectionTitle: {
            color: theme.text,
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            marginLeft: BASE_PADDING,
        },
        carouselWrapper: {
            position: "relative",
            height: 240,
        },
        flatListContent: {
            paddingHorizontal: BASE_PADDING,
        },
        cardWrapper: {
            width: CARD_WIDTH,
            marginRight: GAP,
        },
        relationLabel: {
            position: "absolute",
            bottom: 5,
            left: 5,
            right: 5,
            backgroundColor: theme.accentMuted,
            paddingVertical: 4,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        relationText: {
            color: theme.accent,
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
        },
    });
