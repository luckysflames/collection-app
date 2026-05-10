import React, { useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";

import { useCollectionStore } from "../store/useCollectionStore";
import { AchievementItem } from "../components/screens/Achievements/AchievementItem";
import { AchievementDetailModal } from "../components/screens/Achievements/AchievementDetailModal";
import { calculateAchievements } from "../utils/calculateAchievments";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";
import { ACHIEVEMENT_GROUPS } from "../constants";

export default function AchievementsScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const [selectedAchiv, setSelectedAchiv] = useState(null);

    const groupedAchievements = useMemo(() => {
        const withProgress = calculateAchievements(myCollection);

        // Создаем объект, где ключи — это groupId
        const groups = withProgress.reduce((acc, achiv) => {
            const groupId = achiv.groupId || "other";
            if (!acc[groupId]) acc[groupId] = [];
            acc[groupId].push(achiv);
            return acc;
        }, {});

        // Превращаем в массив для отрисовки
        return Object.keys(groups).map((groupId) => ({
            id: groupId,
            title: ACHIEVEMENT_GROUPS[groupId] || "Прочее",
            data: groups[groupId],
        }));
    }, [myCollection]);

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top - 20 }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.headerButton}
                >
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Достижения</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {groupedAchievements.map((group) => (
                    <View key={group.id} style={styles.groupContainer}>
                        <Text style={styles.groupTitle}>{group.title}</Text>
                        {group.data.map((item) => (
                            <AchievementItem
                                key={item.id}
                                achievement={item}
                                onPress={setSelectedAchiv}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>

            <AchievementDetailModal
                visible={!!selectedAchiv}
                achievement={selectedAchiv}
                onClose={() => setSelectedAchiv(null)}
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
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 30,
        backgroundColor: "#050B18",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 15,
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
    groupContainer: {
        marginBottom: 25,
    },
    groupTitle: {
        color: "#7D8AFF", // Акцентный цвет для заголовка группы
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 5,
    },
});
