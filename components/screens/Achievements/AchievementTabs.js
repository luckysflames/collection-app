import React, { useRef, useEffect } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function AchievementTabs({ tabs, activeTab, onTabPress }) {
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
                        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                            {tab.title}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        marginRight: 8,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.03)",
    },
    activeTab: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    tabText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 14,
        fontWeight: "600",
    },
    activeTabText: {
        color: "#ffffff",
        fontWeight: "700",
    },
});
