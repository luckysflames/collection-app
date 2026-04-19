import { Trash2 } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const DangerItem = ({ title, subtitle, onPress, isLast }) => (
    <TouchableOpacity
        style={[styles.dangerItem, isLast && { borderBottomWidth: 0 }]}
        onPress={onPress}
    >
        <View style={{ flex: 1 }}>
            <Text style={styles.dangerText}>{title}</Text>
            <Text style={styles.dangerSubtext}>{subtitle}</Text>
        </View>
        <Trash2 size={20} color="#FF6B6B" />
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
});
