import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ChevronRight } from "lucide-react-native";

import {
    SECTIONS,
    PROTECTED_STATUSES,
    DEFAULT_STATUS_BY_SECTION,
    SORT_LABELS,
    SORT_TYPES,
    SORT_SUB_OPTIONS,
} from "../constants";
import { useCollectionStore } from "../store/useCollectionStore";
import { useStatusManager } from "../hooks/useStatusManager";

import { StatusManagerHeader } from "../components/screens/Settings/Statuses/StatusManagerHeader";
import { SectionTabs } from "../components/screens/Settings/Statuses/SectionTabs";
import { StatusList } from "../components/screens/Settings/Statuses/StatusList";
import { StatusInput } from "../components/screens/Settings/Statuses/StatusInput";
import { WarnModal } from "../components/ui/WarnModal";
import { SortModal } from "../components/screens/Main/Modals/SortModal";

export const StatusManagerScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const store = useCollectionStore();

    const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
    const [modalConfig, setModalConfig] = useState({ visible: false });
    const [isSortModalVisible, setIsSortModalVisible] = useState(false);

    const {
        allLocalStatuses,
        allLocalDefaults,
        allLocalSorts,
        newStatus,
        isSaving,
        hasChanges,
        setNewStatus,
        handleSave,
        updateSectionStatuses,
        updateSectionDefault,
        updateSectionSort,
    } = useStatusManager(store);

    // Вспомогательные переменные для текущей секции
    const currentStatuses = allLocalStatuses[selectedSection];
    const currentDefault = allLocalDefaults[selectedSection];
    const currentSort = allLocalSorts[selectedSection];

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
            message: `Карточки, которые находятся в "${status}", можно будет найти в разделе "Всё". Чтобы не запутаться, советуем сначала перенести карточки в другой статус.`,
            type: "error",
            confirmText: "Удалить",
            onConfirm: () => {
                // 1. Если удаляемый статус был дефолтным для этой вкладки, сбрасываем локально на "Всё"
                if (currentDefault === status) {
                    updateSectionDefault(selectedSection, "Всё");
                }

                // 2. Обновляем локальный список статусов (черновик), чтобы из списка пропала строка
                updateSectionStatuses(
                    selectedSection,
                    currentStatuses.filter((s) => s !== status),
                );

                // 3. ВАЖНО: Вызываем метод стора, чтобы он ПРОШЕЛСЯ ПО КАРТОЧКАМ и поставил им null
                // Мы делаем это сразу, так как это действие с данными коллекции
                store.removeCustomStatus(selectedSection, status);

                setModalConfig({ visible: false });
            },
        });
    };

    const onMove = (index, direction) => {
        const nextIndex = direction === "up" ? index - 1 : index + 1;
        if (nextIndex < 0 || nextIndex >= currentStatuses.length) return;

        const updated = [...currentStatuses];
        [updated[index], updated[nextIndex]] = [
            updated[nextIndex],
            updated[index],
        ];
        updateSectionStatuses(selectedSection, updated);
    };

    return (
        <View
            style={[
                styles.container,
                {
                    marginBottom: insets.bottom,
                },
            ]}
        >
            <StatusManagerHeader
                onBack={() => navigation.goBack()}
                onSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
                insets={insets}
                title="Настройки отображения"
            />

            <KeyboardAwareScrollView
                style={styles.flex1}
                contentContainerStyle={styles.scrollContent}
                extraScrollHeight={180}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.tabWrapper}>
                    <SectionTabs
                        sections={SECTIONS}
                        selectedSection={selectedSection}
                        onSelect={setSelectedSection}
                    />
                </View>

                <Text style={styles.sectionTitle}>Сортировка по умолчанию</Text>
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

                <Text style={styles.sectionTitle}>Управление статусами</Text>
                <View style={styles.card}>
                    <StatusList
                        statuses={currentStatuses}
                        section={selectedSection}
                        onMove={onMove}
                        onDelete={confirmDelete}
                        defaultStatus={currentDefault}
                        onSetDefault={(val) =>
                            updateSectionDefault(selectedSection, val)
                        }
                    />
                </View>

                <Text style={styles.sectionTitle}>Добавить новый</Text>
                <View style={styles.card}>
                    <StatusInput
                        value={newStatus}
                        onChange={setNewStatus}
                        onAdd={onAddStatus}
                    />
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

            <WarnModal
                {...modalConfig}
                onClose={() => setModalConfig({ visible: false })}
            />
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
    tabWrapper: { marginBottom: 25 },
    sectionTitle: {
        color: "#fff", // Более приглушенный как в subText дашборда
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 12,
        marginLeft: 8,
        letterSpacing: 1.2,
    },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
        marginBottom: 25,
    },
    sortButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        borderRadius: 20,
    },
    sortButtonContent: {
        flex: 1,
    },
    sortLabel: {
        color: "#4E5564",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 4,
    },
    sortValue: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
