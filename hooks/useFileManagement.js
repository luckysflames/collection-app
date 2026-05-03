import React, { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { WarnModal } from "../components/ui/WarnModal";
import { Text, TouchableOpacity } from "react-native";

export const useFileManagement = (store) => {
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
        confirmText: "",
        children: null,
    });

    const hideModal = () =>
        setModalConfig((prev) => ({ ...prev, visible: false }));

    const showWarn = (config) => {
        setModalConfig({
            visible: true,
            title: config.title || "Внимание",
            message: config.message || "",
            type: config.type || "info",
            onConfirm: config.onConfirm || null,
            confirmText: config.confirmText || "Ок",
            children: config.children || null,
        });
    };

    const handleExportCollection = async () => {
        try {
            const {
                myCollection,
                availableStatuses,
                defaultTabs,
                collectionGoal,
            } = store;

            if (myCollection.length === 0) {
                showWarn({
                    title: "Экспорт",
                    message: "Коллекция пуста. Нечего экспортировать.",
                    type: "warning",
                });
                return;
            }

            const backupData = {
                type: "GEEKLY_BACKUP",
                version: "1.1",
                exportedAt: new Date().toISOString(),
                payload: {
                    myCollection,
                    availableStatuses,
                    defaultTabs,
                    collectionGoal,
                },
            };

            const jsonString = JSON.stringify(backupData);
            const fileName = `geekly_backup_${new Date().toISOString().split("T")[0]}.json`;

            // Исправляем формирование пути (убеждаемся в наличии слеша)
            const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

            // Записываем файл
            await FileSystem.writeAsStringAsync(fileUri, jsonString, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                    mimeType: "application/json",
                    dialogTitle: "Сохранить карточки и статусы",
                    UTI: "public.json",
                });
            }
        } catch (error) {
            console.error("Export Error:", error); // ВАЖНО: посмотри в консоль, что там написано
            showWarn({
                title: "Ошибка",
                message: "Не удалось создать файл экспорта.",
                type: "error",
            });
        }
    };

    const handleImportCollection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const fileUri = result.assets[0].uri;
            const jsonString = await FileSystem.readAsStringAsync(fileUri);
            const backup = JSON.parse(jsonString);

            if (backup.type !== "GEEKLY_BACKUP" || !backup.payload) {
                throw new Error("Invalid format");
            }

            const newItems = backup.payload.myCollection;
            const savedStatuses = backup.payload.availableStatuses || {};

            showWarn({
                title: "Импорт данных",
                message: `В файле найдено ${newItems.length} элементов. Как выполнить импорт?`,
                type: "warning",
                confirmText: "Дополнить",
                onConfirm: () => {
                    hideModal();
                    const current = store.myCollection;
                    const currentIds = new Set(
                        current.map((item) => String(item.id)),
                    );

                    // 1. Фильтруем только уникальные карточки
                    const uniqueNewItems = newItems.filter(
                        (item) => !currentIds.has(String(item.id)),
                    );

                    if (uniqueNewItems.length === 0) {
                        setTimeout(() => {
                            showWarn({
                                title: "Инфо",
                                message: "Все элементы уже есть в коллекции.",
                            });
                        }, 500);
                        return;
                    }

                    // --- НОВАЯ ЛОГИКА: Сбор уникальных статусов ---
                    // Проходим по всем новым карточкам и добавляем их статусы в разделы
                    uniqueNewItems.forEach((item) => {
                        if (item.status && item.appSection) {
                            // Используем существующий экшен стора для добавления (он проверит на дубликаты)
                            store.addCustomStatus(item.appSection, item.status);
                        }
                    });

                    store.setMyCollection([...current, ...uniqueNewItems]);

                    if (backup.payload.collectionGoal)
                        store.setCollectionGoal(backup.payload.collectionGoal);

                    setTimeout(() => {
                        showWarn({
                            type: "success",
                            title: "Успех",
                            message: `Добавлено ${uniqueNewItems.length} новых элементов и обновлены списки статусов.`,
                        });
                    }, 500);
                },
                children: (
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#FF6B6B",
                            height: 58,
                            borderRadius: 18,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                        onPress={() => {
                            hideModal();
                            // 1. Устанавливаем коллекцию
                            store.setMyCollection(newItems);

                            // 2. ИСПРАВЛЕНО: Правильная установка статусов при полной замене
                            // Проходим по ключам объекта (Movies, Books и т.д.) и вызываем сеттер для каждого
                            Object.keys(savedStatuses).forEach((sectionKey) => {
                                store.setStatusesForSection(
                                    sectionKey,
                                    savedStatuses[sectionKey],
                                );
                            });

                            if (backup.payload.collectionGoal)
                                store.setCollectionGoal(
                                    backup.payload.collectionGoal,
                                );

                            setTimeout(() => {
                                showWarn({
                                    type: "success",
                                    title: "Успех",
                                    message:
                                        "Коллекция и статусы полностью восстановлены.",
                                });
                            }, 500);
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFF",
                                fontWeight: "700",
                                fontSize: 16,
                            }}
                        >
                            Заменить всё
                        </Text>
                    </TouchableOpacity>
                ),
            });
        } catch (error) {
            showWarn({
                title: "Ошибка",
                message: "Файл поврежден или имеет неверный формат.",
                type: "error",
            });
        }
    };

    const FileModal = () => (
        <WarnModal
            visible={modalConfig.visible}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            confirmText={modalConfig.confirmText}
            onConfirm={modalConfig.onConfirm}
            onClose={hideModal}
        >
            {modalConfig.children}
        </WarnModal>
    );

    return { handleExportCollection, handleImportCollection, FileModal };
};
