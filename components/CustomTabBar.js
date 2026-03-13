import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Animated,
    Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_ICONS = {
    Поиск: {
        active: require("../assets/icons/search(active).png"),
        inactive: require("../assets/icons/search(inactive).png"),
    },
    Создать: {
        active: require("../assets/icons/add(active).png"),
        inactive: require("../assets/icons/add(inactive).png"),
    },
    Настройки: {
        active: require("../assets/icons/settings(active).png"),
        inactive: require("../assets/icons/settings(inactive).png"),
    },
    Коллекция: {
        active: require("../assets/icons/collection(active).png"),
        inactive: require("../assets/icons/collection(inactive).png"),
    },
};

// Категории для выезжающего меню
const SUB_CATEGORIES = [
    {
        id: "Игры",
        active: require("../assets/icons/game(active).png"),
        inactive: require("../assets/icons/game(inactive).png"),
    },
    {
        id: "Фильмы",
        active: require("../assets/icons/movie(active).png"),
        inactive: require("../assets/icons/movie(inactive).png"),
    },
    {
        id: "Аниме",
        active: require("../assets/icons/anime(active).png"),
        inactive: require("../assets/icons/anime(inactive).png"),
    },
    {
        id: "Книги",
        active: require("../assets/icons/book(active).png"),
        inactive: require("../assets/icons/book(inactive).png"),
    },
];

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuAnimation = useRef(new Animated.Value(0)).current;

    const currentRouteName = state.routes[state.index].name;
    const isActuallyOnCollection = currentRouteName === "Коллекция";

    const collectionRoute = state.routes.find((r) => r.name === "Коллекция");
    const currentActiveSection = collectionRoute?.params?.appSection;

    const insets = useSafeAreaInsets();

    const toggleMenu = () => {
        const toValue = isMenuOpen ? 0 : 1;
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSubCategoryPress = (categoryName) => {
        toggleMenu();
        // Переходим на MainScreen и передаем нужную категорию
        navigation.navigate("Коллекция", { appSection: categoryName });
    };

    return (
        <View style={styles.wrapper}>
            {/* Затемнение фона при открытом меню */}
            {isMenuOpen && (
                <Pressable style={styles.overlay} onPress={toggleMenu} />
            )}

            {/* Вертикальное выезжающее меню */}
            <Animated.View
                style={[
                    styles.verticalMenu,
                    {
                        transform: [
                            {
                                translateX: menuAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [200, 0], // Уезжает вправо за экран
                                }),
                            },
                        ],
                        opacity: menuAnimation,
                        marginBottom: insets.bottom,
                    },
                ]}
            >
                {SUB_CATEGORIES.map((cat) => {
                    const isSubFocused =
                        isActuallyOnCollection &&
                        currentActiveSection === cat.id;

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
                                source={
                                    isSubFocused ? cat.active : cat.inactive
                                }
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
                                    {
                                        color: isSubFocused
                                            ? "#7D8AFF"
                                            : "#FFF",
                                    },
                                ]}
                            >
                                {cat.id}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </Animated.View>

            {/* Основной горизонтальный таб-бар */}
            <View
                style={[
                    styles.mainContainer,
                    {
                        paddingBottom: insets.bottom > 0 ? insets.bottom : 0,
                        height: 80 + (insets.bottom > 0 ? insets.bottom : 0),
                    },
                ]}
            >
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const iconSet = TAB_ICONS[route.name];

                    // Логика выделения для Коллекции
                    let containerStyle = [styles.iconContainer];
                    let textIconColor = "#8E94A4";

                    if (route.name === "Коллекция") {
                        if (isFocused) {
                            // Мы реально на экране коллекции - полный закрас
                            containerStyle.push(styles.activeIconContainer);
                            textIconColor = "#FFF";
                        } else if (isMenuOpen) {
                            // Меню открыто, но мы на другом экране - только ОБВОДКА
                            containerStyle.push(styles.borderIconContainer);
                            textIconColor = "#7D8AFF";
                        }
                    } else if (isFocused) {
                        // Обычный активный таб
                        containerStyle.push(styles.activeIconContainer);
                        textIconColor = "#FFF";
                    }

                    const onPress = () => {
                        if (route.name === "Коллекция") {
                            toggleMenu(); // Вместо перехода открываем меню
                        } else {
                            if (isMenuOpen) toggleMenu();
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.tabItem}
                        >
                            <View style={containerStyle}>
                                <Image
                                    source={
                                        isFocused ||
                                        (route.name === "Коллекция" &&
                                            isMenuOpen)
                                            ? iconSet.active
                                            : iconSet.inactive
                                    }
                                    style={[
                                        styles.iconStyle,
                                        { tintColor: textIconColor },
                                    ]}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        { color: textIconColor },
                                    ]}
                                >
                                    {route.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        height: 2000,
        top: -2000,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    verticalMenu: {
        position: "absolute",
        bottom: 100,
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
        backgroundColor: "rgba(125, 138, 255, 0.1)", // Очень слабый синий фон для ряда
    },

    mainContainer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        backgroundColor: "#0B1534",
        height: 85,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: "100%",
    },
    tabItem: {
        flex: 1,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginHorizontal: 5,
    },
    activeTabItem: {
        backgroundColor: "#7D8AFF", // Фон только у активного таба
    },

    iconContainer: {
        width: 65,
        height: 65,
        borderRadius: 20, // Скругленный квадрат
        justifyContent: "center",
        alignItems: "center",
    },
    activeIconContainer: {
        backgroundColor: "#7D8AFF",
        borderRadius: 20, // Скругленный квадрат
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
    iconStyle: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    tabText: {
        fontSize: 10,
        fontWeight: "600",
        marginTop: 5,
    },
});
