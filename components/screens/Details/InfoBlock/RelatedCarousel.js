import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    FlatList,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { MediaCard } from "../../../ui/MediaCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 140;
const GAP = 12;
const BASE_PADDING = 20;
const SIDE_SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

// Мемоизируем элемент карточки чтобы он не ре-рендерился
const RelatedCarouselItem = memo(({ item, onNavigateToDetails }) => (
    <View style={styles.cardWrapper}>
        <MediaCard
            item={{
                ...item,
                type: "anime",
                isAnime: true,
            }}
            onPress={() => onNavigateToDetails(item)}
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
));

RelatedCarouselItem.displayName = "RelatedCarouselItem";

const RelatedCarouselComponent = ({ related = [], onNavigateToDetails }) => {
    if (!related || related.length === 0) return null;

    const renderItem = useCallback(
        ({ item, index }) => (
            <RelatedCarouselItem
                item={item}
                onNavigateToDetails={onNavigateToDetails}
            />
        ),
        [onNavigateToDetails],
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
                    // === ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ ===
                    initialNumToRender={3}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={50}
                    scrollEventThrottle={16}
                    // Предотвращаем синхронное прерывание во время скролла
                    windowSize={5}
                />
            </View>
        </View>
    );
};

// Мемоизируем сам компонент для предотвращения ненужных ре-рендеров
export const RelatedCarousel = memo(RelatedCarouselComponent);

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: -BASE_PADDING,
        backgroundColor: "rgba(255,255,255,0.05)",
        paddingVertical: 20,
    },
    sectionTitle: {
        color: "#fff",
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
        backgroundColor: "rgba(5, 11, 24, 0.9)",
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    relationText: {
        color: "#7D8AFF",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
    },
});
