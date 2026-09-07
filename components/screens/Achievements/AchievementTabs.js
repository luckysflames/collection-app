import React, { useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function AchievementTabs({ tabs, activeTab, onTabPress }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const scrollViewRef = useRef(null);
    const itemLayouts = useRef({}).current;

    useEffect(() => {
        const layout = itemLayouts[activeTab];
        if (layout) {
            const scrollToX = layout.x - SCREEN_WIDTH / 2 + layout.width / 2;
            scrollViewRef.current?.scrollTo({
                x: Math.max(0, scrollToX),
                animated: true,
            });
        }
    }, [activeTab]);

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        activeOpacity={0.7}
                        onLayout={(e) => {
                            itemLayouts[tab.id] = e.nativeEvent.layout;
                        }}
                        onPress={() => onTabPress(tab.id)}
                        style={[styles.tab, isActive && styles.activeTab]}
                    >
                        <Text style={styles.tabText}>{tab.title}</Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            alignItems: "center",
            flexDirection: "row",
        },
        tab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 14,
            marginRight: 8,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        activeTab: {
            backgroundColor: theme.accent,
        },
        tabText: {
            color: theme.text,
            fontSize: 14,
            fontWeight: "600",
        },
    });
