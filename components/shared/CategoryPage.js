import React, { useCallback, useMemo } from "react";
import { View, FlatList, StyleSheet, Dimensions, Platform } from "react-native";
import { MediaCard } from "../ui/MediaCard";
import { EmptyState } from "./EmptyState"; // Вынесли отдельно
import { useFilteredCollection } from "../../hooks/useFilteredCollection";

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
    onCardPress,
    isReordering,
    reorderBuffer,
    showFoldersOnly = false,
}) => {
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
                    showOrderNumber={isReordering}
                    orderNumber={currentOrder}
                />
            );
        },
        [handlePress, isReordering, reorderBuffer],
    );

    return (
        <View style={styles.pageWrapper}>
            <FlatList
                data={pageData}
                extraData={[pageData, reorderBuffer, folderOrder, isReordering]}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
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
