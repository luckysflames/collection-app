import React from "react";
import { Modal, View, Text, StyleSheet, ActivityIndicator } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useTheme } from "../../../../hooks/useTheme";

export const ImageModal = ({ visible, images = [], initialIndex = 0, onClose }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const imageUrls = images.map((uri) => ({
        url: uri,
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
                pageAnimateTime={500}
                flipThreshold={10}
                friction={10}
                enablePreload={true}
                onClick={onClose}
                swipeDownThreshold={80}
                loadingRender={() => <ActivityIndicator color="white" size="large" />}
                renderIndicator={(currentIndex, allSize) => (
                    <View style={styles.indicatorContainer}>
                        <Text style={styles.indicatorText}>{`${currentIndex} / ${allSize}`}</Text>
                    </View>
                )}
                menus={() => null}
                style={{ backgroundColor: "black" }}
            />
        </Modal>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
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
    });
