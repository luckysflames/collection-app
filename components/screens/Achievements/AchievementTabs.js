import React, { useRef, useEffect, useState, useCallback } from "react";
import {
    Animated,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    View,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function AchievementTabs({ tabs, activeTab, onTabPress, scrollX }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const scrollViewRef = useRef(null);
    const layoutsRef = useRef({});
    const [isMeasured, setIsMeasured] = useState(false);

    const scrollToTab = useCallback((index) => {
        const layout = layoutsRef.current[index];
        if (layout && scrollViewRef.current) {
            const scrollToX = layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
            scrollViewRef.current.scrollTo({
                x: Math.max(0, scrollToX),
                animated: true,
            });
        }
    }, []);

    useEffect(() => {
        const activeIndex = tabs.findIndex((t) => t.id === activeTab);
        if (activeIndex !== -1) {
            requestAnimationFrame(() => scrollToTab(activeIndex));
        }
    }, [activeTab, tabs, scrollToTab]);

    const handleLayout = (index, event) => {
        const { x, width } = event.nativeEvent.layout;
        layoutsRef.current[index] = { x, width };

        if (Object.keys(layoutsRef.current).length === tabs.length) {
            if (!isMeasured) setIsMeasured(true);
        }
    };

    const getInterpolationRanges = () => {
        const total = tabs.length;
        const measuredKeys = Object.keys(layoutsRef.current).map(Number);

        if (measuredKeys.length < total) {
            return {
                inputRange: [0, SCREEN_WIDTH],
                outputX: [0, 0],
                outputW: [0, 0],
            };
        }

        const inputRange = tabs.map((_, i) => i * SCREEN_WIDTH);
        const outputX = tabs.map((_, i) => layoutsRef.current[i]?.x || 0);
        const outputW = tabs.map((_, i) => layoutsRef.current[i]?.width || 0);

        return { inputRange, outputX, outputW };
    };

    const { inputRange, outputX, outputW } = getInterpolationRanges();

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: outputX,
        extrapolate: "clamp",
    });

    const indicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: outputW,
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.activeIndicator,
                        {
                            width: indicatorWidth,
                            transform: [{ translateX }],
                            opacity: isMeasured ? 1 : 0,
                        },
                    ]}
                />
                {tabs.map((tab, index) => {
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onLayout={(e) => handleLayout(index, e)}
                            onPress={() => onTabPress(tab.id, index)}
                            activeOpacity={0.7}
                            style={styles.tab}
                        >
                            <Text style={styles.tabText}>{tab.title}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            height: 50,
        },
        contentContainer: {
            paddingHorizontal: 20,
            alignItems: "center",
            flexDirection: "row",
        },
        activeIndicator: {
            position: "absolute",
            left: 0,
            height: 38,
            backgroundColor: theme.accent,
            borderRadius: 14,
        },
        tab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 14,
            marginRight: 8,
            borderWidth: 1,
            borderColor: theme.accent,
            justifyContent: "center",
            alignItems: "center",
        },
        tabText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "600",
            zIndex: 2,
        },
    });
