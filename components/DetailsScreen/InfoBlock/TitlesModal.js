import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { styles } from "./InfoBlock.styles";
import { TitleItem } from "../TitleItem";

export const TitlesModal = ({ visible, onClose, data }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContent}>
                    <Text style={styles.modalHeader}>Варианты названия</Text>

                    <TitleItem label="Основное" value={data?.title} />

                    {data?.type === "anime" && (
                        <>
                            <TitleItem
                                label="Английское"
                                value={data?.englishTitle}
                            />
                            <TitleItem
                                label="Японское"
                                value={data?.japaneseTitle}
                            />
                        </>
                    )}

                    {data?.type === "movie" || "game" && (
                        <TitleItem
                            label="Оригинальное"
                            value={data?.originalTitle}
                        />
                    )}

                    <TouchableOpacity
                        style={styles.closeModalButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeModalButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};
