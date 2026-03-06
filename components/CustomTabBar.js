import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
} from "react-native";
// Ionicons оставляем только если поиск все еще берем оттуда, либо заменяем тоже
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// 1. Создаем карту иконок (импорты должны быть статическими в RN)
const TAB_ICONS = {
    Игры: {
        active: require("../assets/icons/game(active).png"),
        inactive: require("../assets/icons/game(inactive).png"),
    },
    Фильмы: {
        active: require("../assets/icons/movie(active).png"),
        inactive: require("../assets/icons/movie(inactive).png"),
    },
    Аниме: {
        active: require("../assets/icons/anime(active).png"),
        inactive: require("../assets/icons/anime(inactive).png"),
    },
    Книги: {
        active: require("../assets/icons/book(active).png"),
        inactive: require("../assets/icons/book(inactive).png"),
    },
    Поиск: {
        active: require("../assets/icons/search(active).png"),
        inactive: require("../assets/icons/search(inactive).png"),
    },
};

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.mainContainer}>
            {state.routes.map((route, index) => {
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                // Центральная кнопка Поиска
                if (route.name === "Поиск") {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={[
                                styles.searchButtonWrapper,
                                isFocused && { backgroundColor: "#7D8AFF" },
                            ]}
                            activeOpacity={0.8}
                        >
                            <View style={styles.searchInner}>
                                {/* Используем кастомную иконку для поиска или оставляем Ionicons */}
                                <Image
                                    source={
                                        isFocused
                                            ? TAB_ICONS["Поиск"].active
                                            : TAB_ICONS["Поиск"].inactive
                                    }
                                    style={{
                                        width: 30,
                                        height: 30,
                                        tintColor: "#FFF",
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={index}
                        onPress={onPress}
                        style={[
                            styles.tabItem,
                            isFocused && styles.activeTabItem,
                        ]}
                    >
                        {/* 2. Рендерим нашу картинку вместо Ionicons */}
                        <Image
                            source={
                                isFocused
                                    ? TAB_ICONS[route.name].active
                                    : TAB_ICONS[route.name].inactive
                            }
                            style={[
                                styles.iconStyle,
                                // Если иконки одноцветные (черно-белые), можно красить их через tintColor
                                { tintColor: isFocused ? "#FFF" : "#8E94A4" },
                            ]}
                        />
                        <Text
                            style={{
                                color: isFocused ? "#FFF" : "#8E94A4",
                                fontSize: 10,
                                marginTop: 4,
                                fontWeight: "600",
                            }}
                        >
                            {route.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
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
    iconStyle: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    searchButtonWrapper: {
        top: -40, // Выносим кнопку за пределы бара
        width: 75,
        height: 75,
        borderRadius: 35,
        backgroundColor: "#0B1534", // В цвет бара
        borderWidth: 5,
        borderColor: "#050B18", // В цвет общего фона приложения (создает эффект "выреза")
        justifyContent: "center",
        alignItems: "center",
    },
    searchInner: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});
