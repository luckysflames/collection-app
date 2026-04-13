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

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const AddItemsToFolderModal = ({
    visible,
    onClose,
    availableItems,
    onAdd,
}) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = useCallback((id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const handleSave = () => {
        onAdd(selectedIds);
        setSelectedIds([]); // Сбрасываем выбор после сохранения
        onClose();
    };

    const handleCancel = () => {
        setSelectedIds([]); // Сбрасываем выбор при отмене
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen" // Для iOS лучше смотрится как фуллскрин
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />

                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={handleCancel}
                        style={styles.closeIcon}
                    >
                        <X color="#fff" size={24} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Добавить в папку</Text>
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={selectedIds.length === 0}
                    >
                        <Text
                            style={[
                                styles.saveBtn,
                                selectedIds.length === 0 && styles.disabledBtn,
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
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <MediaCard
                                item={item}
                                onPress={() => toggleSelect(item.id)}
                            />
                            {/* Оверлей выбора */}
                            {selectedIds.includes(item.id) && (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.overlay}
                                    onPress={() => toggleSelect(item.id)}
                                >
                                    <View style={styles.checkCircle}>
                                        <Check
                                            color="#fff"
                                            size={18}
                                            strokeWidth={4}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Все подходящие карточки уже в этой папке
                            </Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    closeIcon: { padding: 4 },
    title: { color: "#fff", fontSize: 18, fontWeight: "700" },
    saveBtn: { color: "#7D8AFF", fontSize: 16, fontWeight: "600" },
    disabledBtn: { color: "#4E5564", opacity: 0.6 },

    listContent: {
        paddingHorizontal: 8,
        paddingTop: 20,
        paddingBottom: 40,
    },
    cardWrapper: {
        flex: 0.5,
        alignItems: "center", // Центрируем карточку и оверлей
        // marginBottom: 16, // Тот же отступ, что в MediaCard
        position: "relative",
    },
    overlay: {
        position: "absolute",
        // Вместо растягивания по родителю, задаем размеры карточки:
        width: cardWidth,
        height: 280, // Высота из твоего MediaCard
        backgroundColor: "rgba(125, 138, 255, 0.4)",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    checkCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        color: "#8E94A4",
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
    },
});
