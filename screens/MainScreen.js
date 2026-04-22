import React, {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback,
} from "react";
import {
    StyleSheet,
    View,
    Animated,
    Dimensions,
    TouchableOpacity,
    Platform,
    Vibration,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

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
import {
    SECTIONS,
    DEFAULT_STATUS_BY_SECTION,
    SECTION_MAPPING,
    FAVORITE_STATUS,
} from "../constants";
import { FolderPlus } from "lucide-react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const updateCard = useCollectionStore((state) => state.updateCard);

    const currentSection =
        route.params?.category || route.params?.appSection || "movie";
    const { CATEGORIES, defaultActive } = useMediaCategories(currentSection);

    // --- State ---
    const [activeCategory, setActiveCategory] = useState(defaultActive);
    const [sortType, setSortType] = useState("newest");
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [showFoldersOnly, setShowFoldersOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        searchQuery,
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

    const handleCardLongPress = useCallback(
        async (item) => {
            if (Platform.OS === "android") {
                // [пауза до начала, время вибрации 1, пауза 1, время вибрации 2, ...]
                Vibration.vibrate([0, 30, 1, 30]);
            } else {
                // На iOS Haptics работает идеально, оставляем его
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }

            updateCard(item.id, { isPinned: !item.isPinned });
        },
        [updateCard],
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
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
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
                searchQuery={searchQuery}
                listKey={`list-${currentSection}`}
                CATEGORIES={CATEGORIES}
                currentSection={currentSection}
                myCollection={myCollection}
                navigation={navigation}
                sortType={sortType}
                showFoldersOnly={showFoldersOnly}
                handleCardPress={handleCardPress}
                onCardLongPress={handleCardLongPress}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
            />

            <TouchableOpacity
                onPress={() => setIsFolderModalVisible(true)}
                style={[
                    styles.folderCreateBtn,
                    { bottom: isCompactMenu ? 80 : 120 },
                ]}
            >
                <FolderPlus size={28} color="#7D8AFF" />
            </TouchableOpacity>

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
                              ] || FAVORITE_STATUS
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
    folderCreateBtn: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        width: 60,
        right: 20,
        borderRadius: "50%",
        backgroundColor: "#0B1534",
    },
});
