import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { BottomSheet } from "../../../../ui/BottomSheet";
import { FILTER_CONFIG } from "../../../../../constants/index";
import { useCollectionStore } from "../../../../../store/useCollectionStore";

import { FilterMainPage } from "./FilterMainPage";
import { FilterSelectPage } from "./FilterSelectPage";
import { FilterRangePage } from "./FilterRangePage";

import { renderFilterValue, getPresetsForFilter, generateDynamicFilters } from "./helpers";
import { useTheme } from "../../../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const FilterModal = ({
    isVisible,
    onClose,
    currentSection,
    activeFilters = {},
    onApplyFilters,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const myCollection = useCollectionStore((state) => state.myCollection);

    const [localFilters, setLocalFilters] = useState({});
    const [viewLevel, setViewLevel] = useState("main"); // 'main' | 'detail'
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [activeDetailId, setActiveDetailId] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const slideAnim = useRef(new Animated.Value(0)).current;

    const filters = useMemo(() => {
        const staticFilters = FILTER_CONFIG[currentSection] || [];
        const dynamicFilters = generateDynamicFilters(myCollection, currentSection);
        return [...staticFilters, ...dynamicFilters];
    }, [currentSection, myCollection]);

    useEffect(() => {
        if (isVisible) {
            setViewLevel("main");
            setLocalFilters(activeFilters);
            slideAnim.setValue(0);
        }
    }, [isVisible, activeFilters]);

    const animatePage = (toValue, callback) => {
        Animated.spring(slideAnim, {
            toValue,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
        }).start(callback);
    };

    const goToFilterDetail = (filterId) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setSelectedFilter(filterId);
        setActiveDetailId(filterId);

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
            setActiveDetailId(null);
            setIsAnimating(false);
        });
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const currentFilterData = useMemo(() => {
        return filters.find((f) => f.id === selectedFilter);
    }, [filters, selectedFilter]);

    const headerOpacity = slideAnim.interpolate({
        inputRange: [-SCREEN_WIDTH, 0],
        outputRange: [1, 0],
    });

    const mainTitleOpacity = slideAnim.interpolate({
        inputRange: [-SCREEN_WIDTH, 0],
        outputRange: [0, 1],
    });

    return (
        <BottomSheet
            visible={isVisible}
            onClose={onClose}
            containerStyle={styles.bottomSheetCustom}
        >
            <View style={styles.header}>
                <Animated.View
                    style={[styles.titleContainer, { opacity: mainTitleOpacity }]}
                    pointerEvents={viewLevel === "main" ? "auto" : "none"}
                >
                    <Text style={styles.title}>Фильтры</Text>
                </Animated.View>

                <Animated.View
                    style={[styles.detailHeaderContainer, { opacity: headerOpacity }]}
                    pointerEvents={viewLevel === "detail" ? "auto" : "none"}
                >
                    <TouchableOpacity
                        onPress={goBack}
                        style={styles.roundBackButton}
                        disabled={isAnimating}
                        activeOpacity={0.7}
                    >
                        <ChevronLeft size={24} color={theme.text} />
                    </TouchableOpacity>

                    <Text style={styles.headerTitleSecondary} numberOfLines={1}>
                        {currentFilterData?.label || ""}
                    </Text>
                </Animated.View>
            </View>

            <View style={styles.contentWrapper}>
                <Animated.View
                    style={[styles.animatedContainer, { transform: [{ translateX: slideAnim }] }]}
                >
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

                    {activeDetailId && currentFilterData && (
                        <View key={`page-${activeDetailId}`} style={styles.pageContainer}>
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        bottomSheetCustom: {
            backgroundColor: theme.main,
            paddingHorizontal: 0,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
        },
        header: {
            height: 60,
            justifyContent: "center",
            paddingHorizontal: 20,
            position: "relative",
        },
        titleContainer: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
        },
        title: {
            fontSize: 20,
            fontWeight: "700",
            color: theme.text,
        },
        detailHeaderContainer: {
            ...StyleSheet.absoluteFillObject,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
        },
        roundBackButton: {
            position: "absolute",
            left: 16,
            zIndex: 10,
            backgroundColor: theme.main,
            width: 42,
            height: 42,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: theme.accentMuted,
        },
        headerTitleSecondary: {
            fontSize: 18,
            color: theme.text,
            fontWeight: "700",
            textAlign: "center",
            maxWidth: "60%",
        },
        contentWrapper: {
            overflow: "hidden",
            width: SCREEN_WIDTH,
            height: 530,
        },
        animatedContainer: {
            flexDirection: "row",
            width: SCREEN_WIDTH * 2,
            height: "100%",
        },
        pageContainer: {
            width: SCREEN_WIDTH,
            height: "100%",
        },
    });
