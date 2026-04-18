import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { SECTIONS, SYSTEM_STATUSES } from "../constants";
import { useCollectionStore } from "../store/useCollectionStore";
import { useStatusManager } from "../hooks/useStatusManager";

import { StatusManagerHeader } from "../components/screens/Settings/Statuses/StatusManagerHeader";
import { SectionTabs } from "../components/screens/Settings/Statuses/SectionTabs";
import { StatusList } from "../components/screens/Settings/Statuses/StatusList";
import { StatusInput } from "../components/screens/Settings/Statuses/StatusInput";
import { WarnModal } from "../components/ui/WarnModal";

export const StatusManagerScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const store = useCollectionStore();

    const [selectedSection, setSelectedSection] = useState(SECTIONS[0].id);
    const [modalConfig, setModalConfig] = useState({ visible: false });

    const {
        allLocalStatuses,
        allLocalDefaults,
        newStatus,
        isSaving,
        hasChanges,
        setNewStatus,
        handleSave,
        updateSectionStatuses,
        updateSectionDefault,
    } = useStatusManager(store);

    // Вспомогательные переменные для текущей секции
    const currentStatuses = allLocalStatuses[selectedSection];
    const currentDefault = allLocalDefaults[selectedSection];

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
        if (SYSTEM_STATUSES.includes(status)) {
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
            message: `Карточки будут перенесены в "Избранное".`,
            type: "error",
            confirmText: "Удалить",
            onConfirm: () => {
                if (currentDefault === status)
                    updateSectionDefault(selectedSection, "Всё");
                updateSectionStatuses(
                    selectedSection,
                    currentStatuses.filter((s) => s !== status),
                );
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
        <View style={styles.container}>
            <StatusManagerHeader
                onBack={() => navigation.goBack()}
                onSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
                insets={insets}
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

                <Text style={styles.sectionTitle}>Порядок отображения</Text>
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    tabWrapper: { marginBottom: 25 },
    sectionTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 12,
        marginLeft: 8,
        letterSpacing: 1.2,
    },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.08)",
        marginBottom: 25,
    },
});
