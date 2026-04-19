import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheet } from "../../ui/BottomSheet";
import { API_SERVICES } from "../../../constants";

export const ApiInfoModal = ({ visible, onClose }) => {
    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.sheetContainer}
        >
            <Text style={styles.modalTitle}>Используемые API</Text>
            <Text style={styles.modalSubtitle}>
                Приложение использует данные следующих сервисов для поиска
                контента:
            </Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {API_SERVICES.map((api, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.apiCard}
                        onPress={() => Linking.openURL(api.url)}
                    >
                        <View style={styles.apiIconWrapper}>
                            <Ionicons
                                name={api.icon}
                                size={24}
                                color="#7D8AFF"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.apiName}>{api.name}</Text>
                            <Text style={styles.apiDesc}>{api.desc}</Text>
                        </View>
                        <Ionicons
                            name="open-outline"
                            size={18}
                            color="#4A5568"
                        />
                    </TouchableOpacity>
                ))}

                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        Все права на контент (постеры, описания, скриншоты)
                        принадлежат их правообладателям.
                    </Text>
                </View>
            </ScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 25,
        // Убрали border из основной обертки
        borderWidth: 0,
    },
    modalTitle: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    modalSubtitle: {
        color: "#8E94A4",
        fontSize: 14,
        marginBottom: 25,
        lineHeight: 20,
    },
    apiCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        gap: 16,
        // Оставили только внутренние границы карточек, если они нужны для объема
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.03)",
    },
    apiIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    apiName: { color: "#FFF", fontSize: 17, fontWeight: "bold" },
    apiDesc: { color: "#8E94A4", fontSize: 13, marginTop: 4, lineHeight: 18 },
    disclaimer: { marginTop: 20, paddingHorizontal: 10, opacity: 0.6 },
    disclaimerText: {
        color: "#8E94A4",
        fontSize: 12,
        textAlign: "center",
        fontStyle: "italic",
    },
});
