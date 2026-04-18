import React, { useCallback, useMemo } from "react";
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
    showFoldersOnly = false,
}) => {
    // --- LOGIC: Filtering & Sorting ---
    const pageData = useMemo(() => {
        let filtered = data.filter((item) => {
            // 0. Если мы внутри папки, показываем только её содержимое (без вложенных папок)
            if (isInsideFolder) return true;

            // 1. Базовая проверка секции (Movies/Games и т.д.)
            if (item.appSection !== currentSection) return false;

            const isFolder = !!item.isFolder;
            const hasParent =
                item.parentFolderIds && item.parentFolderIds.length > 0;

            // --- ЛОГИКА ДЛЯ РАЗДЕЛА "Всё" ---
            if (category === "Всё") {
                if (showFoldersOnly) {
                    // Кейс 1: Схлопываем всё, у чего есть папки
                    if (isFolder) return true; // Показываем все папки
                    return !hasParent; // Карточки показываем только если они "сироты"
                }
                // Показываем абсолютно всё плоским списком (папки скрыты, все карточки видны)
                return !isFolder;
            }

            // --- ЛОГИКА ДЛЯ РАЗДЕЛА "Папки" ---
            if (category === "Папки") {
                return isFolder;
            }

            // --- ЛОГИКА ДЛЯ СТАТУСНЫХ ВКЛАДОК (Смотрю, В планах и т.д.) ---
            const itemStatus = item.status;
            if (itemStatus !== category) return false;

            if (showFoldersOnly) {
                // Кейс 1 & 3: Группировка включена
                if (isFolder) return true; // Пустая или полная папка со статусом "Смотрю" видна

                // Карточку показываем только если у неё нет родительской папки
                // ИЛИ если её родительская папка имеет ДРУГОЙ статус (чтобы карточка не "исчезла" в никуда)
                if (!hasParent) return true;

                // Проверка: есть ли среди родителей папка с ТАКИМ ЖЕ статусом, как у карточки?
                const hasSameStatusParent = item.parentFolderIds.some(
                    (parentId) => {
                        const parent = data.find((d) => d.id === parentId);
                        return parent && parent.status === itemStatus;
                    },
                );

                return !hasSameStatusParent;
            } else {
                // Группировка выключена: только карточки этого статуса (папки скрываем)
                // Кейс 2 & 3: Если папка пустая, в этом режиме она скроется (так как isFolder === true)
                return !isFolder;
            }
        });

        // --- СОРТИРОВКА ---
        const sorted = [...filtered].sort((a, b) => {
            const getSortDate = (obj) => obj.createdAt || 0;
            if (sortType === "alphabetical")
                return (a.title || "").localeCompare(b.title || "");
            if (sortType === "rating") return (b.rating || 0) - (a.rating || 0);
            if (sortType === "oldest") return getSortDate(a) - getSortDate(b);
            return getSortDate(b) - getSortDate(a);
        });

        // --- ДОБАВЛЕНИЕ СЧЕТЧИКА ---
        return sorted.map((item) => {
            if (item.isFolder) {
                const count = data.filter((i) =>
                    i.parentFolderIds?.includes(item.id),
                ).length;
                return { ...item, _computedCount: count };
            }
            return item;
        });
    }, [
        category,
        currentSection,
        data,
        isInsideFolder,
        sortType,
        showFoldersOnly,
    ]);

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

    // Оборачиваем функцию нажатия, чтобы ссылка на неё не менялась
    const handlePress = useCallback(
        (item) => {
            onCardPress?.(item);
        },
        [onCardPress],
    );

    // --- RENDER ITEM ---
    const renderItem = useCallback(
        ({ item }) => {
            // Логика расчета номера должна быть ЗДЕСЬ
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
        [handlePress, isReordering, reorderBuffer], // reorderBuffer в зависимостях важен!
    );

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
                // Оптимизации:
                initialNumToRender={8} // Сколько карточек рендерить сразу
                maxToRenderPerBatch={10} // Сколько добавлять за один проход
                windowSize={5} // Сколько экранов держать в памяти (меньше = меньше RAM)
                removeClippedSubviews={true} // Выгружать из памяти то, что далеко за экраном
                getItemLayout={(data, index) => ({
                    length: 220, // Примерная высота вашей карточки
                    offset: 220 * Math.floor(index / 2),
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
