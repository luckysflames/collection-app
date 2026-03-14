import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";

export const TabMenuItem = ({
    onPress,
    isFocused,
    isMenuOpen,
    isCompactMenu,
    routeName,
    iconSet,
    ICON_CONTAINER_SIZE,
}) => {
    // 1. Возвращаем твою оригинальную логику определения цветов и стилей
    let containerStyle = [styles.iconContainer];
    let textIconColor = "#8E94A4";

    if (routeName === "Коллекция") {
        if (isFocused) {
            containerStyle.push(styles.activeIconContainer);
            textIconColor = "#FFF";
        } else if (isMenuOpen) {
            // ТО САМОЕ промежуточное состояние (обводка или спец-вид)
            // Если ты убрал borderIconContainer, давай просто подсветим её цветом,
            // но оставим прозрачный фон или сделаем полупрозрачный
            containerStyle.push(styles.borderIconContainer);
            textIconColor = "#7D8AFF";
        }
    } else if (isFocused) {
        containerStyle.push(styles.activeIconContainer);
        textIconColor = "#FFF";
    }

    const isActive = isFocused || (routeName === "Коллекция" && isMenuOpen);

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
                    source={isActive ? iconSet.active : iconSet.inactive}
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
    borderIconContainer: {
        backgroundColor: "rgba(125, 138, 255, 0.2)",
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
