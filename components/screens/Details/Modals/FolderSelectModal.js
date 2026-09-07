import React, { useMemo, useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { FolderPlus, Folder as FolderIcon, Check, FolderHeart, Heart } from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { useTheme } from "../../../../hooks/useTheme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const ITEM_HEIGHT = 74;

export default function FolderSelectModal({
    visible,
    onClose,
    folders,
    onSelect,
    onCreateNew,
    selectedFolderIds = [],
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const flatListRef = useRef(null);
    const [activeLetter, setActiveLetter] = useState("PINNED");

    const [isProcessing, setIsProcessing] = useState(false);

    const compareStrings = useCallback((a, b) => {
        return (a || "").localeCompare(b || "", ["ru", "en"], { sensitivity: "base" });
    }, []);

    const { pinnedFolders, unpinnedFolders } = useMemo(() => {
        if (!folders) return { pinnedFolders: [], unpinnedFolders: [] };
        const pinned = folders.filter((f) => f.isPinned);
        const unpinned = folders.filter((f) => !f.isPinned);
        return {
            pinnedFolders: pinned.sort((a, b) => compareStrings(a.title, b.title)),
            unpinnedFolders: unpinned.sort((a, b) => compareStrings(a.title, b.title)),
        };
    }, [folders, compareStrings]);

    const sortedFolders = useMemo(() => {
        return [...pinnedFolders, ...unpinnedFolders];
    }, [pinnedFolders, unpinnedFolders]);

    const availableLetters = useMemo(() => {
        const lettersSet = new Set();
        unpinnedFolders.forEach((f) => {
            if (f.title) {
                const firstLetter = f.title.trim()[0].toUpperCase();
                if (firstLetter) lettersSet.add(firstLetter);
            }
        });
        return Array.from(lettersSet).sort(compareStrings);
    }, [unpinnedFolders, compareStrings]);

    const hasPinned = pinnedFolders.length > 0;
    const showNavigation = useMemo(
        () => hasPinned || availableLetters.length > 1,
        [hasPinned, availableLetters],
    );

    const scrollToSection = useCallback(
        (target) => {
            if (isProcessing) return;
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
        [unpinnedFolders, pinnedFolders.length, isProcessing],
    );

    const handleFolderPress = useCallback(
        (folderId) => {
            if (isProcessing) return;

            setIsProcessing(true);
            setTimeout(() => {
                try {
                    onSelect(folderId);
                } finally {
                    setIsProcessing(false);
                }
            }, 0);
        },
        [onSelect, isProcessing],
    );

    const renderFolderItem = useCallback(
        ({ item }) => {
            const isSelected = selectedFolderIds.includes(item.id);

            return (
                <TouchableOpacity
                    style={[styles.folderItem, isSelected && styles.folderItemActive]}
                    onPress={() => handleFolderPress(item.id)}
                    activeOpacity={0.7}
                    disabled={isProcessing}
                >
                    <View
                        style={[
                            styles.folderIconWrapper,
                            isSelected && styles.folderIconWrapperActive,
                        ]}
                    >
                        {item.isPinned ? (
                            <FolderHeart color={theme.text} size={20} />
                        ) : (
                            <FolderIcon
                                color={isSelected ? theme.text : theme.textDark}
                                size={20}
                            />
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
                    </View>

                    <View style={styles.checkWrapper}>
                        {isSelected ? (
                            <Check color={theme.accent} size={20} strokeWidth={3} />
                        ) : (
                            <Check color="transparent" size={20} strokeWidth={3} />
                        )}
                    </View>
                </TouchableOpacity>
            );
        },
        [selectedFolderIds, handleFolderPress, isProcessing],
    );

    const getItemLayout = useCallback(
        (data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    return (
        <BottomSheet
            visible={visible}
            onClose={isProcessing ? undefined : onClose}
            containerStyle={styles.sheetContainer}
        >
            <Text style={styles.header}>Добавить в папку</Text>

            <TouchableOpacity
                style={[styles.createBtn, isProcessing && { opacity: 0.5 }]}
                disabled={isProcessing}
                onPress={() => {
                    onClose();
                    setTimeout(() => onCreateNew(), 300);
                }}
            >
                <View style={styles.createIconBg}>
                    <FolderPlus color={theme.text} size={20} />
                </View>
                <Text style={styles.createBtnText}>Создать новую папку</Text>
            </TouchableOpacity>

            {showNavigation && (
                <View style={[styles.alphabetContainer, isProcessing && { opacity: 0.5 }]}>
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
                                disabled={isProcessing}
                                activeOpacity={0.6}
                            >
                                <Heart
                                    color={activeLetter === "PINNED" ? theme.text : theme.accent}
                                    size={16}
                                    fill={activeLetter === "PINNED" ? theme.text : theme.main}
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
                                    disabled={isProcessing}
                                    activeOpacity={0.6}
                                >
                                    <Text style={styles.letterText}>{letter}</Text>
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
                    scrollEnabled={!isProcessing}
                    ListEmptyComponent={<Text style={styles.emptyText}>У вас пока нет папок</Text>}
                />

                {isProcessing && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={theme.accent} />
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[styles.doneBtn, isProcessing && { opacity: 0.5 }]}
                onPress={onClose}
                disabled={isProcessing}
            >
                <Text style={styles.doneBtnText}>Готово</Text>
            </TouchableOpacity>
        </BottomSheet>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 20,
        },
        header: {
            color: theme.text,
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
        },
        createBtn: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.accentMuted,
            padding: 14,
            borderRadius: 20,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        createIconBg: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        createBtnText: {
            color: theme.accent,
            marginLeft: 12,
            fontSize: 16,
            fontWeight: "700",
        },
        alphabetContainer: {
            marginHorizontal: -20,
            marginBottom: 14,
            height: 36,
        },
        alphabetScrollContent: {
            paddingHorizontal: 20,
            gap: 6,
        },
        letterBadge: {
            minWidth: 34,
            height: 34,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            paddingHorizontal: 8,
        },
        letterBadgeActive: {
            backgroundColor: theme.accent,
        },
        letterText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "700",
        },
        listContainer: {
            maxHeight: SCREEN_HEIGHT * 0.42,
            position: "relative",
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
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        folderItemActive: {
            backgroundColor: theme.accentMuted,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        folderIconWrapper: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
        },
        folderIconWrapperActive: {
            backgroundColor: theme.accent,
        },
        folderInfo: {
            flex: 1,
            paddingRight: 10,
            justifyContent: "center",
        },
        folderText: {
            color: theme.textDark,
            fontSize: 16,
            fontWeight: "600",
        },
        folderTextActive: {
            color: theme.text,
        },
        checkWrapper: {
            marginLeft: 10,
        },
        emptyText: {
            color: theme.textDark,
            textAlign: "center",
            marginVertical: 30,
            fontSize: 15,
        },
        doneBtn: {
            marginTop: 15,
            alignItems: "center",
            padding: 16,
            backgroundColor: theme.accent,
            borderRadius: 20,
        },
        doneBtnText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "bold",
        },
        loadingOverlay: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
        },
    });
