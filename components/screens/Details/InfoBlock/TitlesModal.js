import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { TitleItem } from "../TitleItem";
import { useCollectionStore } from "../../../../store/useCollectionStore";

const { width } = Dimensions.get("window");

export const TitlesModal = ({ visible, onClose, data, isInCollection }) => {
    const updateCard = useCollectionStore((state) => state.updateCard);

    const handleSelectTitle = (newTitle) => {
        if (!isInCollection || !data?.id) return;
        updateCard(data.id, { title: newTitle });
        onClose(); // Закрываем модалку после выбора
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                    <BlurView
                        intensity={20}
                        tint="dark"
                        style={StyleSheet.absoluteFill}
                    />
                </Pressable>

                <Pressable style={styles.modalContent}>
                    <Text style={styles.title}>Варианты названия</Text>

                    {isInCollection && (
                        <Text style={styles.hint}>
                            Нажмите на название, чтобы сделать его основным в
                            вашей коллекции
                        </Text>
                    )}

                    <View style={styles.listContainer}>
                        {data?.type === "anime" ? (
                            <>
                                <TitleItem
                                    label="Основное (Romaji)"
                                    value={data?.name}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                                <TitleItem
                                    label="Русское"
                                    value={data?.russian}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                                <TitleItem
                                    label="Официальное (РФ)"
                                    value={data?.licenseNameRu}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                                <TitleItem
                                    label="Английское"
                                    value={data?.englishTitle}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                                <TitleItem
                                    label="Японское"
                                    value={data?.japaneseTitle}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <TitleItem
                                    label="Текущее основное"
                                    value={data?.title}
                                    onSelect={
                                        isInCollection
                                            ? handleSelectTitle
                                            : null
                                    }
                                />
                                {(data?.type === "movie" ||
                                    data?.type === "game" ||
                                    data?.type === "tv") && (
                                    <TitleItem
                                        label="Оригинальное"
                                        value={data?.originalTitle}
                                        onSelect={
                                            isInCollection
                                                ? handleSelectTitle
                                                : null
                                        }
                                    />
                                )}
                            </>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.closeButtonText}>Понятно</Text>
                    </TouchableOpacity>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: "#0B1534",
        borderRadius: 32,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 25,
    },
    title: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 24,
        textAlign: "center",
        letterSpacing: 0.5,
    },
    hint: {
        color: "#8E94A4",
        fontSize: 13,
        textAlign: "center",
        marginTop: -16,
        marginBottom: 24,
        paddingHorizontal: 10,
        lineHeight: 18,
    },
    listContainer: {
        width: "100%",
        marginBottom: 8,
    },
    closeButton: {
        backgroundColor: "#7D8AFF",
        width: "100%",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    closeButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
