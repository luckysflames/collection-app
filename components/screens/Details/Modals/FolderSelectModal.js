import React, { useMemo, useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    ScrollView,
} from "react-native";
import { FolderPlus, Folder as FolderIcon, Check, FolderHeart, Heart } from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { useCollectionStore } from "../../../../store/useCollectionStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;

// Строго фиксированная полная высота одного элемента в списке (высота + marginBottom)
// 66px (высота компонента) + 8px (отступ) = 74px
const ITEM_HEIGHT = 74;

export default function FolderSelectModal({
    visible,
    onClose,
    folders,
    onSelect,
    onCreateNew,
    selectedFolderIds = [],
}) {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const flatListRef = useRef(null);
    const [activeLetter, setActiveLetter] = useState("PINNED");

    // 1. Быстрый подсчет элементов в папках
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

    // Функция сортировки, общая для папок и для букв алфавита
    const compareStrings = useCallback((a, b) => {
        return (a || "").localeCompare(b || "", ["ru", "en"], { sensitivity: "base" });
    }, []);

    // Разделяем папки на две изолированные группы
    const { pinnedFolders, unpinnedFolders } = useMemo(() => {
        if (!folders) return { pinnedFolders: [], unpinnedFolders: [] };

        const pinned = folders.filter((f) => f.isPinned);
        const unpinned = folders.filter((f) => !f.isPinned);

        return {
            pinnedFolders: pinned.sort((a, b) => compareStrings(a.title, b.title)),
            unpinnedFolders: unpinned.sort((a, b) => compareStrings(a.title, b.title)),
        };
    }, [folders, compareStrings]);

    // 2. Итоговый массив для FlatList
    const sortedFolders = useMemo(() => {
        return [...pinnedFolders, ...unpinnedFolders];
    }, [pinnedFolders, unpinnedFolders]);

    // 3. Извлекаем первые буквы ТОЛЬКО из незакрепленных папок с синхронной сортировкой
    const availableLetters = useMemo(() => {
        const lettersSet = new Set();
        unpinnedFolders.forEach((f) => {
            if (f.title) {
                const firstLetter = f.title.trim()[0].toUpperCase();
                if (firstLetter) lettersSet.add(firstLetter);
            }
        });
        // Сортируем буквы точно так же, как и папки (сначала RU, затем EN)
        return Array.from(lettersSet).sort(compareStrings);
    }, [unpinnedFolders, compareStrings]);

    // Есть ли вообще закрепленные папки?
    const hasPinned = pinnedFolders.length > 0;

    // Флаг: показывать ли ленту навигации
    const showNavigation = useMemo(() => {
        return hasPinned || availableLetters.length > 1;
    }, [hasPinned, availableLetters]);

    // 4. Функция быстрого перехода (теперь работает идеально за счет getItemLayout)
    const scrollToSection = useCallback(
        (target) => {
            setActiveLetter(target);

            let targetIndex = -1;

            if (target === "PINNED") {
                targetIndex = 0;
            } else {
                const unpinnedIndex = unpinnedFolders.findIndex(
                    (f) => f.title && f.title.trim()[0].toUpperCase() === target,
                );
                if (unpinnedIndex !== -1) {
                    targetIndex = pinnedFolders.length + unpinnedIndex;
                }
            }

            if (targetIndex !== -1 && flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: targetIndex,
                    animated: true,
                    viewPosition: 0,
                });
            }
        },
        [unpinnedFolders, pinnedFolders.length],
    );

    // 5. Оптимизированный рендер строки папки c ограничением длины текста
    const renderFolderItem = useCallback(
        ({ item }) => {
            const isSelected = selectedFolderIds.includes(item.id);
            const count = folderCounts[item.id] || 0;

            return (
                <TouchableOpacity
                    style={[styles.folderItem, isSelected && styles.folderItemActive]}
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
                            <FolderHeart color="#7D8AFF" size={20} />
                        ) : (
                            <FolderIcon color={isSelected ? "#7D8AFF" : "#8E94A4"} size={20} />
                        )}
                    </View>

                    <View style={styles.folderInfo}>
                        <Text
                            style={[styles.folderText, isSelected && styles.folderTextActive]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.title}
                        </Text>
                        <Text style={styles.folderSubtext}>Элементов: {count}</Text>
                    </View>

                    <View style={styles.checkWrapper}>
                        {isSelected ? (
                            <Check color="#7D8AFF" size={20} strokeWidth={3} />
                        ) : (
                            <Check color="transparent" size={20} strokeWidth={3} />
                        )}
                    </View>
                </TouchableOpacity>
            );
        },
        [selectedFolderIds, folderCounts, onSelect],
    );

    // 6. Оптимизация разметки FlatList для моментального скролла
    const getItemLayout = useCallback(
        (data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    return (
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
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

            {/* --- ГОРИЗОНТАЛЬНЫЙ СЕЛЕКТОР (СЕРДЕЧКО + БУКВЫ) --- */}
            {showNavigation && (
                <View style={styles.alphabetContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.alphabetScrollContent}
                    >
                        {hasPinned && (
                            <TouchableOpacity
                                style={[
                                    styles.letterBadge,
                                    activeLetter === "PINNED" && styles.letterBadgeActive,
                                ]}
                                onPress={() => scrollToSection("PINNED")}
                                activeOpacity={0.6}
                            >
                                <Heart
                                    color={activeLetter === "PINNED" ? "#fff" : "#7D8AFF"}
                                    size={16}
                                    fill={
                                        activeLetter === "PINNED"
                                            ? "#fff"
                                            : "rgba(125, 138, 255, 0.2)"
                                    }
                                />
                            </TouchableOpacity>
                        )}

                        {availableLetters.map((letter) => {
                            const isActive = activeLetter === letter;
                            return (
                                <TouchableOpacity
                                    key={letter}
                                    style={[
                                        styles.letterBadge,
                                        isActive && styles.letterBadgeActive,
                                    ]}
                                    onPress={() => scrollToSection(letter)}
                                    activeOpacity={0.6}
                                >
                                    <Text
                                        style={[
                                            styles.letterText,
                                            isActive && styles.letterTextActive,
                                        ]}
                                    >
                                        {letter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            <View style={styles.listContainer}>
                <FlatList
                    ref={flatListRef}
                    data={sortedFolders}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderFolderItem}
                    contentContainerStyle={styles.listContent}
                    getItemLayout={getItemLayout}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={5}
                    ListEmptyComponent={<Text style={styles.emptyText}>У вас пока нет папок</Text>}
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
        marginBottom: 12,
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
    alphabetContainer: {
        marginBottom: 14,
        height: 36,
    },
    alphabetScrollContent: {
        paddingHorizontal: 2,
        gap: 6,
    },
    letterBadge: {
        minWidth: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
        paddingHorizontal: 8,
    },
    letterBadgeActive: {
        backgroundColor: "rgba(125, 138, 255, 0.2)",
        borderColor: "#7D8AFF",
    },
    letterText: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "700",
    },
    letterTextActive: {
        color: "#fff",
    },
    listContainer: {
        maxHeight: SCREEN_HEIGHT * 0.42,
    },
    listContent: {
        paddingBottom: 10,
    },
    folderItem: {
        flexDirection: "row",
        alignItems: "center",
        height: 66,
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
        width: 40,
        height: 40,
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
        paddingRight: 10,
        justifyContent: "center",
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
