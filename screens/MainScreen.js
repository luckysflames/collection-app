import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaCard } from "../components/MediaCard";
import { useCollectionStore } from "../store/useCollectionStore";

const CATEGORIES = ["Смотрю", "В планах", "Просмотрено", "Брошено", "Отложено"];

export default function MainScreen({ route, navigation }) {
    const myCollection = useCollectionStore((state) => state.myCollection);

    const currentSection = route.params?.appSection || "Фильмы";
    const [activeCategory, setActiveCategory] = useState("Смотрю");

    const filteredData = myCollection.filter((item) => {
        // return true;
        // Проверяем принадлежность к табу через appSection
        const isRightSection = item.appSection === currentSection;

        // Проверяем чипс
        const itemStatus = item.status || "Смотрю";
        const isRightStatus = itemStatus === activeCategory;

        return isRightSection && isRightStatus;
    });

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top - 10 }]}>
            {/* Заголовок */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Моя Коллекция</Text>

                {/* Кнопка добавления вручную */}
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("AddCard", { currentSection })
                    }
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={30}
                        color="#7D8AFF"
                    />
                </TouchableOpacity>
            </View>

            {/* Горизонтальные фильтры (Чипсы) */}
            <View style={{ height: 50 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsContainer}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.chip,
                                activeCategory === cat && styles.activeChip,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    activeCategory === cat &&
                                        styles.activeChipText,
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Сетка карточек */}
            <FlatList
                data={filteredData}
                renderItem={({ item }) => (
                    <MediaCard
                        item={item}
                        // 2. Передаем функцию перехода
                        onPress={() => navigation.navigate("Details", { item })}
                    />
                )}
                key={myCollection.length}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text
                        style={{
                            color: "#8E94A4",
                            textAlign: "center",
                            marginTop: 20,
                        }}
                    >
                        В разделе "{activeCategory}" пока ничего нет
                    </Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18", // Глубокий темно-синий из макета
        // marginTop: 40,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
    },
    chipsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 10,
        alignItems: "center",
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        marginRight: 10,
        height: 35,
    },
    activeChip: {
        backgroundColor: "#7D8AFF", // Цвет активного фильтра (фиолетово-синий)
    },
    chipText: {
        color: "#8E94A4",
        fontSize: 13,
    },
    activeChipText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    listPadding: {
        paddingBottom: 100, // Чтобы контент не перекрывался таб-баром
    },
});
