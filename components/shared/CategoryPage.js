import React, { useMemo } from "react";
import { View, FlatList, Text, StyleSheet, Dimensions } from "react-native";
import { FolderOpen } from "lucide-react-native";

import { MediaCard } from "../ui/MediaCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryPage = ({
    category,
    currentSection,
    data,
    isInsideFolder = false,
    ListHeaderComponent,
    sortType = "newest",
    onCardPress,
    isReordering,
    reorderBuffer,
    folderOrder,
}) => {
    // --- LOGIC: Filtering & Sorting ---
    const pageData = useMemo(() => {
        // 1. ФИЛЬТРАЦИЯ
        let filtered = data.filter((item) => {
            if (isInsideFolder) return true;

            if (item.appSection !== currentSection) return false;

            // Выносим общую логику "корневого" элемента
            const isVisibleRoot =
                item.isFolder || !item.parentFolderIds?.length;

            if (category === "Всё") return !item.isFolder;
            if (category === "Папки") return item.isFolder;

            // Для статусных вкладок
            const defaultStatus =
                currentSection === "Книги"
                    ? "Читаю"
                    : currentSection === "Игры"
                      ? "Играю"
                      : "Смотрю";
            const statusMatch = (item.status || defaultStatus) === category;

            return statusMatch && isVisibleRoot;
        });

        // 2. СОРТИРОВКА (оставляем без изменений)
        if (isInsideFolder && folderOrder?.length > 0) {
            return [...filtered].sort(
                (a, b) => folderOrder.indexOf(a.id) - folderOrder.indexOf(b.id),
            );
        }

        return [...filtered].sort((a, b) => {
            const getSortDate = (obj) => {
                if (obj.createdAt) return Number(obj.createdAt);
                const parts = String(obj.id).split("_");
                const timestamp = parts.length > 1 ? Number(parts[1]) : 0;
                return isNaN(timestamp) ? 0 : timestamp;
            };

            const dateA = getSortDate(a);
            const dateB = getSortDate(b);

            switch (sortType) {
                case "alphabetical":
                    return (a.title || "").localeCompare(b.title || "");
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "oldest":
                    return dateA - dateB;
                case "newest":
                default:
                    return dateB - dateA;
            }
        });
    }, [category, currentSection, data, isInsideFolder, sortType, folderOrder]);

    // --- COMPONENTS: Empty States ---
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            {isInsideFolder ? (
                <>
                    <View style={styles.emptyIconCircle}>
                        <FolderOpen
                            size={42}
                            color="rgba(125, 138, 255, 0.3)"
                        />
                    </View>
                    <Text style={styles.emptyTitle}>
                        В папке пока ничего нет
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        Вы можете добавить сюда карточки из вашей коллекции
                    </Text>
                </>
            ) : (
                <Text style={styles.emptyText}>
                    В разделе "{category}" пока пусто
                </Text>
            )}
        </View>
    );

    // --- RENDER ITEM ---
    const renderItem = ({ item }) => {
        const itemCount = item.isFolder
            ? data.filter((i) => i.parentFolderIds?.includes(item.id)).length
            : 0;

        const orderIndex = reorderBuffer?.indexOf(item.id);
        const orderNumber =
            orderIndex !== undefined && orderIndex !== -1
                ? orderIndex + 1
                : null;

        return (
            <MediaCard
                item={item}
                itemCount={itemCount}
                onPress={() => onCardPress?.(item)}
                showOrderNumber={isReordering}
                orderNumber={orderNumber}
            />
        );
    };

    return (
        <View style={styles.pageWrapper}>
            <FlatList
                data={pageData}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={[
                    styles.listPadding,
                    { paddingTop: isInsideFolder ? 0 : 10 },
                ]}
                ListHeaderComponent={<>{ListHeaderComponent}</>}
                renderItem={renderItem}
                ListEmptyComponent={renderEmptyState}
                removeClippedSubviews={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    pageWrapper: { flex: 1, width: SCREEN_WIDTH },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100 },

    // Кнопка добавления
    addBtnSmall: {
        backgroundColor: "#7D8AFF",
        paddingVertical: 12,
        marginHorizontal: 18,
        marginBottom: 20,
        borderRadius: 12,
        alignItems: "center",
    },
    addBtnSmallText: { color: "#fff", fontSize: 14, fontWeight: "600" },

    // Пустые состояния
    emptyContainer: {
        alignItems: "center",
        marginTop: 40,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(125, 138, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8E94A4",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
        opacity: 0.7,
    },
    emptyText: {
        color: "#4E5564",
        fontSize: 14,
        textAlign: "center",
        marginTop: 20,
    },
});
