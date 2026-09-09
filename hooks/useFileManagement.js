import React, { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { WarnModal } from "../components/ui/WarnModal";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import {
    restoreCollectionImageUris,
    collectImageFilesForZip,
    moveImagesFromTemp,
} from "../utils/imageStorage";
import { unzip, zip } from "react-native-zip-archive";
import { useTheme } from "./useTheme";

export const useFileManagement = (store) => {
    const { theme } = useTheme();

    const [isProcessing, setIsProcessing] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
        confirmText: "",
        children: null,
    });

    const hideModal = () => setModalConfig((prev) => ({ ...prev, visible: false }));

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
        if (store.myCollection.length === 0) {
            showWarn({
                title: "Экспорт",
                message: "Коллекция пуста. Нечего экспортировать.",
                type: "warning",
            });
            return;
        }

        // Показываем лоадер
        setIsProcessing(true);
        showWarn({
            title: "Экспорт коллекции",
            message: "Подготовка данных и архивация изображений. Пожалуйста, подождите...",
            type: "info",
            children: (
                <ActivityIndicator size="large" color={theme.accent} style={{ marginTop: 15 }} />
            ),
        });

        try {
            const {
                myCollection,
                availableStatuses,
                defaultTabs,
                defaultSorts,
                collectionGoal,
                categoryOrder,
                themeName,
                isCompactMenu,
                isVibration,
                isSound,
                isNotify,
            } = store;

            // 1. Собираем данные и список путей картинок
            const { collection: normalizedCollection, imagePathsToCopy } =
                await collectImageFilesForZip(myCollection);

            const backupData = {
                type: "GEEKLY_BACKUP_ZIP",
                version: "2.1",
                exportedAt: new Date().toISOString(),
                payload: {
                    myCollection: normalizedCollection,
                    availableStatuses,
                    defaultTabs,
                    defaultSorts,
                    collectionGoal,
                    categoryOrder,
                    themeName,
                    settings: {
                        isCompactMenu,
                        isVibration,
                        isSound,
                        isNotify,
                    },
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

            hideModal();

            // 5. Делимся
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(zipPath, {
                    mimeType: "application/zip",
                    dialogTitle: "Сохранить коллекцию",
                    UTI: "public.zip-archive",
                });
            }

            // 6. Очистка кэша экспорта
            await FileSystem.deleteAsync(exportFolder, { idempotent: true });
            await FileSystem.deleteAsync(zipPath, { idempotent: true });
        } catch (error) {
            console.error("Export Error:", error);
            showWarn({
                title: "Ошибка",
                message: "Не удалось создать архив.",
                type: "error",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleImportCollection = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ["application/zip", "application/x-zip-compressed"],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            // Показываем лоадер при распаковке
            setIsProcessing(true);
            showWarn({
                title: "Импорт коллекции",
                message: "Распаковка архива и обработка данных...",
                type: "info",
                children: (
                    <ActivityIndicator
                        size="large"
                        color={theme.accent}
                        style={{ marginTop: 15 }}
                    />
                ),
            });

            const zipUri = result.assets[0].uri;
            const tempUnzipPath = `${FileSystem.cacheDirectory}unzip_${Date.now()}/`;

            // 1. Распаковка
            await unzip(zipUri, tempUnzipPath);

            // 2. Чтение данных
            const jsonString = await FileSystem.readAsStringAsync(`${tempUnzipPath}data.json`);
            const backup = JSON.parse(jsonString);

            if (backup.type !== "GEEKLY_BACKUP_ZIP") {
                throw new Error("Invalid format");
            }

            // 3. Перенос картинок и восстановление путей
            const restoredMap = await moveImagesFromTemp(`${tempUnzipPath}images/`);
            const newItems = restoreCollectionImageUris(backup.payload.myCollection, restoredMap);
            const payload = backup.payload;

            setIsProcessing(false);

            // Хелпер для сохранения настроек
            const applySettings = (data) => {
                if (data.collectionGoal !== undefined) store.setCollectionGoal(data.collectionGoal);
                if (data.categoryOrder) store.setCategoryOrder(data.categoryOrder);
                if (data.themeName) store.setThemeName(data.themeName);

                if (data.defaultTabs) {
                    Object.keys(data.defaultTabs).forEach((key) =>
                        store.setDefaultTab(key, data.defaultTabs[key]),
                    );
                }

                if (data.defaultSorts) {
                    Object.keys(data.defaultSorts).forEach((key) =>
                        store.setDefaultSort(key, data.defaultSorts[key]),
                    );
                }

                if (data.settings) {
                    if (data.settings.isCompactMenu !== undefined)
                        store.setIsCompactMenu(data.settings.isCompactMenu);
                    if (data.settings.isVibration !== undefined)
                        store.setIsVibration(data.settings.isVibration);
                    if (data.settings.isSound !== undefined)
                        store.setIsSound(data.settings.isSound);
                    if (data.settings.isNotify !== undefined)
                        store.setIsNotify(data.settings.isNotify);
                }
            };

            // 4. Показ модального окна выбора типа импорта
            showWarn({
                title: "Импорт данных",
                message: `В архиве найдено ${newItems.length} элементов. Как выполнить импорт?`,
                type: "warning",
                confirmText: "Дополнить",
                onConfirm: async () => {
                    setIsProcessing(true);
                    showWarn({
                        title: "Обновление коллекции",
                        message: "Сохранение новых элементов...",
                        type: "info",
                        children: (
                            <ActivityIndicator
                                size="large"
                                color={theme.accent}
                                style={{ marginTop: 15 }}
                            />
                        ),
                    });

                    try {
                        const current = store.myCollection;
                        const currentIds = new Set(current.map((item) => String(item.id)));
                        const uniqueNewItems = newItems.filter(
                            (item) => !currentIds.has(String(item.id)),
                        );

                        if (uniqueNewItems.length === 0) {
                            showWarn({
                                title: "Инфо",
                                message: "Все элементы уже есть в коллекции.",
                            });
                            return;
                        }

                        uniqueNewItems.forEach((item) => {
                            if (item.status && item.appSection)
                                store.addCustomStatus(item.appSection, item.status);
                        });

                        store.setMyCollection([...current, ...uniqueNewItems]);
                        applySettings(payload);

                        showWarn({
                            type: "success",
                            title: "Успех",
                            message: `Добавлено ${uniqueNewItems.length} элементов.`,
                        });
                    } finally {
                        setIsProcessing(false);
                        await FileSystem.deleteAsync(tempUnzipPath, { idempotent: true });
                    }
                },
                children: (
                    <TouchableOpacity
                        style={{
                            backgroundColor: theme.red,
                            height: 58,
                            borderRadius: 18,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 10,
                        }}
                        onPress={async () => {
                            setIsProcessing(true);
                            showWarn({
                                title: "Перезапись коллекции",
                                message: "Очистка текущих данных и запись новых...",
                                type: "info",
                                children: (
                                    <ActivityIndicator
                                        size="large"
                                        color={theme.accent}
                                        style={{ marginTop: 15 }}
                                    />
                                ),
                            });

                            try {
                                await store.clearCollection();

                                store.setMyCollection(newItems);

                                const savedStatuses = payload.availableStatuses || {};
                                Object.keys(savedStatuses).forEach((key) =>
                                    store.setStatusesForSection(key, savedStatuses[key]),
                                );
                                applySettings(payload);

                                showWarn({
                                    type: "success",
                                    title: "Успех",
                                    message: "Коллекция полностью заменена.",
                                });
                            } finally {
                                setIsProcessing(false);
                                await FileSystem.deleteAsync(tempUnzipPath, { idempotent: true });
                            }
                        }}
                    >
                        <Text
                            style={{
                                color: theme.text,
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
            console.error("Import Error:", error);
            setIsProcessing(false);
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
            isProcessing={isProcessing}
        >
            {modalConfig.children}
        </WarnModal>
    );

    return { handleExportCollection, handleImportCollection, FileModal };
};
