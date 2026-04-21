import React, {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// UI & Components
import { CategoryChips } from "../components/ui/CategoryChips";
import { ScreenHeader } from "../components/screens/Main/ScreenHeader";
import { MainControls } from "../components/screens/Main/MainControls";
import { MainPager } from "../components/screens/Main/MainPager"; // Наш новый компонент

// Modals
import { CreateFolderModal } from "../components/screens/Main/Modals/CreateFolderModal";
import { SortModal } from "../components/screens/Main/Modals/SortModal";

// Logic
import { useCollectionStore } from "../store/useCollectionStore";
import { useMediaCategories } from "../hooks/useMediaCategories";
import { useCollectionCounter } from "../hooks/useCollectionCounter";
import { SECTIONS, DEFAULT_STATUS_BY_SECTION, SECTION_MAPPING } from "../constants";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);

    const currentSection =
        route.params?.category || route.params?.appSection || "movie";
    const { CATEGORIES, defaultActive } = useMediaCategories(currentSection);

    // --- State ---
    const [activeCategory, setActiveCategory] = useState(defaultActive);
    const [sortType, setSortType] = useState("newest");
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [showFoldersOnly, setShowFoldersOnly] = useState(false);

    // --- Refs & Animation ---
    const chipsRef = useRef(null);
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const initialIndex = useMemo(
        () => CATEGORIES.indexOf(defaultActive),
        [CATEGORIES, defaultActive],
    );
    const currentItemsCount = useCollectionCounter(
        myCollection,
        currentSection,
        activeCategory,
        showFoldersOnly,
    );

    // --- Side Effects ---
    useEffect(() => {
        setActiveCategory(defaultActive);
        const timer = setTimeout(() => {
            if (pagerRef.current && initialIndex !== -1) {
                pagerRef.current.scrollToIndex({
                    index: initialIndex,
                    animated: false,
                });
                chipsRef.current?.scrollToIndex(initialIndex);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [currentSection, defaultActive]);

    // --- Handlers ---
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

    const handleChipPress = (cat, index) => {
        setActiveCategory(cat);
        pagerRef.current?.scrollToIndex({ index, animated: true });
    };

    const handleMomentumScrollEnd = (e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        if (CATEGORIES[index]) {
            setActiveCategory(CATEGORIES[index]);
            chipsRef.current?.scrollToIndex(index);
        }
    };

    const displayTitle =
        SECTIONS.find((s) => s.id === currentSection)?.label || "Коллекция";

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top - 40 }]}>
            <ScreenHeader
                title={displayTitle}
                onAddPress={() => setIsFolderModalVisible(true)}
                onBack={() => navigation.goBack()}
            />

            <CategoryChips
                ref={chipsRef}
                categories={CATEGORIES}
                activeCategory={activeCategory}
                scrollX={scrollX}
                onPress={handleChipPress}
            />

            <MainControls
                sortType={sortType}
                count={currentItemsCount}
                onSortPress={() => setIsSortVisible(true)}
                showFoldersOnly={showFoldersOnly}
                onToggleFolderMode={() => setShowFoldersOnly(!showFoldersOnly)}
            />

            <MainPager
                ref={pagerRef}
                listKey={`list-${currentSection}`}
                CATEGORIES={CATEGORIES}
                currentSection={currentSection}
                myCollection={myCollection}
                navigation={navigation}
                sortType={sortType}
                showFoldersOnly={showFoldersOnly}
                handleCardPress={handleCardPress}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
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
                    const folderStatus =
                        activeCategory === "Всё" || activeCategory === "Папки"
                            ? DEFAULT_STATUS_BY_SECTION[
                                  SECTION_MAPPING[currentSection]
                              ] || "Смотрю"
                            : activeCategory;

                    createFolder(name, currentSection, folderStatus, []);
                    setIsFolderModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#050B18" },
});
