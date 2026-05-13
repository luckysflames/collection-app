import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    LayoutAnimation,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react-native";

import { SUB_CATEGORIES } from "../constants/index";
import { useCollectionStore } from "../store/useCollectionStore";
import AnalyticsPanel from "../components/screens/Main/Analytics/AnalyticsPanel";
import CollectionProgress from "../components/screens/Main/CollectionProgress";

const { width } = Dimensions.get("window");

export default function CollectionDashboard({ navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);

    const totalItems = myCollection.filter((item) => !item.isFolder).length;

    const getCount = (categoryName) => {
        return myCollection.filter(
            (item) => item.appSection === categoryName && !item.isFolder,
        ).length;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 40 }]}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Мои коллекции</Text>
                <View style={styles.headerButton}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Achievements")}
                    >
                        <Trophy size={22} color="#7D8AFF" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.grid}>
                    {SUB_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() =>
                                navigation.navigate("MainScreen", {
                                    appSection: cat.id,
                                })
                            }
                        >
                            <View style={styles.cardGlow} />
                            <View style={styles.cardHeader}>
                                <View style={styles.iconWrapper}>
                                    <Image
                                        source={cat.active}
                                        style={styles.icon}
                                        tintColor="#7D8AFF"
                                    />
                                </View>
                                <Text style={styles.countText}>
                                    {getCount(cat.id)}
                                </Text>
                            </View>
                            <View style={styles.cardFooter}>
                                <Text style={styles.cardText}>{cat.label}</Text>
                                <Text style={styles.subText}>
                                    Перейти к списку
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Компонент прогресса */}
                <CollectionProgress totalItems={totalItems} />

                {/* Компонент аналитики */}
                <AnalyticsPanel collection={myCollection} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18", paddingHorizontal: 20 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 75,
    },
    headerButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    scrollContent: {
        paddingBottom: 120,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    card: {
        width: (width - 55) / 2,
        height: 180, // Чуть выше для лучшей композиции
        backgroundColor: "#0B1534",
        borderRadius: 28,
        padding: 20,
        marginBottom: 15,
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
        overflow: "hidden", // Чтобы свечение не вылезало
    },
    cardGlow: {
        position: "absolute",
        top: -40,
        right: -40,
        width: 100,
        height: 100,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderRadius: 50,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    icon: { width: 24, height: 24, objectFit: "contain" },
    countText: {
        color: "rgba(125, 138, 255, 0.8)",
        fontSize: 16,
        fontWeight: "700",
        width: 30,
        textAlign: "center",
        marginRight: -10,
        marginTop: -5,
    },
    cardFooter: {
        gap: 4,
    },
    cardText: { color: "#fff", fontSize: 18, fontWeight: "700" },
    subText: { color: "#4E5564", fontSize: 12, fontWeight: "500" },

    // Баннер внизу
    statsBanner: {
        marginTop: 10,
        padding: 20,
        backgroundColor: "rgba(125, 138, 255, 0.05)",
        borderRadius: 28,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.1)",
    },
    statsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    statsTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    goalPicker: {
        marginBottom: 20,
        paddingTop: 5,
    },
    pickerLabel: {
        color: "#4E5564",
        fontSize: 12,
        marginBottom: 10,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    optionBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    activeOptionBadge: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    optionText: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
    },
    activeOptionText: {
        color: "#fff",
    },
    progressBar: {
        height: 10,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 5,
        marginBottom: 10,
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#7D8AFF",
        borderRadius: 5,
        // Можно добавить тень для свечения бара
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    statsFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statsSubtitle: { color: "#8E94A4", fontSize: 12 },
    statsPercent: { color: "#7D8AFF", fontSize: 12, fontWeight: "700" },
});
