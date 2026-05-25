import React, { useState } from "react";
import { View, Text, StyleSheet, Keyboard, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ChevronRight } from "lucide-react-native";

import { SECTIONS, PROTECTED_STATUSES, SORT_LABELS, SUB_CATEGORIES } from "../constants/index";
import { useCollectionStore } from "../store/useCollectionStore";
import { useStatusManager } from "../hooks/useStatusManager";

import { StatusManagerHeader } from "../components/screens/Settings/Statuses/StatusManagerHeader";
import { SectionTabs } from "../components/screens/Settings/Statuses/SectionTabs";
import { StatusList } from "../components/screens/Settings/Statuses/StatusList";
import { CategoryOrderList } from "../components/screens/Settings/Statuses/CategoryOrderList";
import { StatusInput } from "../components/screens/Settings/Statuses/StatusInput";
import { WarnModal } from "../components/ui/WarnModal";
import { SortModal } from "../components/screens/Main/Modals/SortModal";

export const StatusManagerScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const store = useCollectionStore();

    const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
    const [modalConfig, setModalConfig] = useState({ visible: false });
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);

    // Блокировщик скролла при перетаскивании элементов
    const [isDragging, setIsDragging] = useState(false);

    const {
        allLocalStatuses,
        allLocalDefaults,
        allLocalSorts,
        allLocalCategoryOrder,
        newStatus,
        isSaving,
        hasChanges,
        setNewStatus,
        handleSave,
        updateSectionStatuses,
        updateSectionDefault,
        updateSectionSort,
        updateCategoryOrder,
    } = useStatusManager(store);

    const currentStatuses = allLocalStatuses[selectedSection];
    const currentDefault = allLocalDefaults[selectedSection];
    const currentSort = allLocalSorts[selectedSection];

    const currentSectionLabel = SECTIONS.find((s) => s.id === selectedSection)?.label || "";

    const onAddStatus = () => {
        const trimmed = newStatus.trim();
        if (!trimmed) return;
        if (currentStatuses.includes(trimmed)) {
            return setModalConfig({
                visible: true,
                title: "Ошибка",
                message: "Такой статус уже существует",
                type: "error",
            });
        }
        updateSectionStatuses(selectedSection, [...currentStatuses, trimmed]);
        setNewStatus("");
        Keyboard.dismiss();
    };

    const confirmDelete = (status) => {
        if (PROTECTED_STATUSES.includes(status)) {
            return setModalConfig({
                visible: true,
                title: "Системный статус",
                message: "Этот статус нельзя удалить.",
                type: "error",
            });
        }

        setModalConfig({
            visible: true,
            title: "Удалить статус?",
            message: `Карточки, которые находятся в "${status}", можно будет найти в разделе "Всё".`,
            type: "error",
            confirmText: "Удалить",
            onConfirm: () => {
                if (currentDefault === status) {
                    updateSectionDefault(selectedSection, "Всё");
                }
                updateSectionStatuses(
                    selectedSection,
                    currentStatuses.filter((s) => s !== status),
                );
                store.removeCustomStatus(selectedSection, status);
                setModalConfig({ visible: false });
            },
        });
    };

    return (
        <View style={[styles.container, { marginBottom: insets.bottom }]}>
            <StatusManagerHeader
                onBack={() => navigation.goBack()}
                onSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
                insets={insets}
                title="Настройки интерфейса"
            />

            <KeyboardAwareScrollView
                style={styles.flex1}
                contentContainerStyle={styles.scrollContent}
                extraScrollHeight={180}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
                // Отключаем скролл экрана во время перетаскивания плашек
                scrollEnabled={!isDragging}
            >
                {/* === ЗОНА 1: ПОРЯДОК КАТЕГОРИЙ === */}
                <View style={styles.globalZone}>
                    <Text style={styles.zoneBadge}>Глобальные настройки</Text>
                    <Text style={styles.sectionTitle}>Порядок разделов</Text>
                    <View style={styles.card}>
                        <CategoryOrderList
                            categories={allLocalCategoryOrder
                                .map((categoryId) =>
                                    SUB_CATEGORIES.find((cat) => cat.id === categoryId),
                                )
                                .filter(Boolean)}
                            onDragStateChange={setIsDragging}
                            onOrderChange={updateCategoryOrder}
                        />
                    </View>
                </View>

                {/* РАЗДЕЛИТЕЛЬ */}
                <View style={styles.divider} />

                {/* === ЗОНА 2: НАСТРОЙКИ СЕКЦИИ === */}
                <View style={styles.contextZone}>
                    <Text style={styles.zoneBadge}>Контекстные настройки</Text>
                    <Text style={styles.sectionTitle}>Выберите раздел для редактирования</Text>

                    <SectionTabs
                        sections={SECTIONS}
                        selectedSection={selectedSection}
                        onSelect={setSelectedSection}
                    />

                    <Text style={styles.contextHeader}>
                        Настройки раздела:{" "}
                        <Text style={styles.highlightText}>{currentSectionLabel}</Text>
                    </Text>

                    <Text style={styles.subSectionTitle}>Сортировка по умолчанию</Text>
                    <View style={styles.card}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setIsSortModalVisible(true)}
                        >
                            <Text style={styles.sortValue}>
                                {SORT_LABELS[currentSort] || "Не выбрана"}
                            </Text>
                            <ChevronRight size={20} color="#7D8AFF" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subSectionTitle}>Управление внутренними статусами</Text>
                    <View style={styles.card}>
                        <StatusList
                            statuses={currentStatuses}
                            section={selectedSection}
                            onDragStateChange={setIsDragging}
                            onStatusesChange={(updatedStatuses) =>
                                updateSectionStatuses(selectedSection, updatedStatuses)
                            }
                            onDelete={confirmDelete}
                            defaultStatus={currentDefault}
                            onSetDefault={(val) => updateSectionDefault(selectedSection, val)}
                        />
                    </View>

                    <Text style={styles.subSectionTitle}>Добавить новый статус</Text>
                    <View style={styles.card}>
                        <StatusInput
                            value={newStatus}
                            onChange={setNewStatus}
                            onAdd={onAddStatus}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <SortModal
                isVisible={isSortModalVisible}
                onClose={() => setIsSortModalVisible(false)}
                currentSort={currentSort}
                onSelectSort={(sortType) => {
                    updateSectionSort(selectedSection, sortType);
                    setIsSortModalVisible(false);
                }}
            />

            <WarnModal {...modalConfig} onClose={() => setModalConfig({ visible: false })} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    flex1: { flex: 1 },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    globalZone: { marginBottom: 10 },
    contextZone: { marginTop: 10 },
    divider: {
        height: 1,
        backgroundColor: "rgba(125, 138, 255, 0.12)",
        marginVertical: 20,
        borderStyle: "dashed",
    },
    zoneBadge: {
        color: "#4E5564",
        fontSize: 10,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 14,
        marginLeft: 4,
    },
    subSectionTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1.0,
        marginBottom: 10,
        marginLeft: 8,
    },
    contextHeader: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 20,
        textAlign: "center",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        paddingVertical: 10,
        borderRadius: 14,
    },
    highlightText: { color: "#7D8AFF", fontWeight: "800" },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
        marginBottom: 20,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 6,
    },
    sortValue: { color: "#FFF", fontSize: 15, fontWeight: "700" },
});
