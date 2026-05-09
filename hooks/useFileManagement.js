import React, { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { WarnModal } from "../components/ui/WarnModal";
import { Text, TouchableOpacity } from "react-native";
import {
    collectImageFilesForExport,
    restoreLocalImagesFromBackup,
    restoreCollectionImageUris,
    collectImageFilesForZip,
    moveImagesFromTemp,
} from "../utils/imageStorage";
import { zip } from "react-native-zip-archive";

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

            // 1. Собираем данные и список путей картинок
            const { collection: normalizedCollection, imagePathsToCopy } =
                await collectImageFilesForZip(myCollection);

            const backupData = {
                type: "GEEKLY_BACKUP_ZIP",
                version: "2.0",
                exportedAt: new Date().toISOString(),
                payload: {
                    myCollection: normalizedCollection,
                    availableStatuses,
                    defaultTabs,
                    collectionGoal,
                },
            };

            // 2. Создаем временную структуру папок в кэше
            const exportFolder = `${FileSystem.cacheDirectory}export_${Date.now()}/`;
            const imagesFolder = `${exportFolder}images/`;
            await FileSystem.makeDirectoryAsync(imagesFolder, {
                intermediates: true,
            });

            // 3. Записываем JSON и копируем картинки
            await FileSystem.writeAsStringAsync(
                `${exportFolder}data.json`,
                JSON.stringify(backupData),
            );

            for (const img of imagePathsToCopy) {
                await FileSystem.copyAsync({
                    from: img.fullUri,
                    to: `${imagesFolder}${img.fileName}`,
                });
            }

            // 4. Архивируем
            const zipPath = `${FileSystem.cacheDirectory}geekly_backup_${new Date().toISOString().split("T")[0]}.zip`;
            await zip(exportFolder, zipPath);

            // 5. Делимся
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(zipPath, {
                    mimeType: "application/zip",
                    dialogTitle: "Сохранить коллекцию",
                    UTI: "public.zip-archive",
                });
            }

            // 6. ЧИСТКА (вот что я предлагал добавить)
            // Удаляем временную папку с картинками и json
            await FileSystem.deleteAsync(exportFolder, { idempotent: true });
            // Удаляем сам созданный zip-файл, так как он уже не нужен
            await FileSystem.deleteAsync(zipPath, { idempotent: true });
        } catch (error) {
            console.error("Export Error:", error);
            showWarn({
                title: "Ошибка",
                message: "Не удалось создать архив.",
                type: "error",
            });
        }
    };

    const handleImportCollection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/zip", "application/x-zip-compressed"],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const zipUri = result.assets[0].uri;
            const tempUnzipPath = `${FileSystem.cacheDirectory}unzip_${Date.now()}/`;

            // 1. Распаковка
            await unzip(zipUri, tempUnzipPath);

            // 2. Чтение данных
            const jsonString = await FileSystem.readAsStringAsync(
                `${tempUnzipPath}data.json`,
            );
            const backup = JSON.parse(jsonString);

            if (backup.type !== "GEEKLY_BACKUP_ZIP") {
                throw new Error("Invalid format");
            }

            // 3. Перенос картинок и восстановление путей
            const restoredMap = await moveImagesFromTemp(
                `${tempUnzipPath}images/`,
            );
            const newItems = restoreCollectionImageUris(
                backup.payload.myCollection,
                restoredMap,
            );
            const savedStatuses = backup.payload.availableStatuses || {};

            // 4. ТВОЯ ОРИГИНАЛЬНАЯ ЛОГИКА МОДАЛОК
            showWarn({
                title: "Импорт данных",
                message: `В архиве найдено ${newItems.length} элементов. Как выполнить импорт?`,
                type: "warning",
                confirmText: "Дополнить",
                onConfirm: () => {
                    hideModal();
                    const current = store.myCollection;
                    const currentIds = new Set(
                        current.map((item) => String(item.id)),
                    );
                    const uniqueNewItems = newItems.filter(
                        (item) => !currentIds.has(String(item.id)),
                    );

                    if (uniqueNewItems.length === 0) {
                        setTimeout(
                            () =>
                                showWarn({
                                    title: "Инфо",
                                    message:
                                        "Все элементы уже есть в коллекции.",
                                }),
                            500,
                        );
                        return;
                    }

                    uniqueNewItems.forEach((item) => {
                        if (item.status && item.appSection)
                            store.addCustomStatus(item.appSection, item.status);
                    });

                    store.setMyCollection([...current, ...uniqueNewItems]);
                    if (backup.payload.collectionGoal)
                        store.setCollectionGoal(backup.payload.collectionGoal);

                    setTimeout(
                        () =>
                            showWarn({
                                type: "success",
                                title: "Успех",
                                message: `Добавлено ${uniqueNewItems.length} элементов.`,
                            }),
                        500,
                    );
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
                            store.setMyCollection(newItems);
                            Object.keys(savedStatuses).forEach((key) =>
                                store.setStatusesForSection(
                                    key,
                                    savedStatuses[key],
                                ),
                            );
                            if (backup.payload.collectionGoal)
                                store.setCollectionGoal(
                                    backup.payload.collectionGoal,
                                );
                            setTimeout(
                                () =>
                                    showWarn({
                                        type: "success",
                                        title: "Успех",
                                        message:
                                            "Коллекция полностью заменена.",
                                    }),
                                500,
                            );
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

            // Чистим временную папку распаковки
            await FileSystem.deleteAsync(tempUnzipPath, { idempotent: true });
        } catch (error) {
            console.error("Import Error:", error);
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
