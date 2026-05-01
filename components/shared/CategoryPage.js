import React, { useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import { MediaCard } from "../ui/MediaCard";
import { EmptyState } from "./EmptyState";
import { useFilteredCollection } from "../../hooks/useFilteredCollection";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionStore } from "../../store/useCollectionStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 1. Выносим keyExtractor ЗА ПРЕДЕЛЫ компонента, чтобы он не пересоздавался
const keyExtractor = (item) => `card-${item.id}`;

export const CategoryPage = ({
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
    const collectionVersion = useCollectionStore((state) => state.version);

    // 1. Получаем отфильтрованные и базово отсортированные данные из хука
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

    // 2. В режиме переупорядочивания оставляем порядок как есть (из filteredData)
    const pageData = useMemo(() => {
        return filteredData;
    }, [filteredData]);

    const handlePress = useCallback(
        (item) => {
            onCardPress?.(item);
        },
        [onCardPress],
    );

    // 2. Оптимизируем renderItem через useCallback
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
        [
            handlePress,
            onCardLongPress,
            isReordering,
            reorderBuffer,
            isInsideFolder,
        ],
    );

    // 3. Используем стабильный объект для extraData
    const memoizedExtraData = useMemo(
        () => ({
            isReordering,
            reorderBufferLength: reorderBuffer?.length, // Следим за длиной, а не за всем массивом
            collectionVersion, // Следим за версией коллекции для перерисовки при изменении любого элемента
        }),
        [isReordering, reorderBuffer?.length, collectionVersion],
    );

    return (
        <View
            style={[
                styles.pageWrapper,
                {
                    marginBottom: isCompactMenu
                        ? insets.bottom
                        : insets.bottom + 30,
                },
            ]}
        >
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
                ListEmptyComponent={
                    <EmptyState
                        category={category}
                        isInsideFolder={isInsideFolder}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pageWrapper: { flex: 1, width: SCREEN_WIDTH },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100 },
});
