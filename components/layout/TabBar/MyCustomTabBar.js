import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabMenuItem } from "./TabMenuItem";
import { useCollectionStore } from "../../../store/useCollectionStore";
import { TAB_ICONS } from "../../../constants/index";
import { CommonActions, StackActions } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const insets = useSafeAreaInsets();

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const BAR_HEIGHT = isCompactMenu ? 55 : 85;
    const TOTAL_BAR_HEIGHT = BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 10);
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
                                navigation.navigate("Коллекция", {
                                    screen: "Дашборд",
                                });
                            }

                            if (route.name === "Поиск") {
                                // Явно направляем навигацию на корень стека Поиска и передаем параметр
                                navigation.navigate("Поиск", {
                                    screen: "SearchMain", // Имя экрана из SearchStack.Screen в App.js
                                    params: { reset: Date.now() }, // Передаем таймстамп для гарантированного триггера useEffect
                                });
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
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        wrapper: {
            position: "absolute",
            right: 20,
            left: 20,
            bottom: 20,
            alignItems: "center",
        },
        mainContainer: {
            flexDirection: "row",
            backgroundColor: theme.main,
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 35,
            width: "100%",
            boxShadow: `0px 0px 24px ${theme.dark}`,
        },
    });
