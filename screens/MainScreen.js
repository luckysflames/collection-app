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
import { SECTIONS, FAVORITE_STATUS } from "../constants";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();

    // --- STORE ---
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);

    // --- CATEGORIES LOGIC ---
    const currentSection =
        route.params?.category || route.params?.appSection || "movie";
    const displayTitle =
        SECTIONS.find((s) => s.id === currentSection)?.label || "Коллекция";
    const { CATEGORIES, defaultActive } = useMediaCategories(currentSection);

    // --- STATE ---
    const [activeCategory, setActiveCategory] = useState(defaultActive);
    const [sortType, setSortType] = useState("newest");
    const [isSortVisible, setIsSortVisible] = useState(false);
    const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);
    const [showFoldersOnly, setShowFoldersOnly] = useState(false);

    // --- REFS & ANIMATION ---
    const chipsRef = useRef(null);
    const pagerRef = useRef(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Вычисляем индекс дефолтной категории
    const initialIndex = useMemo(() => {
        const idx = CATEGORIES.indexOf(defaultActive);
        return idx !== -1 ? idx : 0;
    }, [CATEGORIES, defaultActive]);

    const listKey = useMemo(() => `list-${currentSection}`, [currentSection]);

    // --- EFFECTS ---

    useEffect(() => {
        // 1. Устанавливаем активную категорию в стейт
        setActiveCategory(defaultActive);

        // 2. Делаем принудительный скролл пейджера к нужному индексу.
        // Используем setTimeout, чтобы FlatList успел отрисовать элементы.
        const timer = setTimeout(() => {
            if (pagerRef.current && initialIndex !== -1) {
                pagerRef.current.scrollToIndex({
                    index: initialIndex,
                    animated: false, // В первый раз лучше без анимации, чтобы не дергалось
                });

                // Также просим чипсы скролльнуть к нужному индексу
                chipsRef.current?.scrollToIndex(initialIndex);
            }
        }, 100); // 100мс обычно хватает для рендера

        return () => clearTimeout(timer);
    }, [currentSection, defaultActive, initialIndex]);

    // --- HANDLERS ---
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

    const onScrollToIndexFailed = (info) => {
        const offset = info.averageItemLength * info.index;
        pagerRef.current?.scrollToOffset({ offset, animated: false });
    };

    // --- MEMOS ---
    const currentItemsCount = useMemo(() => {
        // 1. Берем айтемы только текущей секции (Movies/Games...)
        const items = myCollection.filter(
            (item) => item.appSection === currentSection,
        );

        // 2. Логика для системных вкладок
        if (activeCategory === "Всё") {
            if (showFoldersOnly) {
                // Считаем все папки + карточки без родителей
                return items.filter(
                    (i) =>
                        i.isFolder ||
                        !i.parentFolderIds ||
                        i.parentFolderIds.length === 0,
                ).length;
            }
            // Считаем только карточки (плоский список)
            return items.filter((i) => !i.isFolder).length;
        }

        if (activeCategory === "Папки") {
            return items.filter((i) => i.isFolder).length;
        }

        if (activeCategory === FAVORITE_STATUS) {
            const favoriteItems = items.filter((i) => i.isFavorite);
            if (showFoldersOnly) {
                return favoriteItems.length;
            }
            return favoriteItems.filter((i) => !i.isFolder).length;
        }

        // 3. Логика для статусных вкладок (Смотрю, В планах...)
        const statusItems = items.filter((i) => i.status === activeCategory);

        if (showFoldersOnly) {
            // Считаем папки этого статуса
            // + карточки этого статуса, у которых НЕТ папки с таким же статусом
            return statusItems.filter((item) => {
                if (item.isFolder) return true;

                const hasParent =
                    item.parentFolderIds && item.parentFolderIds.length > 0;
                if (!hasParent) return true;

                // Проверяем, есть ли родитель с ТАКИМ ЖЕ статусом в этой же секции
                const hasSameStatusParent = item.parentFolderIds.some(
                    (parentId) => {
                        const parent = myCollection.find(
                            (d) => d.id === parentId,
                        );
                        return parent && parent.status === activeCategory;
                    },
                );

                return !hasSameStatusParent;
            }).length;
        }

        // Обычный режим: только карточки этого статуса
        return statusItems.filter((i) => !i.isFolder).length;
    }, [myCollection, currentSection, activeCategory, showFoldersOnly]);

    return (
        <View style={[styles.mainContainer, { paddingTop: insets.top - 40 }]}>
            {/* Хедер с названием раздела */}
            <ScreenHeader
                title={displayTitle}
                onAddPress={() => setIsFolderModalVisible(true)}
            />

            {/* Полоска категорий (чипсы) */}
            <CategoryChips
                ref={chipsRef}
                categories={CATEGORIES}
                activeCategory={activeCategory}
                scrollX={scrollX}
                onPress={handleChipPress}
            />

            {/* Контролы: Сортировка, Счеткик, Переключатель папок */}
            <MainControls
                sortType={sortType}
                count={currentItemsCount}
                onSortPress={() => setIsSortVisible(true)}
                showFoldersOnly={showFoldersOnly}
                onToggleFolderMode={() => setShowFoldersOnly(!showFoldersOnly)}
            />

            {/* Пейджер страниц */}
            <Animated.FlatList
                key={listKey}
                ref={pagerRef}
                data={CATEGORIES}
                horizontal
                pagingEnabled
                initialScrollIndex={initialIndex}
                onScrollToIndexFailed={onScrollToIndexFailed}
                getItemLayout={(data, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
                    );
                    if (CATEGORIES[index]) {
                        setActiveCategory(CATEGORIES[index]);
                        chipsRef.current?.scrollToIndex(index);
                    }
                }}
                renderItem={({ item }) => (
                    <View style={{ width: SCREEN_WIDTH }}>
                        <CategoryPage
                            category={item}
                            currentSection={currentSection}
                            data={myCollection}
                            navigation={navigation}
                            sortType={sortType}
                            onCardPress={handleCardPress}
                            showFoldersOnly={showFoldersOnly}
                        />
                    </View>
                )}
                keyExtractor={(item) => `${currentSection}-${item}`}
            />

            {/* Модалки */}
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
                    // Определяем правильный статус для новой папки
                    let folderStatus = activeCategory;

                    // Если создаем на системных вкладках, берем дефолтный статус секции
                    if (
                        activeCategory === "Всё" ||
                        activeCategory === "Папки"
                    ) {
                        const defaultStatusMap = {
                            movie: "Смотрю",
                            anime: "Смотрю",
                            book: "Читаю",
                            game: "Играю",
                        };
                        folderStatus =
                            defaultStatusMap[currentSection] || "Смотрю";
                    }

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
});
