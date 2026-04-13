import React from "react";
import { TouchableOpacity, View, Text, Switch, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SettingItem = ({
    icon,
    label,
    value,
    onValueChange,
    type = "link",
    onPress,
}) => (
    <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        disabled={type === "switch"}
    >
        <View style={styles.settingLeft}>
            <View style={styles.iconWrapper}>
                <Ionicons name={icon} size={22} color="#7D8AFF" />
            </View>
            <Text style={styles.settingLabel}>{label}</Text>
        </View>

        {type === "switch" ? (
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: "#1E293B", true: "#7D8AFF" }}
                thumbColor="#fff"
            />
        ) : (
            <Ionicons name="chevron-forward" size={20} color="#8E94A4" />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
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
        backgroundColor: "rgba(125, 138, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    settingLabel: { color: "#fff", fontSize: 16, fontWeight: "500" },
});
