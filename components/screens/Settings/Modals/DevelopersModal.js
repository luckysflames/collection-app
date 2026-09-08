import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { WarnModal } from "../../../ui/WarnModal";
import { useTheme } from "../../../../hooks/useTheme";

export const DevelopersModal = ({ visible, onClose, onSecretReset }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [clownClicks, setClownClicks] = useState(0);
    const [devClicks, setDevClicks] = useState(0);

    const [isQaSuccessVisible, setQaSuccessVisible] = useState(false);
    const [isDevSuccessVisible, setDevSuccessVisible] = useState(false);

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
            <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View style={styles.center}>
                        <TouchableOpacity activeOpacity={0.7} onPress={handleDevPress}>
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
                        <TouchableOpacity activeOpacity={0.8} onPress={handleClownPress}>
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 24 }}>🤡</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.specialTitle}>Черти</Text>
                            <Text style={styles.specialDesc}>
                                Тестировщики, чья единственная цель в жизни — нажать кнопку в
                                приложении так, чтобы что-то взорвалось. (Michaelills, Vladonikc)
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.subTitle}>При поддержке</Text>
                    <View style={styles.specialCard}>
                        <View style={styles.iconCircle}>
                            <Text style={{ fontSize: 24 }}>🐾</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.specialTitle}>Кошко-девочки</Text>
                            <Text style={styles.specialDesc}>
                                Морально поддерживали проект своим мурчанием и не давали выгореть.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </BottomSheet>

            <WarnModal
                visible={isQaSuccessVisible}
                type="error"
                title="Дотыкался!"
                message={`Кодовое слово было стерто.\nНа, держи Алю в купальнике`}
                onClose={() => setQaSuccessVisible(false)}
            >
                <View style={styles.easterEggContainer}>
                    <Image
                        source={require("../../../../assets/alya.png")}
                        style={styles.easterEggImage}
                        resizeMode="cover"
                    />
                </View>
            </WarnModal>

            <WarnModal
                visible={isDevSuccessVisible}
                type="info"
                title="Даун, ты долбаёб?"
                message={`В жопу себе блять дилдаком потыкай 54 раза, семпай\nВ награду только Юки в белье`}
                onClose={() => setDevSuccessVisible(false)}
            >
                <View style={styles.easterEggContainer}>
                    <Image
                        source={require("../../../../assets/yuki.png")}
                        style={styles.easterEggImage}
                        resizeMode="cover"
                    />
                </View>
            </WarnModal>
        </>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 25,
            borderWidth: 0,
        },
        center: { alignItems: "center", marginBottom: 20 },
        avatarWrapper: {
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        devName: { color: theme.text, fontSize: 22, fontWeight: "bold" },
        devRole: {
            color: theme.accent,
            fontSize: 14,
            marginTop: 5,
            fontWeight: "600",
        },
        separator: {
            height: 1,
            backgroundColor: theme.accentMuted,
            marginVertical: 20,
        },
        subTitle: {
            color: theme.textDark,
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "uppercase",
            marginBottom: 10,
        },
        specialCard: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            backgroundColor: theme.accentMuted,
            padding: 15,
            borderRadius: 20,
            gap: 15,
        },
        iconCircle: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        specialTitle: { color: theme.text, fontSize: 16, fontWeight: "bold" },
        specialDesc: { color: theme.textDark, fontSize: 13, marginTop: 2 },
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
            borderColor: theme.accent,
        },
    });
