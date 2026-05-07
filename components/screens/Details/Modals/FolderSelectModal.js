import React, { useMemo, useCallback } from "react"; // Добавили useCallback
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
} from "react-native";
import {
    FolderPlus,
    Folder as FolderIcon,
    Check,
    FolderHeart,
} from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { useCollectionStore } from "../../../../store/useCollectionStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function FolderSelectModal({
    visible,
    onClose,
    folders,
    onSelect,
    onCreateNew,
    selectedFolderIds = [],
}) {
    const myCollection = useCollectionStore((state) => state.myCollection);

    // 1. Быстрый подсчет: создаем объект-карту { folderId: count }
    const folderCounts = useMemo(() => {
        const counts = {};
        myCollection.forEach((item) => {
            if (item.parentFolderIds && Array.isArray(item.parentFolderIds)) {
                item.parentFolderIds.forEach((id) => {
                    counts[id] = (counts[id] || 0) + 1;
                });
            }
        });
        return counts;
    }, [myCollection]);

    // 2. Быстрая сортировка: закрепленные сверху, далее по дате (новые выше)
    const sortedFolders = useMemo(() => {
        if (!folders) return [];

        // 1. Сначала сортируем ВЕСЬ массив по дате (новые сверху)
        const baseSorted = [...folders].sort(
            (a, b) => (b.createdAt || 0) - (a.createdAt || 0),
        );

        // 2. Разделяем на две группы
        const pinned = baseSorted.filter((f) => f.isPinned);
        const unpinned = baseSorted.filter((f) => !f.isPinned);

        // 3. Склеиваем: закрепленные (уже отсортированные по дате) + остальные
        return [...pinned, ...unpinned];
    }, [folders]);

    // 3. Оптимизированный рендер строки
    const renderFolderItem = useCallback(
        ({ item }) => {
            const isSelected = selectedFolderIds.includes(item.id);
            // Берем готовое число из нашей карты (это мгновенно)
            const count = folderCounts[item.id] || 0;

            return (
                <TouchableOpacity
                    style={[
                        styles.folderItem,
                        isSelected && styles.folderItemActive,
                    ]}
                    onPress={() => onSelect(item.id)}
                    activeOpacity={0.7}
                >
                    <View
                        style={[
                            styles.folderIconWrapper,
                            isSelected && styles.folderIconWrapperActive,
                        ]}
                    >
                        {item.isPinned ? (
                            <FolderHeart
                                color="#7D8AFF"
                                size={20}
                            />
                        ) : (
                            <FolderIcon
                                color={isSelected ? "#7D8AFF" : "#8E94A4"}
                                size={20}
                            />
                        )}
                    </View>

                    <View style={styles.folderInfo}>
                        <Text
                            style={[
                                styles.folderText,
                                isSelected && styles.folderTextActive,
                            ]}
                        >
                            {item.title}
                        </Text>
                        <Text style={styles.folderSubtext}>
                            Элементов: {count}
                        </Text>
                    </View>

                    <View style={styles.checkWrapper}>
                        {isSelected ? (
                            <Check color="#7D8AFF" size={20} strokeWidth={3} />
                        ) : (
                            <Check
                                color="transparent"
                                size={20}
                                strokeWidth={3}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            );
        },
        [selectedFolderIds, folderCounts, onSelect],
    );

    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.sheetContainer}
        >
            <Text style={styles.header}>Добавить в папку</Text>

            <TouchableOpacity
                style={styles.createBtn}
                onPress={() => {
                    onClose();
                    setTimeout(() => onCreateNew(), 300);
                }}
            >
                <View style={styles.createIconBg}>
                    <FolderPlus color="#fff" size={20} />
                </View>
                <Text style={styles.createBtnText}>Создать новую папку</Text>
            </TouchableOpacity>

            <View style={styles.listContainer}>
                <FlatList
                    data={sortedFolders}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderFolderItem}
                    contentContainerStyle={styles.listContent}
                    initialNumToRender={10}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            У вас пока нет папок
                        </Text>
                    }
                />
            </View>

            <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                <Text style={styles.doneBtnText}>Готово</Text>
            </TouchableOpacity>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 20,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    createBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        padding: 14,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
    createIconBg: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    createBtnText: {
        color: "#7D8AFF",
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "700",
    },
    listContainer: {
        maxHeight: SCREEN_HEIGHT * 0.45,
    },
    listContent: {
        paddingBottom: 10,
    },
    folderItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginBottom: 8,
        backgroundColor: "rgba(255,255,255,0.02)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.02)",
    },
    folderItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.06)",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    folderIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    folderIconWrapperActive: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
    },
    folderInfo: {
        flex: 1,
    },
    folderText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    folderTextActive: {
        color: "#fff",
    },
    folderSubtext: {
        color: "#4E5564",
        fontSize: 12,
        marginTop: 2,
    },
    checkWrapper: {
        marginLeft: 10,
    },
    emptyText: {
        color: "#8E94A4",
        textAlign: "center",
        marginVertical: 30,
        fontSize: 15,
    },
    doneBtn: {
        marginTop: 15,
        alignItems: "center",
        padding: 16,
        backgroundColor: "#7D8AFF",
        borderRadius: 20,
    },
    doneBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
