import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Stores, Hooks & Components
import { useCollectionStore } from "./store/useCollectionStore";
import { useTheme } from "./hooks/useTheme"; // 1. Импортируем useTheme
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

const SearchStack = createStackNavigator();
const CreateStack = createStackNavigator();
const CollectionStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const FALLBACK_MAIN_COLOR = "#050B18";

// --- СТЕК ВКЛАДКИ: ПОИСК ---
function SearchStackScreen({ screenOptions }) {
    return (
        <SearchStack.Navigator screenOptions={screenOptions}>
            <SearchStack.Screen name="SearchMain" component={SearchScreen} />
            <SearchStack.Screen name="Details" component={DetailsScreen} />
        </SearchStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: СОЗДАТЬ ---
function CreateStackScreen({ screenOptions }) {
    return (
        <CreateStack.Navigator screenOptions={screenOptions}>
            <CreateStack.Screen name="CreateMain" component={AddCardScreen} />
        </CreateStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: КОЛЛЕКЦИЯ ---
function CollectionStackScreen({ screenOptions }) {
    return (
        <CollectionStack.Navigator screenOptions={screenOptions}>
            <CollectionStack.Screen name="Дашборд" component={CollectionDashboard} />
            <CollectionStack.Screen name="MainScreen" component={MainScreen} />
            <CollectionStack.Screen name="Details" component={DetailsScreen} />
            <CollectionStack.Screen name="FolderDetail" component={FolderDetailScreen} />
            <CollectionStack.Screen
                name="EditCard"
                component={EditCardScreen}
                options={{
                    animation: "fade",
                }}
            />
            <CollectionStack.Screen name="Achievements" component={AchievementsScreen} />
        </CollectionStack.Navigator>
    );
}

// --- СТЕК ВКЛАДКИ: НАСТРОЙКИ ---
function SettingsStackScreen({ screenOptions }) {
    return (
        <SettingsStack.Navigator screenOptions={screenOptions}>
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

    const _hasHydrated = useCollectionStore((state) => state._hasHydrated);
    const deletionPassword = useCollectionStore((state) => state.deletionPassword);

    // 2. Получаем текущие динамические цвета темы
    const { theme } = useTheme();
    const currentMainColor = theme?.dark || FALLBACK_MAIN_COLOR;
    const currentAccentColor = theme?.accent || "#7D8AFF";

    // 3. Собираем объект темы NavigationContainer с учетом вычисляемых цветов
    const AppTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: currentMainColor,
            card: currentMainColor,
            primary: currentAccentColor,
            text: theme?.text || "#FFFFFF",
            border: currentAccentColor,
        },
    };

    // 4. Генерируем опции для стеков с динамическим фоном
    const defaultStackOptions = {
        headerShown: false,
        cardStyle: { backgroundColor: currentMainColor },
        animationEnabled: true,
    };

    useEffect(() => {
        if (_hasHydrated && !deletionPassword) {
            const timer = setTimeout(() => setShowSecurityModal(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [_hasHydrated, deletionPassword]);

    const handleGoToSettings = () => {
        setShowSecurityModal(false);
        navigationRef.current?.navigate("Настройки", {
            screen: "DataManagement",
            initial: false,
        });
    };

    if (!_hasHydrated) {
        return (
            <SafeAreaProvider style={{ backgroundColor: currentMainColor }}>
                <StatusBar style="light" />
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={{ backgroundColor: currentMainColor }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: currentMainColor }} edges={["top"]}>
                <NavigationContainer theme={AppTheme} ref={navigationRef}>
                    <StatusBar style="light" />

                    <Tab.Navigator
                        tabBar={(props) => <MyCustomTabBar {...props} />}
                        screenOptions={{ headerShown: false, animation: "fade" }}
                        initialRouteName="Коллекция"
                    >
                        <Tab.Screen name="Коллекция">
                            {() => <CollectionStackScreen screenOptions={defaultStackOptions} />}
                        </Tab.Screen>
                        <Tab.Screen name="Поиск">
                            {() => <SearchStackScreen screenOptions={defaultStackOptions} />}
                        </Tab.Screen>
                        <Tab.Screen name="Создать">
                            {() => <CreateStackScreen screenOptions={defaultStackOptions} />}
                        </Tab.Screen>
                        <Tab.Screen name="Настройки">
                            {() => <SettingsStackScreen screenOptions={defaultStackOptions} />}
                        </Tab.Screen>
                    </Tab.Navigator>

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
