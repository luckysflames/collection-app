import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";

import { SettingItem } from "../components/SettingsScreen/SettingItem";
import { getBugReportTemplate } from "../utils/bugReportHelper";
import { DevelopersModal } from "../components/SettingsScreen/DevelopersModal";
import { ApiInfoModal } from "../components/SettingsScreen/ApiInfoModal";
import { useCollectionStore } from "../store/useCollectionStore";

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const setIsCompactMenu = useCollectionStore(
        (state) => state.setIsCompactMenu,
    );
    const [isDevModalVisible, setDevModalVisible] = useState(false);
    const [isApiModalVisible, setApiModalVisible] = useState(false);

    const version = Constants.expoConfig?.version || "?.?.?";

    const handleReportBug = () => {
        const { recipient, subject, body } = getBugReportTemplate();
        Linking.openURL(
            `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(body)}`,
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <Text style={styles.headerTitle}>Настройки</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Секция: Внешний вид */}
                <Text style={styles.sectionTitle}>Внешний вид</Text>
                <View style={styles.card}>
                    {/* <SettingItem
                        icon="color-palette-outline"
                        label="Тема приложения"
                    />
                    <View style={styles.separator} /> */}
                    <SettingItem
                        icon="grid-outline"
                        label="Компактное меню"
                        type="switch"
                        value={isCompactMenu}
                        onValueChange={setIsCompactMenu}
                    />
                </View>

                {/* Секция: Поддержка */}
                <Text style={styles.sectionTitle}>Поддержка и связь</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="bug-outline"
                        label="Сообщить об ошибке"
                        onPress={handleReportBug}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon="people-outline"
                        label="О разработчиках"
                        onPress={() => setDevModalVisible(true)}
                    />
                </View>

                {/* Секция: Информация */}
                <Text style={styles.sectionTitle}>Данные</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon="cloud-download-outline"
                        label="Используемые API"
                        onPress={() => setApiModalVisible(true)}
                    />
                </View>

                {/* Версия приложения */}
                <View style={styles.versionFooter}>
                    <Text style={styles.versionText}>Geekly v{version}</Text>
                    <Text style={styles.buildText}>
                        Сделано с ❤️ для коллекционеров
                    </Text>
                </View>
            </ScrollView>

            <DevelopersModal
                visible={isDevModalVisible}
                onClose={() => setDevModalVisible(false)}
            />
            <ApiInfoModal
                visible={isApiModalVisible}
                onClose={() => setApiModalVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 25,
    },
    sectionTitle: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "600",
        textTransform: "uppercase",
        marginBottom: 10,
        marginLeft: 10,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 25,
        paddingVertical: 10,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    separator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginHorizontal: 16,
    },
    versionFooter: {
        marginTop: 10,
        alignItems: "center",
        opacity: 0.5,
    },
    versionText: {
        color: "#8E94A4",
        fontSize: 14,
        fontWeight: "bold",
    },
    buildText: {
        color: "#8E94A4",
        fontSize: 12,
        marginTop: 4,
    },
});
