import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons"; // Иконки уже есть в Expo

// Импортируем наш экран (создадим его позже или вставь код из прошлого шага)
import MainScreen from "./screens/MainScreen";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomTabBar from "./components/CustomTabBar";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#050B18", // Цвет фона, который будет виден при переходах
        card: "#0B1534", // Цвет заголовка (header)
        text: "#ffffff", // Цвет текста в заголовке
    },
};

function HomeTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Поиск" component={SearchScreen} />
            <Tab.Screen name="Создать" component={AddCardScreen} />
            <Tab.Screen name="Настройки" component={SettingsScreen} />
            <Tab.Screen
                name="Коллекция"
                component={MainScreen}
                initialParams={{ appSection: "Фильмы" }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer theme={MyTheme}>
                <StatusBar />
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        cardStyle: { backgroundColor: "#050B18" },
                        animationEnabled: true,
                        gestureEnabled: true,
                        gestureDirection: "horizontal",
                        animation: "slide_from_right",
                        detachPreviousScreen: false,
                    }}
                >
                    {/* Сначала загружаем Табы */}
                    <Stack.Screen name="Home" component={HomeTabs} />

                    {/* Экран деталей будет открываться ПОВЕРХ таб-бара */}
                    <Stack.Screen name="Details" component={DetailsScreen} />

                    <Stack.Screen name="AddCard" component={AddCardScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "#0B1534",
        borderTopWidth: 0,
        height: 85,
        paddingBottom: 10,
        position: "absolute",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        elevation: 0, // Убираем тень на Android, чтобы не мешала скруглению
    },
    // Стиль для обычного элемента таба
    tabItem: {
        marginHorizontal: 5,
        marginVertical: 10,
        borderRadius: 18, // Скругление подложки как на фото
    },
    // Кастомизация активного состояния через Navigator
    // (в screenOptions мы настроили цвета, а здесь позиционирование)

    searchIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#0B1534",
        borderWidth: 3,
        borderColor: "#FFFFFF", // Та самая белая обводка
        justifyContent: "center",
        alignItems: "center",
        // Сдвигаем вверх сильнее, чтобы он "выпрыгивал" из таббара
        marginTop: -35,
    },
});
