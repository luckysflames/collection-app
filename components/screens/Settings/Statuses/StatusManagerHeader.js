import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { ChevronLeft, Check } from "lucide-react-native";

export const StatusManagerHeader = ({
    onBack,
    onSave,
    isSaving,
    hasChanges,
    insets,
}) => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Статусы</Text>

        <TouchableOpacity
            onPress={onSave}
            disabled={!hasChanges || isSaving}
            style={[
                styles.headerButton,
                !hasChanges && styles.saveButtonDisabled,
                hasChanges && styles.saveButtonActive,
            ]}
        >
            {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Check
                    size={24}
                    color={hasChanges ? "#fff" : "rgba(255,255,255,0.2)"}
                />
            )}
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 15,
    },
    headerButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    saveButtonActive: { backgroundColor: "#4E55D7", borderColor: "#7D8AFF" },
    saveButtonDisabled: { opacity: 0.6 },
});
