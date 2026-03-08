import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MediaCard } from "../components/MediaCard";
import { useCollectionStore } from "../store/useCollectionStore";

export default function MainScreen({ route, navigation }) {
    const myCollection = useCollectionStore((state) => state.myCollection);
    const currentSection =
        route.params?.category || route.params?.appSection || "Фильмы";
    const [activeCategory, setActiveCategory] = useState();

    useEffect(() => {
        const section = route.params?.category || route.params?.appSection;
        if (section === "Книги") setActiveCategory("Читаю");
        else if (section === "Игры") setActiveCategory("Играю");
        else setActiveCategory("Смотрю");
    }, [route.params]);

    let CATEGORIES = [];
    currentSection === "Книги"
        ? (CATEGORIES = [
              "Читаю",
              "В планах",
              "Прочитано",
              "Перечитываю",
              "Брошено",
              "Отложено",
          ])
        : currentSection === "Игры"
          ? (CATEGORIES = [
                "Играю",
                "В планах",
                "Прошёл",
                "Переигрываю",
                "Брошено",
                "Отложено",
            ])
          : (CATEGORIES = [
                "Смотрю",
                "В планах",
                "Просмотрено",
                "Пересматриваю",
                "Брошено",
                "Отложено",
            ]);

    const pagerRef = useRef(null); // Реф для управления скроллом

    // Функция для переключения категории при клике на чипс
    const handleChipPress = (cat, index) => {
        setActiveCategory(cat);
        pagerRef.current?.scrollToIndex({ index, animated: true });
    };

    // Обработка завершения скролла свайпом
    const onMomentumScrollEnd = (e) => {
        const index = Math.round(
            e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
        );
        setActiveCategory(CATEGORIES[index]);
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top - 10 }]}>
            {/* Заголовок */}
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Моя коллекция</Text>

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
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => handleChipPress(cat, index)}
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

            <FlatList
                ref={pagerRef}
                data={CATEGORIES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumScrollEnd}
                keyExtractor={(item) => item}
                renderItem={({ item: category }) => {
                    // Фильтруем данные конкретно для этой "страницы"
                    const pageData = myCollection.filter(
                        (i) =>
                            i.appSection === currentSection &&
                            (i.status || "Смотрю") === category,
                    );

                    return (
                        <View
                            style={{
                                width: Math.round(
                                    Dimensions.get("window").width,
                                ),
                            }}
                        >
                            <FlatList
                                data={pageData}
                                renderItem={({ item }) => (
                                    <MediaCard
                                        item={item}
                                        onPress={() =>
                                            navigation.navigate("Details", {
                                                item,
                                            })
                                        }
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                contentContainerStyle={styles.listPadding}
                                ListEmptyComponent={() => (
                                    <Text style={styles.emptyText}>
                                        В разделе "{category}" пока пусто
                                    </Text>
                                )}
                            />
                        </View>
                    );
                }}
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
    emptyText: {
        color: "#8E94A4",
        fontSize: 16,
        textAlign: "center",
        marginTop: 20,
    },
});
