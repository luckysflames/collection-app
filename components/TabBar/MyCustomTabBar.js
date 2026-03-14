import { useRef, useState } from "react";
import { TabMenuItem } from "./TabMenuItem";
import { VerticalSubMenu } from "./VerticalSubMenu";
import { useCollectionStore } from "../../store/useCollectionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { SUB_CATEGORIES, TAB_ICONS } from "../../constants";

export default function MyCustomTabBar({ state, descriptors, navigation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuAnimation = useRef(new Animated.Value(0)).current;

    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const insets = useSafeAreaInsets();

    const currentRouteName = state.routes[state.index].name;
    const isActuallyOnCollection = currentRouteName === "Коллекция";
    const collectionRoute = state.routes.find((r) => r.name === "Коллекция");
    const currentActiveSection = collectionRoute?.params?.appSection;

    const BAR_HEIGHT = isCompactMenu ? 65 : 85;
    const TOTAL_BAR_HEIGHT =
        BAR_HEIGHT + (insets.bottom > 0 ? insets.bottom : 10);
    const ICON_CONTAINER_SIZE = isCompactMenu ? 45 : 65;

    const toggleMenu = () => {
        const toValue = isMenuOpen ? 0 : 1;
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <View style={styles.wrapper}>
            {isMenuOpen && (
                <Pressable style={styles.overlay} onPress={toggleMenu} />
            )}

            <VerticalSubMenu
                menuAnimation={menuAnimation}
                SUB_CATEGORIES={SUB_CATEGORIES}
                currentActiveSection={currentActiveSection}
                isActuallyOnCollection={isActuallyOnCollection}
                handleSubCategoryPress={(cat) => {
                    toggleMenu();
                    navigation.navigate("Коллекция", { appSection: cat });
                }}
                bottomOffset={TOTAL_BAR_HEIGHT + 10}
            />

            <View
                style={[
                    styles.mainContainer,
                    { height: TOTAL_BAR_HEIGHT, paddingBottom: insets.bottom },
                ]}
            >
                {state.routes.map((route, index) => (
                    <TabMenuItem
                        key={route.key}
                        routeName={route.name}
                        isFocused={state.index === index}
                        isMenuOpen={isMenuOpen}
                        isCompactMenu={isCompactMenu}
                        iconSet={TAB_ICONS[route.name]}
                        ICON_CONTAINER_SIZE={ICON_CONTAINER_SIZE}
                        onPress={() => {
                            if (route.name === "Коллекция") toggleMenu();
                            else {
                                if (isMenuOpen) toggleMenu();
                                navigation.navigate(route.name);
                            }
                        }}
                    />
                ))}
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        height: 2000,
        top: -2000,
        backgroundColor: "rgba(0,0,0,0.6)",
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
