import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from "react-native";
import { X, Check, Search } from "lucide-react-native";
import { MediaCard } from "../../../ui/MediaCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../hooks/useTheme";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const AddItemsToFolderModal = ({ visible, onClose, availableItems = [], onAdd }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const [selectedIds, setSelectedIds] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const filteredItems = useMemo(() => {
        if (!debouncedQuery.trim()) return availableItems;
        return availableItems.filter((item) =>
            item.title?.toLowerCase().includes(debouncedQuery.toLowerCase().trim()),
        );
    }, [availableItems, debouncedQuery]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const resetState = () => {
        setSearchQuery("");
        setDebouncedQuery("");
        setSelectedIds([]);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSave = () => {
        onAdd(selectedIds);
        resetState();
        onClose();
    };

    const isSaveDisabled = selectedIds.length === 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.roundButton}
                        activeOpacity={0.7}
                    >
                        <X color={theme.red} size={22} />
                    </TouchableOpacity>

                    <Text style={styles.title} numberOfLines={1}>
                        Добавить в папку
                    </Text>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isSaveDisabled}
                        style={[styles.roundButton, isSaveDisabled && styles.disabledRoundButton]}
                        activeOpacity={0.7}
                    >
                        <Check
                            color={isSaveDisabled ? theme.textDark : theme.accent}
                            size={22}
                            strokeWidth={2.5}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchContainer}>
                    <Search color={theme.accent} size={20} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Поиск по названию..."
                        placeholderTextColor={theme.textDark}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                        selectionColor={theme.accent}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setSearchQuery("");
                                setDebouncedQuery("");
                            }}
                            activeOpacity={0.7}
                            style={styles.closeButton}
                        >
                            <X color={theme.text} size={20} />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={filteredItems}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Ничего не найдено</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => toggleSelect(item.id)}
                                style={styles.cardWrapper}
                            >
                                <View pointerEvents="none">
                                    <MediaCard item={item} />
                                </View>

                                {isSelected && (
                                    <View style={styles.overlay}>
                                        <View style={styles.checkCircle}>
                                            <Check color={theme.text} size={20} strokeWidth={4} />
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </Modal>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.dark },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 12,
        },
        title: {
            color: theme.text,
            fontSize: 18,
            fontWeight: "700",
            flex: 1,
            textAlign: "center",
            marginHorizontal: 8,
        },
        roundButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        disabledRoundButton: {
            opacity: 0.5,
        },
        searchContainer: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            borderRadius: 15,
            paddingHorizontal: 15,
            height: 50,
            backgroundColor: theme.main,
            marginHorizontal: 16,
            marginVertical: 8,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            color: theme.text,
            fontSize: 16,
            paddingVertical: 0,
        },
        listContent: {
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 40,
        },
        columnWrapper: {
            justifyContent: "space-between",
        },
        cardWrapper: {
            width: cardWidth,
            position: "relative",
            marginBottom: 16,
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.accentMuted,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            marginBottom: 15,
        },
        checkCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        emptyContainer: {
            paddingTop: 40,
            alignItems: "center",
        },
        emptyText: {
            color: theme.textDark,
            fontSize: 16,
        },
        closeButton: {
            marginLeft: 8,
        },
    });
