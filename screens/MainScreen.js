import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChips } from "../components/MainScreen/CategoryChips";
import { ScreenHeader } from "../components/MainScreen/ScreenHeader";
import { CategoryPage } from "../components/MainScreen/CategoryPage";
import { useCollectionStore } from "../store/useCollectionStore";
import { useMediaCategories } from "../hooks/useMediaCategories";

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const currentSection =
        route.params?.category || route.params?.appSection || "Фильмы";

    const { CATEGORIES, defaultActive, sectionName } =
        useMediaCategories(currentSection);
    const [activeCategory, setActiveCategory] = useState(defaultActive);

    const pagerRef = useRef(null);
    const chipsRef = useRef(null);

    useEffect(() => {
        // Сбрасываем стейт на начальное значение для нового раздела
        setActiveCategory(defaultActive);

        // Мгновенно перекидываем FlatList и Чипсы в начало
        pagerRef.current?.scrollToOffset({ offset: 0, animated: false });
        chipsRef.current?.scrollToIndex(0);
    }, [currentSection, defaultActive]);

    // Авто-скролл чипсов при изменении активной категории (даже свайпом)
    useEffect(() => {
        const index = CATEGORIES.indexOf(activeCategory);
        if (index !== -1) {
            chipsRef.current?.scrollToIndex(index); // Используем метод из нашего forwardRef
        }
    }, [activeCategory]);

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top - 40 }]}>
            <ScreenHeader
                title={`${currentSection}`}
                // title={`Моя коллекция ${sectionName}`}
                onAddPress={() =>
                    navigation.navigate("AddCard", { currentSection })
                }
            />

            <CategoryChips
                ref={chipsRef}
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onPress={(cat, index) => {
                    setActiveCategory(cat);
                    pagerRef.current?.scrollToIndex({ index, animated: true });
                }}
            />

            <FlatList
                ref={pagerRef}
                data={CATEGORIES}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x /
                            Dimensions.get("window").width,
                    );
                    setActiveCategory(CATEGORIES[index]);
                }}
                renderItem={({ item }) => (
                    <CategoryPage
                        category={item}
                        currentSection={currentSection}
                        data={myCollection}
                        navigation={navigation}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#050B18",
    },
});
