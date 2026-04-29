import React, { useState } from "react";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FolderPlus } from "lucide-react-native";

// UI Components
import { CategoryChips } from "../components/ui/CategoryChips";
import { ScreenHeader } from "../components/screens/Main/ScreenHeader";
import { MainControls } from "../components/screens/Main/MainControls";
import { MainPager } from "../components/screens/Main/MainPager";

// Modals
import { CreateFolderModal } from "../components/screens/Main/Modals/CreateFolderModal";
import { SortModal } from "../components/screens/Main/Modals/SortModal";
import { FilterModal } from "../components/screens/Main/Modals/FilterModal/FilterModal";

// Logic & Hooks
import { useCollectionStore } from "../store/useCollectionStore";
import { useMediaCategories } from "../hooks/useMediaCategories";
import { useCollectionCounter } from "../hooks/useCollectionCounter";
import { useMainActions } from "../hooks/useMainActions";
import { useMainNavigation } from "../hooks/useMainNavigation";
import {
    SECTIONS,
    DEFAULT_STATUS_BY_SECTION,
    SECTION_MAPPING,
    FAVORITE_STATUS,
} from "../constants";

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();

    // --- Store Data ---
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    // --- Section & Category Logic ---
    const currentSection =
        route.params?.category || route.params?.appSection || "movie";
    const { CATEGORIES, defaultActive } = useMediaCategories(currentSection);

    // --- Local State ---
    const [activeCategory, setActiveCategory] = useState(defaultActive);
    const [sortType, setSortType] = useState("date_desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFoldersOnly, setShowFoldersOnly] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    // Modals Visibility
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

    // --- Custom Hooks (Isolated Logic) ---

    // 1. Navigation, Pager and Scroll Sync
    const {
        chipsRef,
        pagerRef,
        scrollX,
        handleChipPress,
        handleMomentumScrollEnd,
        onScrollEvent,
    } = useMainNavigation(
        CATEGORIES,
        defaultActive,
        currentSection,
        setActiveCategory,
    );

    // 2. Interaction Actions (Press, Long Press, Random)
    const { handleCardPress, handleCardLongPress, handleRandomCard } =
        useMainActions(
            currentSection,
            activeCategory,
            navigation,
            activeFilters,
        );

    // 3. Counter Logic
    const currentItemsCount = useCollectionCounter(
        myCollection,
        currentSection,
        activeCategory,
        showFoldersOnly,
        searchQuery,
        activeFilters,
    );

    // --- UI Helpers ---
    const displayTitle =
        SECTIONS.find((s) => s.id === currentSection)?.label || "Коллекция";
    const hasActiveFilters = Object.keys(activeFilters).length > 0;

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
                count={currentItemsCount}
                onSortPress={() => setIsSortVisible(true)}
                onFilterPress={() => setIsFilterVisible(true)}
                showFoldersOnly={showFoldersOnly}
                onToggleFolderMode={() => setShowFoldersOnly(!showFoldersOnly)}
                onRandomPress={handleRandomCard}
                hasActiveFilters={hasActiveFilters}
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
                activeFilters={activeFilters}
                handleCardPress={handleCardPress}
                onCardLongPress={handleCardLongPress}
                onMomentumScrollEnd={handleMomentumScrollEnd}
                onScroll={onScrollEvent}
            />

            <TouchableOpacity
                onPress={() => setIsFolderModalVisible(true)}
                style={[
                    styles.folderCreateBtn,
                    {
                        bottom: isCompactMenu
                            ? insets.bottom + 80
                            : insets.bottom + 110,
                    },
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

            <FilterModal
                isVisible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                currentSection={currentSection}
                activeFilters={activeFilters}
                onApplyFilters={setActiveFilters}
            />

            <CreateFolderModal
                isVisible={isFolderModalVisible}
                activeCategory={activeCategory}
                onClose={() => setIsFolderModalVisible(false)}
                onCreate={(name) => {
                    const folderStatus =
                        activeCategory === "Всё" || activeCategory === "Папки"
                            ? FAVORITE_STATUS ||
                              DEFAULT_STATUS_BY_SECTION[
                                  SECTION_MAPPING[currentSection]
                              ]
                            : activeCategory;

                    createFolder(name, currentSection, folderStatus, []);
                    setIsFolderModalVisible(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#050B18",
    },
    folderCreateBtn: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: 60,
        width: 60,
        right: 20,
        borderRadius: 30,
        backgroundColor: "#0B1534",
    },
});
