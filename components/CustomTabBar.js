import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.mainContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                // Определяем иконку (можно вынести в отдельный объект)
                const getIcon = (name, color) => {
                    const icons = {
                        Игры: "game-controller",
                        Фильмы: "film",
                        Аниме: "star",
                        Книги: "book",
                        Поиск: "search",
                    };
                    return (
                        <Ionicons
                            name={
                                isFocused
                                    ? icons[name]
                                    : `${icons[name]}-outline`
                            }
                            size={22}
                            color={color}
                        />
                    );
                };

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

                // Специальная отрисовка для центральной кнопки Поиска
                if (route.name === "Поиск") {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.searchButtonWrapper}
                            activeOpacity={0.8}
                        >
                            <View style={styles.searchInner}>
                                <Ionicons
                                    name="search"
                                    size={28}
                                    color="#FFF"
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
                        {getIcon(route.name, isFocused ? "#FFF" : "#8E94A4")}
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
        height: 65,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        marginHorizontal: 5,
    },
    activeTabItem: {
        backgroundColor: "#7D8AFF", // Фон только у активного таба
    },
    searchButtonWrapper: {
        top: -40, // Выносим кнопку за пределы бара
        width: 75,
        height: 75,
        borderRadius: "50%",
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
