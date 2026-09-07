import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import {
    Check,
    Clock,
    Star,
    StarOff,
    CaseSensitive,
    ChevronLeft,
    ChevronRight,
    ArrowUpNarrowWide,
    ArrowDownWideNarrow,
    ArrowDownAZ,
    ArrowUpAZ,
    CalendarClock,
} from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { SORT_TYPES, SORT_SUB_OPTIONS } from "../../../..//constants/index";
import { useTheme } from "../../../../hooks/useTheme";

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
    CalendarClock,
};

export const SortModal = ({
    isVisible,
    onClose,
    currentSort,
    onSelectSort,
    isInsideFolder = false,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [viewLevel, setViewLevel] = useState("main");
    const [selectedType, setSelectedType] = useState(null);
    const [pendingSort, setPendingSort] = useState(currentSort);

    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isVisible) {
            setViewLevel("main");
            slideAnim.setValue(0);
            setPendingSort(currentSort);
        }
    }, [isVisible, currentSort]);

    const handleSelect = (subId) => {
        setPendingSort(subId);
        onClose();
        setTimeout(() => {
            onSelectSort(subId);
        }, 100);
    };

    const animatePage = (toValue, callback) => {
        Animated.timing(slideAnim, {
            toValue,
            duration: 280,
            useNativeDriver: true,
        }).start(callback);
    };

    const visibleSortTypes = isInsideFolder
        ? SORT_TYPES
        : SORT_TYPES.filter((type) => type.id !== "manual");

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
                style={[styles.optionItem, isSelected && styles.optionItemActive]}
            >
                <View style={styles.optionLeft}>
                    <View style={[styles.iconBox, isSelected && styles.iconBoxActive]}>
                        {IconComponent && (
                            <IconComponent
                                size={20}
                                color={isSelected ? theme.text : theme.textDark}
                            />
                        )}
                    </View>
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelActive]}>
                        {item.label}
                    </Text>
                </View>

                {viewLevel === "main" ? (
                    <ChevronRight size={20} color={theme.textDark} />
                ) : (
                    isSelected && <Check size={20} color={theme.accent} strokeWidth={3} />
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
            <View style={styles.header}>
                {viewLevel === "sub" && (
                    <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                        <ChevronLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                )}
                <Text style={styles.title}>{viewLevel === "sub" ? "Параметры" : "Сортировка"}</Text>
            </View>

            <View style={styles.overflowHidden}>
                <Animated.View style={[styles.flexRow, { transform: [{ translateX: slideAnim }] }]}>
                    <View style={styles.page}>
                        <View style={styles.optionsContainer}>
                            {visibleSortTypes.map((type) => {
                                const isActive =
                                    currentSort === type.id ||
                                    SORT_SUB_OPTIONS[type.id]?.some(
                                        (sub) => sub.id === currentSort,
                                    );
                                return renderOption(type, isActive, () => goToSubLevel(type.id));
                            })}
                        </View>
                    </View>

                    <View style={styles.page}>
                        <View style={styles.optionsContainer}>
                            {selectedType &&
                                SORT_SUB_OPTIONS[selectedType]?.map((sub) =>
                                    renderOption(sub, pendingSort === sub.id, () =>
                                        handleSelect(sub.id),
                                    ),
                                )}
                        </View>
                    </View>
                </Animated.View>
            </View>
        </BottomSheet>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        bottomSheetCustom: {
            backgroundColor: theme.main,
        },
        header: {
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginBottom: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.text,
        },
        backBtn: {
            position: "absolute",
            left: 20,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 10,
        },
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
            paddingHorizontal: 20,
        },
        optionsContainer: {
            gap: 8,
        },
        optionItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: theme.accentMuted,
        },
        optionItemActive: {
            backgroundColor: theme.accentMuted,
            borderColor: theme.accent,
        },
        optionLeft: {
            flexDirection: "row",
            alignItems: "center",
        },
        iconBox: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
        },
        iconBoxActive: {
            backgroundColor: theme.accent,
        },
        optionLabel: {
            fontSize: 16,
            color: theme.textDark,
            marginLeft: 15,
            fontWeight: "500",
        },
        optionLabelActive: {
            color: theme.text,
            fontWeight: "600",
        },
    });
