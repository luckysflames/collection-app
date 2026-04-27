import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { BottomSheet } from "../../../../ui/BottomSheet";
import { FILTER_CONFIG } from "../../../../../constants";
import { useCollectionStore } from "../../../../../store/useCollectionStore";

// Импорт компонентов страниц
import { FilterMainPage } from "./FilterMainPage";
import { FilterSelectPage } from "./FilterSelectPage";
import { FilterRangePage } from "./FilterRangePage";

// Импорт хелперов (предположим, ты вынес их)
import {
    renderFilterValue,
    getPresetsForFilter,
    generateDynamicFilters,
} from "./helpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterModal = ({
    isVisible,
    onClose,
    currentSection,
    activeFilters = {},
    onApplyFilters,
}) => {
    const { myCollection } = useCollectionStore();

    const [localFilters, setLocalFilters] = useState({});
    const [viewLevel, setViewLevel] = useState("main"); // 'main' | 'detail'
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [activeDetailId, setActiveDetailId] = useState(null); // Тот, что реально рендерится
    const [isAnimating, setIsAnimating] = useState(false);

    const slideAnim = useRef(new Animated.Value(0)).current;

    // Генерация фильтров
    const filters = useMemo(() => {
        const staticFilters = FILTER_CONFIG[currentSection] || [];
        const dynamicFilters = generateDynamicFilters(
            myCollection,
            currentSection,
        );
        return [...staticFilters, ...dynamicFilters];
    }, [currentSection, myCollection]);

    // Сброс состояния при открытии
    useEffect(() => {
        if (isVisible) {
            setViewLevel("main");
            setLocalFilters(activeFilters);
            slideAnim.setValue(0);
        }
    }, [isVisible, activeFilters]);

    const animatePage = (toValue, callback) => {
        Animated.spring(slideAnim, {
            // Spring приятнее для UI, чем timing
            toValue,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
        }).start(callback);
    };

    const goToFilterDetail = (filterId) => {
        if (isAnimating) return; // Блокируем быстрые клики во время анимации

        setIsAnimating(true);
        // 1. Устанавливаем ID для ХЕДЕРА (чтобы текст сменился сразу или плавно)
        setSelectedFilter(filterId);

        // 2. Устанавливаем ID для КОНТЕНТА
        setActiveDetailId(filterId);

        // 3. Запускаем анимацию
        animatePage(-SCREEN_WIDTH, () => {
            setViewLevel("detail");
            setIsAnimating(false);
        });
    };

    const goBack = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        animatePage(0, () => {
            setViewLevel("main");
            setSelectedFilter(null);
            setActiveDetailId(null); // Очищаем контент только в конце
            setIsAnimating(false);
        });
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    // Находим текущий фильтр для детальной страницы
    const currentFilterData = useMemo(() => {
        return filters.find((f) => f.id === selectedFilter);
    }, [filters, selectedFilter]);

    const headerOpacity = slideAnim.interpolate({
        inputRange: [-SCREEN_WIDTH, 0],
        outputRange: [1, 0], // Показываем заголовок детали, когда уехали влево
    });

    const mainTitleOpacity = slideAnim.interpolate({
        inputRange: [-SCREEN_WIDTH, 0],
        outputRange: [0, 1], // Показываем "Фильтры", когда мы в центре
    });

    return (
        <BottomSheet
            visible={isVisible}
            onClose={onClose}
            containerStyle={styles.bottomSheetCustom}
        >
            {/* Header */}
            <View style={styles.header}>
                {/* Заголовок основной страницы */}
                <Animated.View
                    style={{
                        alignItems: "center",
                        opacity: mainTitleOpacity,
                    }}
                >
                    <Text style={styles.title}>Фильтры</Text>
                </Animated.View>

                {/* Заголовок детальной страницы */}
                <Animated.View style={{ opacity: headerOpacity }}>
                    <TouchableOpacity
                        onPress={goBack}
                        style={styles.backBtn}
                        disabled={isAnimating} // Важно!
                    >
                        <ChevronLeft size={24} color="#7D8AFF" />
                        <Text
                            style={styles.headerTitleSecondary}
                            numberOfLines={1}
                        >
                            {currentFilterData?.label || ""}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Content Area */}
            <View style={styles.contentWrapper}>
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    {/* Первая страница */}
                    <View style={styles.pageContainer}>
                        <FilterMainPage
                            filters={filters}
                            localFilters={localFilters}
                            goToFilterDetail={goToFilterDetail}
                            handleClearAll={() => setLocalFilters({})}
                            handleApply={handleApply}
                            renderFilterValue={renderFilterValue}
                        />
                    </View>

                    {/* Вторая страница (Детали) */}
                    {activeDetailId && currentFilterData && (
                        <View
                            key={`page-${activeDetailId}`}
                            style={styles.pageContainer}
                        >
                            {currentFilterData?.type === "select" && (
                                <FilterSelectPage
                                    filter={currentFilterData}
                                    localFilters={localFilters}
                                    setLocalFilters={setLocalFilters}
                                    goBack={goBack}
                                />
                            )}
                            {currentFilterData?.type === "range" && (
                                <FilterRangePage
                                    filter={currentFilterData}
                                    localFilters={localFilters}
                                    setLocalFilters={setLocalFilters}
                                    getPresetsForFilter={getPresetsForFilter}
                                    goBack={goBack}
                                />
                            )}
                        </View>
                    )}
                </Animated.View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetCustom: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 0,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    header: {
        height: 60,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#fff",
    },
    headerTitleSecondary: {
        fontSize: 18,
        color: "#7D8AFF",
        fontWeight: "600",
        marginLeft: 4,
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        top: -30,
        left: -8, // Небольшая компенсация отступа иконки
    },
    contentWrapper: {
        overflow: "hidden",
        width: SCREEN_WIDTH,
        height: 530, // Ваша фиксированная высота
    },
    animatedContainer: {
        flexDirection: "row",
        width: SCREEN_WIDTH * 2,
        height: "100%", // Добавляем явное указание высоты
    },
    pageContainer: {
        width: SCREEN_WIDTH,
        height: "100%", // Добавляем явное указание высоты
    },
});
