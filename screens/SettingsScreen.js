import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import {
    List,
    Trash2,
    LayoutGrid,
    Bug,
    Users,
    CloudDownload,
    Vibrate,
    Download,
    Upload,
    Volume2,
    Bell,
    Palette,
} from "lucide-react-native";

import { getBugReportTemplate } from "../utils/bugReportHelper";
import { useCollectionStore } from "../store/useCollectionStore";
import { SettingItem } from "../components/screens/Settings/SettingItem";
import { DevelopersModal } from "../components/screens/Settings/Modals/DevelopersModal";
import { ApiInfoModal } from "../components/screens/Settings/Modals/ApiInfoModal";
import { useDataManagement } from "../hooks/useDataManagement";
import { useFileManagement } from "../hooks/useFileManagement";
import { useTheme } from "../hooks/useTheme";
import ThemeSelectModal from "../components/screens/Settings/Modals/ThemeSelectModal";

export default function SettingsScreen({ navigation }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const store = useCollectionStore();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const setIsCompactMenu = useCollectionStore((state) => state.setIsCompactMenu);
    const isVibration = useCollectionStore((state) => state.isVibration);
    const setIsVibration = useCollectionStore((state) => state.setIsVibration);
    const isSound = useCollectionStore((state) => state.isSound);
    const setIsSound = useCollectionStore((state) => state.setIsSound);
    const isNotify = useCollectionStore((state) => state.isNotify);
    const setIsNotify = useCollectionStore((state) => state.setIsNotify);

    const { actions } = useDataManagement(store);
    const { handleExportCollection, handleImportCollection, FileModal } = useFileManagement(store);

    const [isThemeModalVisible, setThemeModalVisible] = useState(false);
    const [isDevModalVisible, setDevModalVisible] = useState(false);
    const [isApiModalVisible, setApiModalVisible] = useState(false);

    const version = Constants.expoConfig?.version || "?.?.?";

    const handleReportBug = () => {
        const { recipient, subject, body } = getBugReportTemplate();
        Linking.openURL(`mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(body)}`);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <Text style={styles.headerTitle}>Настройки</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <Text style={styles.sectionTitle}>Персонализация</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon={LayoutGrid}
                        label="Компактное меню"
                        type="switch"
                        value={isCompactMenu}
                        onValueChange={setIsCompactMenu}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Vibrate}
                        label="Вибрация"
                        type="switch"
                        value={isVibration}
                        onValueChange={setIsVibration}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Volume2}
                        label="Звук"
                        type="switch"
                        value={isSound}
                        onValueChange={setIsSound}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Bell}
                        label="Достижения"
                        type="switch"
                        value={isNotify}
                        onValueChange={setIsNotify}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Palette}
                        label="Темы"
                        onPress={() => setThemeModalVisible(true)}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={List}
                        label="Настройки интерфейса"
                        onPress={() => navigation.navigate("StatusManager")}
                    />
                </View>

                <Text style={styles.sectionTitle}>Управление данными</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon={Upload}
                        label="Экспорт коллекции"
                        onPress={handleExportCollection}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Download}
                        label="Импорт коллекции"
                        onPress={handleImportCollection}
                    />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Trash2}
                        label="Сброс данных"
                        onPress={() => navigation.navigate("DataManagement")}
                    />
                </View>

                <Text style={styles.sectionTitle}>Источники контента</Text>
                <View style={styles.card}>
                    <SettingItem
                        icon={CloudDownload}
                        label="Используемые API"
                        onPress={() => setApiModalVisible(true)}
                    />
                </View>

                <Text style={styles.sectionTitle}>Поддержка и связь</Text>
                <View style={styles.card}>
                    <SettingItem icon={Bug} label="Сообщить об ошибке" onPress={handleReportBug} />
                    <View style={styles.separator} />
                    <SettingItem
                        icon={Users}
                        label="О разработчиках"
                        onPress={() => setDevModalVisible(true)}
                    />
                </View>

                <View
                    style={[
                        styles.versionFooter,
                        {
                            marginBottom: isCompactMenu ? insets.bottom + 40 : insets.bottom + 50,
                        },
                    ]}
                >
                    <Text style={styles.versionText}>Geekly v{version}</Text>
                    <Text style={styles.buildText}>Сделано с ❤️ к коллекциям</Text>
                </View>
            </ScrollView>

            <ThemeSelectModal
                visible={isThemeModalVisible}
                onClose={() => setThemeModalVisible(false)}
            />

            <DevelopersModal
                visible={isDevModalVisible}
                onClose={() => setDevModalVisible(false)}
                onSecretReset={actions.handleRemovePassword}
            />

            <ApiInfoModal visible={isApiModalVisible} onClose={() => setApiModalVisible(false)} />

            <FileModal />
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.dark,
            paddingHorizontal: 20,
        },
        headerTitle: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 7.5,
            marginBottom: 20,
        },
        sectionTitle: {
            color: theme.textDark,
            fontSize: 14,
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: 10,
            marginLeft: 10,
            letterSpacing: 1,
        },
        card: {
            backgroundColor: theme.main,
            borderRadius: 25,
            paddingVertical: 10,
            marginBottom: 25,
        },
        separator: {
            height: 1,
            backgroundColor: theme.accentMuted,
            marginHorizontal: 16,
            marginVertical: 5,
        },
        versionFooter: {
            marginTop: 10,
            alignItems: "center",
            opacity: 0.5,
        },
        versionText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "bold",
        },
        buildText: {
            color: theme.textDark,
            fontSize: 12,
            marginTop: 4,
        },
    });
