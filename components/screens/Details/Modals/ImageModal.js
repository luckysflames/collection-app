import React from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

export const ImageModal = ({
    visible,
    images = [],
    initialIndex = 0,
    onClose,
}) => {
    // Форматируем для библиотеки
    const imageUrls = images.map((uri) => ({
        url: uri,
        // Можно добавить размеры, если они известны, для ускорения рендера
    }));

    if (!images || images.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType="fade"
            statusBarTranslucent
        >
            <ImageViewer
                imageUrls={imageUrls}
                index={initialIndex}
                onCancel={onClose}
                enableSwipeDown={true}
                saveToLocalByLongPress={false}

                // --- НАСТРОЙКИ ПЛАВНОСТИ ---
                pageAnimateTime={500} // Увеличиваем время анимации (с 100 до 300мс)
                flipThreshold={10} // Картинка легче "залетает" на следующую страницу
                friction={10} // Чуть больше инерции при скролле
                enablePreload={true} // Предзагрузка соседних фото убирает "мигание"
                // ---------------------------

                // Закрытие по клику на фон
                onClick={onClose}
                // Настройка порогов свайпа (чтобы не путать со скроллом)
                swipeDownThreshold={80}
                // Рендер лоадера, пока грузится фото
                loadingRender={() => (
                    <ActivityIndicator color="white" size="large" />
                )}
                // Кастомный индикатор (1/5)
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
        </Modal>
    );
};

const styles = StyleSheet.create({
    indicatorContainer: {
        position: "absolute",
        bottom: 50, // Индикатор сверху, чтобы не мешал внизу
        width: "100%",
        alignItems: "center",
        zIndex: 100,
    },
    indicatorText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
});
