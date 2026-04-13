import React from "react";
import {
    Animated,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
} from "react-native";

export const VerticalSubMenu = ({
    menuAnimation,
    SUB_CATEGORIES,
    currentActiveSection,
    isActuallyOnCollection,
    handleSubCategoryPress,
    bottomOffset,
}) => {
    return (
        <Animated.View
            style={[
                styles.verticalMenu,
                {
                    bottom: bottomOffset,
                    transform: [
                        {
                            translateX: menuAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [200, 0],
                            }),
                        },
                    ],
                    opacity: menuAnimation,
                },
            ]}
        >
            {SUB_CATEGORIES.map((cat) => {
                const isSubFocused =
                    isActuallyOnCollection && currentActiveSection === cat.id;

                return (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.verticalItem,
                            isSubFocused && styles.activeVerticalItem,
                        ]}
                        onPress={() => handleSubCategoryPress(cat.id)}
                    >
                        <Image
                            source={isSubFocused ? cat.active : cat.inactive}
                            style={[
                                styles.subIcon,
                                {
                                    tintColor: isSubFocused
                                        ? "#7D8AFF"
                                        : "#8E94A4",
                                },
                            ]}
                        />
                        <Text
                            style={[
                                styles.subText,
                                { color: isSubFocused ? "#7D8AFF" : "#FFF" },
                            ]}
                        >
                            {cat.id}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    verticalMenu: {
        position: "absolute",
        right: -5,
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        padding: 15,
        width: 150,
        gap: 15,
        zIndex: 99,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    verticalItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    activeVerticalItem: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
    },
    subIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    subText: {
        fontSize: 16,
        fontWeight: "500",
    },
});
