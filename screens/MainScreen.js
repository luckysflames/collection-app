import React, {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react";
import { StyleSheet, View, Dimensions, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryChips } from "../components/ui/CategoryChips";
import { ScreenHeader } from "../components/screens/Main/ScreenHeader";
import { CreateFolderModal } from "../components/screens/Main/Modals/CreateFolderModal";
import { MainControls } from "../components/screens/Main/MainControls";
import { SortModal } from "../components/screens/Main/Modals/SortModal";
import { CategoryPage } from "../components/shared/CategoryPage";

import { useCollectionStore } from "../store/useCollectionStore";
import { useMediaCategories } from "../hooks/useMediaCategories";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();

    // Store & State
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);

    const currentSection =
        route.params?.category || route.params?.appSection || "Фильмы";
    const { CATEGORIES, defaultActive } = useMediaCategories(currentSection);

    const [activeCategory, setActiveCategory] = useState(defaultActive);
    const [sortType, setSortType] = useState("newest");
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

    // Refs & Animation
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // --- LOGIC: Навигация между карточками ---
    const handleCardPress = useCallback(
        (clickedItem) => {
            if (clickedItem.isFolder) {
                navigation.navigate("FolderDetail", {
                    folderId: clickedItem.id,
                    title: clickedItem.title,
                });
            } else {
                navigation.navigate("Details", {
                    item: clickedItem,
                    category: currentSection,
                });
            }
        },
        [navigation, currentSection],
    );

    // --- LOGIC: Подсчет количества элементов (упрощенный) ---
    const currentItemsCount = useMemo(() => {
        return myCollection.filter((item) => {
            const sectionMatch = item.appSection === currentSection;

            // Если в объекте нет статуса, определяем дефолтный для этого раздела
            const itemStatus =
                item.status ||
                (currentSection === "Книги"
                    ? "Читаю"
                    : currentSection === "Игры"
                      ? "Играю"
                      : "Смотрю");

            const statusMatch = itemStatus === activeCategory;
            const isVisibleRoot =
                item.isFolder || !item.parentFolderIds?.length;

            return sectionMatch && statusMatch && isVisibleRoot;
        }).length;
    }, [myCollection, currentSection, activeCategory]);

    // Синхронизация при смене раздела
    useEffect(() => {
        setActiveCategory(defaultActive);
        pagerRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, [currentSection, defaultActive]);

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top - 40 }]}>
            <ScreenHeader
                title={currentSection}
                onAddPress={() => setIsFolderModalVisible(true)}
            />

            <CategoryChips
                categories={CATEGORIES}
                activeCategory={activeCategory}
                scrollX={scrollX}
                onPress={(cat, index) => {
                    setActiveCategory(cat);
                    pagerRef.current?.scrollToIndex({ index, animated: true });
                }}
            />

            <MainControls
                sortType={sortType}
                count={currentItemsCount}
                onSortPress={() => setIsSortVisible(true)}
            />

            <Animated.FlatList
                ref={pagerRef}
                data={CATEGORIES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
                    );
                    if (CATEGORIES[index]) setActiveCategory(CATEGORIES[index]);
                }}
                renderItem={({ item }) => (
                    <CategoryPage
                        category={item}
                        currentSection={currentSection}
                        data={myCollection}
                        navigation={navigation}
                        sortType={sortType}
                        onCardPress={handleCardPress}
                    />
                )}
                keyExtractor={(item) => item}
            />

            <SortModal
                isVisible={isSortVisible}
                onClose={() => setIsSortVisible(false)}
                currentSort={sortType}
                onSelectSort={setSortType}
            />

            <CreateFolderModal
                isVisible={isFolderModalVisible}
                activeCategory={activeCategory}
                onClose={() => setIsFolderModalVisible(false)}
                onCreate={(name) => {
                    createFolder(name, currentSection, activeCategory, []);
                    setIsFolderModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#050B18" },
});
