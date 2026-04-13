import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export const TabMenuItem = ({
    onPress,
    isFocused,
    isCompactMenu,
    routeName,
    iconSet,
    ICON_CONTAINER_SIZE,
}) => {
    let containerStyle = [styles.iconContainer];
    let textIconColor = isFocused ? "#FFF" : "#8E94A4";

    if (isFocused) {
        containerStyle.push(styles.activeIconContainer);
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
        >
            <View
                style={[
                    ...containerStyle,
                    {
                        width: ICON_CONTAINER_SIZE,
                        height: ICON_CONTAINER_SIZE,
                        borderRadius: isCompactMenu ? 15 : 20,
                    },
                ]}
            >
                <Image
                    source={isFocused ? iconSet.active : iconSet.inactive}
                    style={[
                        styles.iconStyle,
                        {
                            tintColor: textIconColor,
                            width: isCompactMenu ? 22 : 24,
                            height: isCompactMenu ? 22 : 24,
                        },
                    ]}
                />
                {!isCompactMenu && (
                    <Text style={[styles.tabText, { color: textIconColor }]}>
                        {routeName}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    activeIconContainer: {
        backgroundColor: "#7D8AFF",
    },
    iconStyle: {
        resizeMode: "contain",
    },
    tabText: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 5,
    },
});
