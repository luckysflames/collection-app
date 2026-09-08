import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Download } from "lucide-react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { WarnModal } from "../../ui/WarnModal";
import { useTheme } from "../../../hooks/useTheme";

export const ImageModal = ({ visible, images = [], initialIndex = 0, onClose }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, visible]);

    const [modalConfig, setModalConfig] = useState({
        visible: false,
        title: "",
        message: "",
        type: "info",
    });

    const showWarnModal = (title, message, type = "info") => {
        setModalConfig({
            visible: true,
            title,
            message,
            type,
        });
    };

    const hideWarnModal = () => {
        setModalConfig((prev) => ({ ...prev, visible: false }));
    };

    const imageUrls = images.map((uri) => ({
        url: uri,
    }));

    const handleDownload = async () => {
        let downloadedUri;

        try {
            setSaving(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status !== "granted") {
                showWarnModal(
                    "Доступ запрещен",
                    "Необходимо разрешение на доступ к галерее для сохранения фото.",
                    "warning",
                );
                setSaving(false);
                return;
            }

            const currentUri = images[currentIndex];
            if (!currentUri) return;

            if (/^https?:\/\//i.test(currentUri)) {
                downloadedUri = `${FileSystem.cacheDirectory}image_${Date.now()}.jpg`;
                await FileSystem.downloadAsync(currentUri, downloadedUri);
            } else {
                downloadedUri = currentUri;
            }

            await MediaLibrary.saveToLibraryAsync(downloadedUri);
            showWarnModal("Успешно", "Изображение сохранено в галерею!", "success");
        } catch (error) {
            showWarnModal("Ошибка", "Не удалось сохранить изображение.", "error");
        } finally {
            if (downloadedUri?.startsWith(FileSystem.cacheDirectory)) {
                await FileSystem.deleteAsync(downloadedUri, { idempotent: true }).catch(() => {});
            }
            setSaving(false);
        }
    };

    if (!images || images.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.modalBackground}>
                <ImageViewer
                    imageUrls={imageUrls}
                    index={initialIndex}
                    onChange={(index) => setCurrentIndex(index)}
                    onCancel={onClose}
                    enableSwipeDown={true}
                    saveToLocalByLongPress={false}
                    pageAnimateTime={500}
                    flipThreshold={10}
                    friction={10}
                    enablePreload={true}
                    swipeDownThreshold={80}
                    loadingRender={() => (
                        <ActivityIndicator color={theme.accent || "white"} size="large" />
                    )}
                    renderIndicator={(currentIndex, allSize) => (
                        <View style={styles.indicatorContainer}>
                            <Text
                                style={styles.indicatorText}
                            >{`${currentIndex} / ${allSize}`}</Text>
                        </View>
                    )}
                    menus={() => null}
                    style={{ backgroundColor: "black" }}
                />

                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={handleDownload}
                    disabled={saving}
                    activeOpacity={0.8}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color={theme.accent || "white"} />
                    ) : (
                        <Download size={20} color={theme.accent || "white"} />
                    )}
                </TouchableOpacity>
            </View>

            <WarnModal
                visible={modalConfig.visible}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onClose={hideWarnModal}
            />
        </Modal>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        modalBackground: {
            flex: 1,
            backgroundColor: "black",
        },
        indicatorContainer: {
            position: "absolute",
            bottom: 50,
            width: "100%",
            alignItems: "center",
            zIndex: 100,
        },
        indicatorText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "600",
            backgroundColor: theme.accent,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 10,
        },
        downloadButton: {
            position: "absolute",
            top: 50,
            right: 20,
            zIndex: 1000,
            backgroundColor: theme.main,
            padding: 12,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            elevation: 5,
        },
    });
