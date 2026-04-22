import { Lock, Trash2 } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const DangerItem = ({ title, subtitle, disabled, onPress, isLast }) => (
    <TouchableOpacity
        style={[styles.dangerItem, isLast && { borderBottomWidth: 0 }]}
        // Используем activeOpacity: 1, чтобы кнопка не мигала при нажатии в disabled
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
        onPress={onPress}
    >
        <View style={{ flex: 1 }}>
            <Text style={[styles.dangerText, disabled && styles.disabledText]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.dangerSubtext,
                    disabled && styles.disabledSubtext,
                ]}
            >
                {subtitle}
            </Text>
        </View>
        {disabled ? (
            <Lock size={20} color="#2A2E3D" />
        ) : (
            <Trash2 size={20} color="#FF6B6B" />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    dangerItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
    },
    dangerText: { color: "#FF6B6B", fontSize: 15, fontWeight: "600" },
    dangerSubtext: { color: "#5E6272", fontSize: 11, marginTop: 2 },
    disabledText: {
        color: "#4A4D57", // Приглушенный серо-красный или просто серый
    },
    disabledSubtext: {
        color: "#2A2E3B", // Почти сливается с фоном
    },
});
