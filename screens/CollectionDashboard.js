import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trophy } from "lucide-react-native";

import { useCollectionStore } from "../store/useCollectionStore";
import AnalyticsPanel from "../components/screens/Main/Analytics/AnalyticsPanel";
import CollectionProgress from "../components/screens/Main/CollectionProgress";
import { useShallow } from "zustand/react/shallow";
import { getOrderedCategories } from "../constants";
import { useTheme } from "../hooks/useTheme";

const { width } = Dimensions.get("window");

const CATEGORY_ACTION_TEXTS = {
    game: "Перейти на next lvl",
    movie: "Перейти в кинотеатр",
    tv: "Перейти на lostfilm",
    anime: "Перейти в 2D мир",
    book: "Перейти в библиотеку",
};

export default function CollectionDashboard({ navigation }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const orderedCategories = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    const getCount = (categoryName) => {
        return myCollection.filter((item) => item.appSection === categoryName && !item.isFolder)
            .length;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 40 }]}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Мои коллекции</Text>
                <View style={styles.headerButton}>
                    <TouchableOpacity onPress={() => navigation.navigate("Achievements")}>
                        <Trophy size={22} color={theme.accent} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.grid}>
                    {orderedCategories.map((cat, index) => {
                        const isLast = index === orderedCategories.length - 1;
                        const subTextAction =
                            CATEGORY_ACTION_TEXTS[cat.id] || "Перейти к коллекции";

                        return (
                            <TouchableOpacity
                                key={cat.id}
                                style={[styles.card, isLast && styles.cardFullWidth]}
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate("MainScreen", {
                                        appSection: cat.id,
                                    })
                                }
                            >
                                <View style={styles.cardGlow} />

                                <View
                                    style={[
                                        isLast ? styles.fullWidthLayout : styles.standardLayout,
                                    ]}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={styles.iconWrapper}>
                                            <Image
                                                source={cat.active}
                                                style={styles.icon}
                                                tintColor={theme.accent}
                                            />
                                        </View>

                                        {!isLast && (
                                            <Text style={styles.countText}>{getCount(cat.id)}</Text>
                                        )}
                                    </View>

                                    <View
                                        style={[
                                            styles.cardFooter,
                                            isLast && styles.cardFooterFullWidth,
                                        ]}
                                    >
                                        <View>
                                            <Text style={styles.cardText}>{cat.label}</Text>
                                            <Text style={styles.subText}>{subTextAction}</Text>
                                        </View>

                                        {isLast && (
                                            <View style={styles.countFullWidthContainer}>
                                                <Text style={styles.countTextFullWidth}>
                                                    {getCount(cat.id)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <CollectionProgress collection={myCollection} />
                <AnalyticsPanel collection={myCollection} />
            </ScrollView>
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.dark, paddingHorizontal: 20 },
        headerRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 75,
        },
        headerButton: {
            backgroundColor: theme.main,
            width: 45,
            height: 45,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
        },
        headerTitle: {
            color: theme.text,
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
            height: 180,
            backgroundColor: theme.main,
            borderRadius: 28,
            padding: 20,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: theme.main,
            overflow: "hidden",
        },
        cardFullWidth: {
            width: "100%",
            height: 110,
        },
        cardGlow: {
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            backgroundColor: theme.accentMuted,
            borderRadius: 60,
        },
        standardLayout: {
            flex: 1,
            justifyContent: "space-between",
        },
        fullWidthLayout: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        icon: { width: 24, height: 24, objectFit: "contain" },
        countText: {
            color: theme.accent,
            fontSize: 16,
            fontWeight: "700",
            width: 40,
            textAlign: "center",
            marginRight: -5,
            marginTop: 5,
        },
        countTextFullWidth: {
            color: theme.accent,
            fontSize: 16,
            fontWeight: "700",
            width: 40,
            textAlign: "center",
            marginRight: -5,
            marginTop: -25,
        },
        cardFooter: {
            gap: 4,
        },
        cardFooterFullWidth: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: 15,
            position: "relative",
        },
        cardText: { color: theme.text, fontSize: 18, fontWeight: "700" },
        subText: { color: theme.textDark, fontSize: 12, fontWeight: "500" },
    });
