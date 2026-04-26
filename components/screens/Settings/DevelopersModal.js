import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image, // Добавили Image
} from "react-native";
import { BottomSheet } from "../../ui/BottomSheet";
import { WarnModal } from "../../ui/WarnModal";

export const DevelopersModal = ({ visible, onClose, onSecretReset }) => {
    // Счётчики кликов
    const [clownClicks, setClownClicks] = useState(0);
    const [devClicks, setDevClicks] = useState(0);

    // Состояния модалок
    const [isQaSuccessVisible, setQaSuccessVisible] = useState(false);
    const [isDevSuccessVisible, setDevSuccessVisible] = useState(false);

    // Обработчик для Клоуна (QA)
    const handleClownPress = () => {
        const newCount = clownClicks + 1;
        if (newCount >= 10) {
            onSecretReset();
            setClownClicks(0);
            setQaSuccessVisible(true);
        } else {
            setClownClicks(newCount);
        }
    };

    // Обработчик для Luckyflame (Разработчик)
    const handleDevPress = () => {
        const newCount = devClicks + 1;
        if (newCount >= 54) {
            setDevClicks(0);
            setDevSuccessVisible(true);
        } else {
            setDevClicks(newCount);
        }
    };

    return (
        <>
            <BottomSheet
                visible={visible}
                onClose={onClose}
                containerStyle={styles.sheetContainer}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View style={styles.center}>
                        {/* Оборачиваем аватар разработчика в TouchableOpacity */}
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handleDevPress}
                        >
                            <View style={styles.avatarWrapper}>
                                <Text style={{ fontSize: 40 }}>👨‍💻</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.devName}>luckyflame</Text>
                        <Text style={styles.devRole}>Главный разработчик</Text>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.subTitle}>Отдел разрушения (QA)</Text>
                    <View style={[styles.specialCard, { marginBottom: 20 }]}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleClownPress}
                        >
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 24 }}>🤡</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.specialTitle}>Черти</Text>
                            <Text style={styles.specialDesc}>
                                Тестировщики, чья единственная цель в жизни —
                                нажать кнопку в приложении так, чтобы что-то
                                взорвалось. (Michaelills, Vladonikc)
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.subTitle}>При поддержке</Text>
                    <View style={styles.specialCard}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 24 }}>🐾</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.specialTitle}>
                                Кошко-девочки
                            </Text>
                            <Text style={styles.specialDesc}>
                                Морально поддерживали проект своим мурчанием и
                                не давали выгореть.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </BottomSheet>

            {/* Модалка 1: Для QA (сброс пароля) */}
            <WarnModal
                visible={isQaSuccessVisible}
                type="error" // Сделаем красной для "чертей"
                title="Дотыкался!"
                message={`Кодовое слово было стерто.\nНа, держи Алю в купальнике`}
                onClose={() => setQaSuccessVisible(false)}
            >
                <View style={styles.easterEggContainer}>
                    <Image
                        source={require("../../../assets/alya.png")}
                        style={styles.easterEggImage}
                        resizeMode="cover"
                    />
                </View>
            </WarnModal>

            {/* Модалка 2: Для Luckyflame (с картинкой) */}
            <WarnModal
                visible={isDevSuccessVisible}
                type="info"
                title="Даун, ты долбаёб?"
                message={`В жопу себе блять дилдаком потыкай 54 раза, семпай\nВ награду только Юки в белье`}
                onClose={() => setDevSuccessVisible(false)}
            >
                <View style={styles.easterEggContainer}>
                    <Image
                        source={require("../../../assets/yuki.png")}
                        style={styles.easterEggImage}
                        resizeMode="cover"
                    />
                </View>
            </WarnModal>
        </>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 25,
        borderWidth: 0,
    },
    center: { alignItems: "center", marginBottom: 20 },
    avatarWrapper: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#7D8AFF",
    },
    devName: { color: "#FFF", fontSize: 22, fontWeight: "bold" },
    devRole: {
        color: "#7D8AFF",
        fontSize: 14,
        marginTop: 5,
        fontWeight: "600",
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginVertical: 20,
    },
    subTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 10,
    },
    specialCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        padding: 15,
        borderRadius: 20,
        gap: 15,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    specialTitle: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    specialDesc: { color: "#8E94A4", fontSize: 13, marginTop: 2 },

    // Стили для пасхалки
    easterEggContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    easterEggImage: {
        width: 267,
        height: 400,
        objectFit: "cover",
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#7D8AFF",
    },
});
