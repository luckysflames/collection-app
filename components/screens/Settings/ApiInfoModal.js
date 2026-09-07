import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { BottomSheet } from "../../ui/BottomSheet";
import { API_SERVICES, SUB_CATEGORIES } from "../../../constants/index";
import { useTheme } from "../../../hooks/useTheme";
import { CodeXml, SquareArrowOutUpRight } from "lucide-react-native";

export const ApiInfoModal = ({ visible, onClose }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const getApiIcon = (category) => {
        const found = SUB_CATEGORIES.find((item) => item.id === category);
        return found ? found.active : null;
    };

    return (
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
            <Text style={styles.modalTitle}>Используемые API</Text>
            <Text style={styles.modalSubtitle}>
                Приложение использует данные следующих сервисов для поиска контента:
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {API_SERVICES.map((api, index) => {
                    const localIcon = getApiIcon(api.category);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.apiCard}
                            onPress={() => Linking.openURL(api.url)}
                        >
                            <View style={styles.apiIconWrapper}>
                                {localIcon ? (
                                    <Image source={localIcon} style={styles.localIcon} />
                                ) : (
                                    <CodeXml size={24} color={theme.accent} />
                                )}
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.apiName}>{api.name}</Text>
                                <Text style={styles.apiDesc}>{api.desc}</Text>
                            </View>
                            <SquareArrowOutUpRight size={18} color={theme.textDark} />
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        Все права на контент (постеры, описания, скриншоты) принадлежат их
                        правообладателям.
                    </Text>
                </View>
            </ScrollView>
        </BottomSheet>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 25,
            borderWidth: 0,
        },
        modalTitle: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 8,
        },
        modalSubtitle: {
            color: theme.textDark,
            fontSize: 14,
            marginBottom: 25,
            lineHeight: 20,
        },
        apiCard: {
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.accent,
            padding: 16,
            borderRadius: 20,
            marginBottom: 12,
            gap: 16,
        },
        apiIconWrapper: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        localIcon: {
            width: 24,
            height: 24,
            resizeMode: "contain",
            tintColor: theme.accent,
        },
        apiName: { color: theme.accent, fontSize: 17, fontWeight: "bold" },
        apiDesc: { color: theme.text, fontSize: 13, marginTop: 4, lineHeight: 18 },
        disclaimer: { marginTop: 20, paddingHorizontal: 10, opacity: 0.6 },
        disclaimerText: {
            color: theme.textDark,
            fontSize: 12,
            textAlign: "center",
            fontStyle: "italic",
        },
    });
