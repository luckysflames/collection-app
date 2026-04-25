import React, { useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import { MediaCard } from "../ui/MediaCard";
import { EmptyState } from "./EmptyState"; // Вынесли отдельно
import { useFilteredCollection } from "../../hooks/useFilteredCollection";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCollectionStore } from "../../store/useCollectionStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryPage = ({
    category,
    searchQuery,
    currentSection,
    data,
    folderOrder,
    isInsideFolder = false,
    ListHeaderComponent,
    sortType = "newest",
    activeFilters = {},
    onCardPress,
    onCardLongPress,
    isReordering,
    reorderBuffer,
    showFoldersOnly = false,
}) => {
    const insets = useSafeAreaInsets();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

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

    const renderItem = useCallback(
        ({ item }) => {
            const indexInBuffer = reorderBuffer
                ? reorderBuffer.indexOf(item.id)
                : -1;
            const currentOrder =
                indexInBuffer !== -1 ? indexInBuffer + 1 : null;

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
        [handlePress, onCardLongPress, isReordering, reorderBuffer],
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
                extraData={[
                    data,
                    pageData,
                    reorderBuffer,
                    folderOrder,
                    isReordering,
                ]}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={[
                    styles.listPadding,
                    { paddingTop: isInsideFolder ? 0 : 10 },
                ]}
                ListHeaderComponent={ListHeaderComponent}
                renderItem={renderItem}
                ListEmptyComponent={
                    <EmptyState
                        category={category}
                        isInsideFolder={isInsideFolder}
                    />
                }
                // Оптимизации производительности
                removeClippedSubviews={Platform.OS === "android"}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={7}
                getItemLayout={(data, index) => ({
                    length: 230, // Уточни высоту карточки с учетом отступов
                    offset: 230 * Math.floor(index / 2),
                    index,
                })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pageWrapper: { flex: 1, width: SCREEN_WIDTH },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100 },
});
