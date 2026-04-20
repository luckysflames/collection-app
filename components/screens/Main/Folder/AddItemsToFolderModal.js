import React, { useState, useCallback } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from "react-native";
import { X, Check } from "lucide-react-native";
import { MediaCard } from "../../../ui/MediaCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const AddItemsToFolderModal = ({
    visible,
    onClose,
    availableItems,
    onAdd,
}) => {
    const insets = useSafeAreaInsets();
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const handleSave = () => {
        onAdd(selectedIds);
        setSelectedIds([]);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" statusBarTranslucent>
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar barStyle="light-content" />

                    <View style={[styles.header, {paddingTop: insets.top + 20}]}>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.headerIcon}
                        >
                            <X color="#fff" size={24} />
                        </TouchableOpacity>

                        <Text style={styles.title}>Добавить в папку</Text>

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={selectedIds.length === 0}
                            style={styles.headerIcon}
                        >
                            <Text
                                style={[
                                    styles.saveBtn,
                                    selectedIds.length === 0 &&
                                        styles.disabledBtn,
                                ]}
                            >
                                Готово
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={availableItems}
                        numColumns={2}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContent}
                        columnWrapperStyle={styles.columnWrapper}
                        renderItem={({ item }) => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => toggleSelect(item.id)}
                                    style={styles.cardWrapper}
                                >
                                    {/* pointerEvents="none" иногда блокирует всё. Убираем его. */}
                                    <View pointerEvents="none">
                                        <MediaCard item={item} />
                                    </View>

                                    {isSelected && (
                                        <View style={styles.overlay}>
                                            <View style={styles.checkCircle}>
                                                <Check
                                                    color="#fff"
                                                    size={20}
                                                    strokeWidth={4}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    safeArea: { flex: 1 },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    headerIcon: {
        minWidth: 50,
        alignItems: "center",
    },
    title: { color: "#fff", fontSize: 18, fontWeight: "700" },
    saveBtn: { color: "#7D8AFF", fontSize: 16, fontWeight: "600" },
    disabledBtn: { color: "#4E5564", opacity: 0.6 },

    listContent: {
        paddingHorizontal: 12,
        paddingTop: 20,
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
        // Ключевой момент: оверлей растягивается на весь cardWrapper
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(125, 138, 255, 0.4)",
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
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
    },
});
