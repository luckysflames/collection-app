import React from "react";
import { TouchableOpacity, View, Text, Switch, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "../../../hooks/useTheme";

export const SettingItem = ({
    icon: IconComponent,
    label,
    value,
    onValueChange,
    type = "link",
    onPress,
}) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={type === "switch"}>
            <View style={styles.settingLeft}>
                <View style={styles.iconWrapper}>
                    {IconComponent && <IconComponent size={20} color={theme.accent} />}
                </View>
                <Text style={styles.settingLabel}>{label}</Text>
            </View>

            {type === "switch" ? (
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: theme.textDark, true: theme.accent }}
                    thumbColor={theme.text}
                />
            ) : (
                <ChevronRight size={20} color={theme.textDark} />
            )}
        </TouchableOpacity>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        settingItem: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        settingLeft: { flexDirection: "row", alignItems: "center" },
        iconWrapper: {
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: theme.accentMuted,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 15,
        },
        settingLabel: { color: theme.text, fontSize: 16, fontWeight: "500" },
    });
