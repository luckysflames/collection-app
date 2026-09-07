import React, { useCallback, useMemo, memo } from "react";
import { View, FlatList, StyleSheet, Dimensions } from "react-native";
import { MediaCard } from "../ui/MediaCard";
import { EmptyState } from "./EmptyState";
import { useFilteredCollection } from "../../hooks/useFilteredCollection";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionStore } from "../../store/useCollectionStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const keyExtractor = (item) => `card-${item.id}`;

const shallowEqualObjects = (a, b) => {
    if (a === b) return true;
    if (!a || !b) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (a[key] !== b[key]) return false;
    }
    return true;
};

const shallowEqualArrays = (a, b) => {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) return false;
    }
    return true;
};

const arePropsEqual = (prev, next) => {
    return (
        prev.category === next.category &&
        prev.searchQuery === next.searchQuery &&
        prev.currentSection === next.currentSection &&
        prev.sortType === next.sortType &&
        prev.showFoldersOnly === next.showFoldersOnly &&
        prev.isInsideFolder === next.isInsideFolder &&
        prev.onCardPress === next.onCardPress &&
        prev.onCardLongPress === next.onCardLongPress &&
        prev.ListHeaderComponent === next.ListHeaderComponent &&
        prev.data === next.data &&
        shallowEqualObjects(prev.activeFilters, next.activeFilters) &&
        prev.isReordering === next.isReordering &&
        shallowEqualArrays(prev.reorderBuffer, next.reorderBuffer) &&
        prev.folderOrder === next.folderOrder
    );
};

const CategoryPageComponent = ({
    category,
    searchQuery,
    currentSection,
    data,
    folderOrder,
    isInsideFolder = false,
    ListHeaderComponent,
    sortType = "date_desc",
    activeFilters = {},
    onCardPress,
    onCardLongPress,
    isReordering,
    reorderBuffer,
    showFoldersOnly = false,
}) => {
    const insets = useSafeAreaInsets();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    const filteredData = useFilteredCollection({
        data,
        category,
        currentSection,
        sortType,
        showFoldersOnly,
        isInsideFolder,
        folderOrder,
        searchQuery,
        activeFilters,
    });

    const pageData = useMemo(() => filteredData, [filteredData]);

    const handlePress = useCallback(
        (item) => {
            onCardPress?.(item);
        },
        [onCardPress],
    );

    const renderItem = useCallback(
        ({ item }) => {
            let currentOrder = null;
            if (isReordering && reorderBuffer) {
                const index = reorderBuffer.indexOf(item.id);
                currentOrder = index !== -1 ? index + 1 : null;
            }

            return (
                <MediaCard
                    item={item}
                    itemCount={item.isFolder ? item._computedCount : 0}
                    onPress={handlePress}
                    onLongPress={onCardLongPress}
                    showOrderNumber={isReordering}
                    orderNumber={currentOrder}
                    isInsideFolder={isInsideFolder}
                />
            );
        },
        [handlePress, onCardLongPress, isReordering, reorderBuffer, isInsideFolder],
    );

    const memoizedExtraData = useMemo(
        () => ({
            isReordering,
            reorderBufferLength: reorderBuffer?.length,
        }),
        [isReordering, reorderBuffer?.length],
    );

    return (
        <View style={styles.pageWrapper}>
            <FlatList
                data={pageData}
                extraData={memoizedExtraData}
                keyExtractor={keyExtractor}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listPadding}
                renderItem={renderItem}
                initialNumToRender={6}
                maxToRenderPerBatch={2}
                windowSize={5}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={100}
                scrollEventThrottle={16}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={
                    <View
                        style={{
                            height: isCompactMenu ? insets.bottom + 60 : insets.bottom + 90,
                        }}
                    />
                }
                ListEmptyComponent={
                    <EmptyState category={category} isInsideFolder={isInsideFolder} />
                }
            />
        </View>
    );
};

export const CategoryPage = memo(CategoryPageComponent, arePropsEqual);

const styles = StyleSheet.create({
    pageWrapper: { flex: 1, width: SCREEN_WIDTH },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100 },
});
