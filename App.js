import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import MainScreen from "./screens/MainScreen";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomTabBar from "./components/CustomTabBar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#050B18", // Цвет фона, который будет виден при переходах
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#050B18' }} edges={['top']}>
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
                        <Stack.Screen name="Home" component={HomeTabs} />
                        <Stack.Screen
                            name="Details"
                            component={DetailsScreen}
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
