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
import { DiamondRain } from "./components/ui/Effects/DiamondRain";
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
const Stack = createStackNavigator();
const CollectionStack = createStackNavigator();

const THEME_COLOR = "#050B18";

const AppTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: THEME_COLOR },
};

const DEFAULT_STACK_OPTIONS = {
    headerShown: false,
    cardStyle: { backgroundColor: THEME_COLOR },
    animationEnabled: true,
    gestureEnabled: false,
    animation: "slide_from_right",
};

// --- Вспомогательные навигаторы ---

function CollectionStackScreen() {
    return (
        <CollectionStack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <CollectionStack.Screen name="Дашборд" component={CollectionDashboard} />
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

// --- Основной компонент App ---

export default function App() {
    const navigationRef = useRef(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // Состояние из стора
    const { 
        _hasHydrated, 
        deletionPassword, 
        activeRainScreens, 
        isDiamondRainEnabled 
    } = useCollectionStore();

    // Логика эффектов
    const isRainActive = isDiamondRainEnabled && activeRainScreens.length > 0;

    useEffect(() => {
        if (_hasHydrated && !deletionPassword) {
            const timer = setTimeout(() => setShowSecurityModal(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [_hasHydrated, deletionPassword]);

    const handleGoToSettings = () => {
        setShowSecurityModal(false);
        navigationRef.current?.navigate("DataManagement");
    };

    // Экран загрузки (Гидратация)
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
                    
                    <Stack.Navigator screenOptions={DEFAULT_STACK_OPTIONS}>
                        <Stack.Screen name="Home" component={HomeTabs} />
                        
                        {/* Вспомогательные экраны */}
                        <Stack.Screen name="Details" component={DetailsScreen} />
                        <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
                        <Stack.Screen name="Achievements" component={AchievementsScreen} />
                        
                        {/* Модальные или специальные переходы */}
                        <Stack.Screen 
                            name="EditCard" 
                            component={EditCardScreen} 
                            options={{ animation: "fade" }} 
                        />
                        <Stack.Screen 
                            name="StatusManager" 
                            component={StatusManagerScreen} 
                            options={{ gestureEnabled: true }} 
                        />
                        <Stack.Screen 
                            name="DataManagement" 
                            component={DataManagementScreen} 
                            options={{ gestureEnabled: true }} 
                        />
                        
                        {/* Дублирующие навигацию экраны (если нужны вне табов) */}
                        <Stack.Screen name="AddCard" component={AddCardScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                    </Stack.Navigator>

                    {/* Глобальные оверлеи */}
                    <DiamondRain isActive={isRainActive} />
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