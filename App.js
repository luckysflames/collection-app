import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Stores & Components
import { useCollectionStore } from "./store/useCollectionStore";
import MyCustomTabBar from "./components/layout/TabBar/MyCustomTabBar";
import { SecurityAlertModal } from "./components/ui/SecurityAlertModal";
import { AchivementNotifier } from "./components/screens/Achievements/AchivementNotifier";

// Screens
import MainScreen from "./screens/MainScreen";
import SearchScreen from "./screens/SearchScreen";
import DetailsScreen from "./screens/DetailsScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import FolderDetailScreen from "./screens/FolderDetailScreen";
import CollectionDashboard from "./screens/CollectionDashboard";
import { StatusManagerScreen } from "./screens/StatusManagerScreen";
import { DataManagementScreen } from "./screens/DataManagementScreen";
import EditCardScreen from "./screens/EditCardScreen";
import AchievementsScreen from "./screens/AchievementsScreen";

const Tab = createBottomTabNavigator();

// Создаем изолированные стеки для каждой вкладки
const SearchStack = createStackNavigator();
const CreateStack = createStackNavigator();
const CollectionStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const THEME_COLOR = "#050B18";

const AppTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: THEME_COLOR },
};

const DEFAULT_STACK_OPTIONS = {
    headerShown: false,
    cardStyle: { backgroundColor: THEME_COLOR },
    animationEnabled: true,
};

// --- СТЕК ВКЛАДКИ: ПОИСК ---
function SearchStackScreen() {
    return (
        <SearchStack.Navigator screenOptions={DEFAULT_STACK_OPTIONS}>
            <SearchStack.Screen name="SearchMain" component={SearchScreen} />
            <SearchStack.Screen name="Details" component={DetailsScreen} />
            <SearchStack.Screen name="FolderDetail" component={FolderDetailScreen} />
            <SearchStack.Screen
                name="EditCard"
                component={EditCardScreen}
                options={{
                    animationEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                }}
            />
        </SearchStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: СОЗДАТЬ ---
function CreateStackScreen() {
    return (
        <CreateStack.Navigator screenOptions={DEFAULT_STACK_OPTIONS}>
            <CreateStack.Screen name="CreateMain" component={AddCardScreen} />
        </CreateStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: КОЛЛЕКЦИЯ ---
function CollectionStackScreen() {
    return (
        <CollectionStack.Navigator screenOptions={DEFAULT_STACK_OPTIONS}>
            <CollectionStack.Screen name="Дашборд" component={CollectionDashboard} />
            <CollectionStack.Screen name="MainScreen" component={MainScreen} />
            <CollectionStack.Screen name="Details" component={DetailsScreen} />
            <CollectionStack.Screen name="FolderDetail" component={FolderDetailScreen} />
            <CollectionStack.Screen
                name="EditCard"
                component={EditCardScreen}
                options={{
                    animationEnabled: true,
                    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                }}
            />
            <CollectionStack.Screen name="Achievements" component={AchievementsScreen} />
        </CollectionStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: НАСТРОЙКИ ---
function SettingsStackScreen() {
    return (
        <SettingsStack.Navigator screenOptions={DEFAULT_STACK_OPTIONS}>
            <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
            <SettingsStack.Screen name="StatusManager" component={StatusManagerScreen} />
            <SettingsStack.Screen name="DataManagement" component={DataManagementScreen} />
        </SettingsStack.Navigator>
    );
}

// --- Основной компонент App ---
export default function App() {
    const navigationRef = useRef(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    const { _hasHydrated, deletionPassword } = useCollectionStore();

    useEffect(() => {
        if (_hasHydrated && !deletionPassword) {
            const timer = setTimeout(() => setShowSecurityModal(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [_hasHydrated, deletionPassword]);

    // Важно: Теперь роут DataManagement находится внутри стека Настроек
    const handleGoToSettings = () => {
        setShowSecurityModal(false);
        navigationRef.current?.navigate("Настройки", {
            screen: "DataManagement",
            initial: false,
        });
    };

    if (!_hasHydrated) {
        return (
            <SafeAreaProvider style={{ backgroundColor: THEME_COLOR }}>
                <StatusBar style="light" />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: THEME_COLOR }} edges={["top"]}>
                <NavigationContainer theme={AppTheme} ref={navigationRef}>
                    <StatusBar style="light" />

                    {/* Табы теперь являются КОРНЕМ всей навигации приложения */}
                    <Tab.Navigator
                        tabBar={(props) => <MyCustomTabBar {...props} />}
                        screenOptions={{ headerShown: false, animation: "fade" }}
                        initialRouteName="Коллекция"
                    >
                        <Tab.Screen name="Поиск" component={SearchStackScreen} />
                        <Tab.Screen name="Создать" component={CreateStackScreen} />
                        <Tab.Screen name="Коллекция" component={CollectionStackScreen} />
                        <Tab.Screen name="Настройки" component={SettingsStackScreen} />
                    </Tab.Navigator>

                    {/* Глобальные оверлеи остаются поверх табов */}
                    <AchivementNotifier />

                    <SecurityAlertModal
                        visible={showSecurityModal}
                        onCancel={() => setShowSecurityModal(false)}
                        onGoToSettings={handleGoToSettings}
                    />
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
