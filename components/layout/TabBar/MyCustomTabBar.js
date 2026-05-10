import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabMenuItem } from "./TabMenuItem";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { TAB_ICONS } from "../../../constants/index";
import { CommonActions, StackActions } from "@react-navigation/native";

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const insets = useSafeAreaInsets();

    const BAR_HEIGHT = isCompactMenu ? 55 : 85;
    const TOTAL_BAR_HEIGHT =
        BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 10);
    const ICON_CONTAINER_SIZE = isCompactMenu ? 45 : 65;

    return (
        <View style={styles.wrapper}>
            <View
                style={[
                    styles.mainContainer,
                    { height: TOTAL_BAR_HEIGHT, paddingBottom: insets.bottom },
                ]}
            >
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const isFocused = state.index === index;

                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (event.defaultPrevented) return;

                        if (!isFocused) {
                            navigation.navigate(route.name);
                        } else {
                            if (route.name === "Коллекция") {
                                // Мы просто явно переходим на самый первый экран этого стека.
                                // React Navigation поймет, что экран "Дашборд" уже в стеке,
                                // и сделает возврат к нему автоматически.
                                navigation.navigate("Коллекция", {
                                    screen: "Дашборд",
                                });
                            }

                            if (route.name === "Поиск") {
                                // Отправляем параметр 'reset', который мы поймаем внутри SearchScreen
                                navigation.setParams({ reset: Date.now() });
                            }
                        }
                    };

                    return (
                        <TabMenuItem
                            key={route.key}
                            routeName={route.name}
                            isFocused={isFocused}
                            isCompactMenu={isCompactMenu}
                            iconSet={TAB_ICONS[route.name]}
                            ICON_CONTAINER_SIZE={ICON_CONTAINER_SIZE}
                            onPress={onPress} // Используем обновленный onPress
                        />
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
    mainContainer: {
        flexDirection: "row",
        backgroundColor: "#0B1534",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
});
