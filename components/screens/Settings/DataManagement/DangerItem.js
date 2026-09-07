import { Lock, Trash2 } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../../hooks/useTheme";

export const DangerItem = ({ title, subtitle, disabled, onPress, isLast }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <TouchableOpacity
            style={[styles.dangerItem, isLast && { borderBottomWidth: 0 }]}
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            onPress={onPress}
        >
            <View style={{ flex: 1 }}>
                <Text style={[styles.dangerText, disabled && styles.disabledText]}>{title}</Text>
                <Text style={styles.dangerSubtext}>{subtitle}</Text>
            </View>
            {disabled ? (
                <Lock size={20} color={theme.textDark} />
            ) : (
                <Trash2 size={20} color={theme.red} />
            )}
        </TouchableOpacity>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        dangerItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentMuted,
        },
        dangerText: { color: theme.red, fontSize: 15, fontWeight: "600" },
        dangerSubtext: { color: theme.textDark, fontSize: 11, marginTop: 2 },
        disabledText: {
            color: theme.textDark,
        },
    });
