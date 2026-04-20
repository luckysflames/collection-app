import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from "react-native";
import {
    Check,
    Clock,
    Star,
    StarOff,
    X,
    CaseSensitive,
    ChevronLeft,
    ChevronRight,
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    ArrowDownAZ,
    ArrowUpAZ,
} from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { SORT_TYPES, SORT_SUB_OPTIONS } from "../../../../constants";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ICON_COMPONENTS = {
    Clock,
    Star,
    StarOff,
    CaseSensitive,
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    ArrowDownAZ,
    ArrowUpAZ,
    Check,
    ChevronRight,
};

export const SortModal = ({
    isVisible,
    onClose,
    currentSort,
    onSelectSort,
}) => {
    const [viewLevel, setViewLevel] = useState("main");
    const [selectedType, setSelectedType] = useState(null);

    // Анимация сдвига страниц (горизонтальная)
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Сбрасываем уровень при каждом открытии
    useEffect(() => {
        if (isVisible) {
            setViewLevel("main");
            slideAnim.setValue(0);
        }
    }, [isVisible]);

    const animatePage = (toValue, callback) => {
        Animated.timing(slideAnim, {
            toValue,
            duration: 280,
            useNativeDriver: true,
        }).start(callback);
    };

    const goToSubLevel = (typeId) => {
        setSelectedType(typeId);
        setViewLevel("sub");
        animatePage(-SCREEN_WIDTH);
    };

    const goBack = () => {
        animatePage(0, () => setViewLevel("main"));
    };

    const renderOption = (item, isSelected, onPress) => {
        const IconComponent = ICON_COMPONENTS[item.icon];

        return (
            <TouchableOpacity
                key={item.id}
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    styles.optionItem,
                    isSelected && styles.optionItemActive,
                ]}
            >
                <View style={styles.optionLeft}>
                    <View
                        style={[
                            styles.iconBox,
                            isSelected && styles.iconBoxActive,
                        ]}
                    >
                        {IconComponent && (
                            <IconComponent
                                size={20}
                                color={isSelected ? "#fff" : "#8E94A4"}
                            />
                        )}
                    </View>
                    <Text
                        style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelActive,
                        ]}
                    >
                        {item.label}
                    </Text>
                </View>

                {viewLevel === "main" ? (
                    <ChevronRight size={20} color="rgba(142, 148, 164, 0.5)" />
                ) : (
                    isSelected && (
                        <Check size={20} color="#7D8AFF" strokeWidth={3} />
                    )
                )}
            </TouchableOpacity>
        );
    };

    return (
        <BottomSheet
            visible={isVisible}
            onClose={onClose}
            containerStyle={styles.bottomSheetCustom}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    {viewLevel === "sub" ? (
                        <TouchableOpacity
                            onPress={goBack}
                            style={styles.backBtn}
                        >
                            <ChevronLeft size={24} color="#fff" />
                            <Text style={styles.title}>Назад</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={styles.title}>Сортировка</Text>
                    )}
                </View>
            </View>

            {/* Content with Sliding Pages */}
            <View style={styles.overflowHidden}>
                <Animated.View
                    style={[
                        styles.flexRow,
                        { transform: [{ translateX: slideAnim }] },
                    ]}
                >
                    {/* Page 1: Main Categories */}
                    <View style={styles.page}>
                        <View style={styles.optionsContainer}>
                            {SORT_TYPES.map((type) => {
                                const isActive =
                                    currentSort === type.id ||
                                    SORT_SUB_OPTIONS[type.id]?.some(
                                        (sub) => sub.id === currentSort,
                                    );
                                return renderOption(type, isActive, () =>
                                    goToSubLevel(type.id),
                                );
                            })}
                        </View>
                    </View>

                    {/* Page 2: Sub Options */}
                    <View style={styles.page}>
                        <View style={styles.optionsContainer}>
                            {selectedType &&
                                SORT_SUB_OPTIONS[selectedType]?.map((sub) =>
                                    renderOption(
                                        sub,
                                        currentSort === sub.id,
                                        () => {
                                            onSelectSort(sub.id);
                                            onClose(); // Закрываем через BottomSheet
                                        },
                                    ),
                                )}
                        </View>
                    </View>
                </Animated.View>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetCustom: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 0, // Убираем тут, чтобы страницы были во всю ширину
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 10,
        paddingBottom: 20,
        minHeight: 60,
    },
    // headerLeft: { flex: 1 },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },
    backBtn: {
        flexDirection: "row",
        alignItems: "center",
        left: -8,
    },
    closeBtn: { padding: 4 },
    overflowHidden: {
        overflow: "hidden",
        width: SCREEN_WIDTH,
    },
    flexRow: {
        flexDirection: "row",
        width: SCREEN_WIDTH * 2,
    },
    page: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 30,
    },
    optionsContainer: { gap: 10 },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
    },
    optionItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        borderColor: "rgba(125, 138, 255, 0.3)",
        borderWidth: 1,
    },
    optionLeft: { flexDirection: "row", alignItems: "center" },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        justifyContent: "center",
        alignItems: "center",
    },
    iconBoxActive: { backgroundColor: "#7D8AFF" },
    optionLabel: {
        fontSize: 18,
        color: "#8E94A4",
        marginLeft: 15,
    },
    optionLabelActive: {
        color: "#fff",
        fontWeight: "600",
    },
});
