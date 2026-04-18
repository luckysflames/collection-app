import React from "react";
import {
    CommonActions,
    DefaultTheme,
    getFocusedRouteNameFromRoute,
    NavigationContainer,
    StackActions,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    CardStyleInterpolators,
    createStackNavigator,
} from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainScreen from "./screens/MainScreen";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FolderDetailScreen from "./screens/FolderDetailScreen";
import MyCustomTabBar from "./components/layout/TabBar/MyCustomTabBar";
import CollectionDashboard from "./screens/CollectionDashboard";
import { StatusManagerScreen } from "./screens/StatusManagerScreen";
import { useCollectionStore } from "./store/useCollectionStore";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const CollectionStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#050B18", // Цвет фона, который будет виден при переходах
    },
};

function CollectionStackScreen() {
    // Подписываемся на версию из стора
    const version = useCollectionStore((state) => state.version);

    return (
        <CollectionStack.Navigator
            // Как только версия изменится, стек пересоберется с нуля
            key={`collection-stack-v${version}`}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <CollectionStack.Screen
                name="Дашборд"
                component={CollectionDashboard}
            />
            <CollectionStack.Screen name="MainScreen" component={MainScreen} />
        </CollectionStack.Navigator>
    );
}

function HomeTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <MyCustomTabBar {...props} />}
            screenOptions={{ headerShown: false, animation: "fade" }}
        >
            <Tab.Screen name="Поиск" component={SearchScreen} />

            <Tab.Screen name="Создать" component={AddCardScreen} />

            <Tab.Screen name="Коллекция" component={CollectionStackScreen} />

            <Tab.Screen name="Настройки" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: "#050B18" }}
                edges={["top"]}
            >
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
                            // detachPreviousScreen: false,
                        }}
                    >
                        <Stack.Screen name="Home" component={HomeTabs} />
                        <Stack.Screen
                            name="Details"
                            component={DetailsScreen}
                        />
                        <Stack.Screen
                            name="StatusManager"
                            component={StatusManagerScreen}
                            options={{
                                gestureEnabled: true, // Позволяем свайп назад
                            }}
                        />
                        <Stack.Screen
                            name="FolderDetail"
                            component={FolderDetailScreen}
                        />
                        <Stack.Screen
                            name="AddCard"
                            component={AddCardScreen}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={SettingsScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
