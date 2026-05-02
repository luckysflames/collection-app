import React, { useEffect, useState } from "react";
import {
    Clipboard,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const TitleItem = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    const handleCopy = () => {
        Clipboard.setString(value);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <View style={styles.modalCopyRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.modalLabel}>{label}</Text>
                <Text style={styles.modalValue}>
                    {value}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                onPress={handleCopy}
                disabled={copied}
                activeOpacity={0.6}
            >
                <Text
                    style={[
                        styles.copyButtonText,
                        copied && styles.copyButtonTextSuccess,
                    ]}
                >
                    {copied ? "✓" : "Копировать"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    modalCopyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    modalLabel: {
        color: "#8E94A4",
        fontSize: 11,
        marginBottom: 4,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    modalValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 20,
    },
    copyButton: {
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        minWidth: 85,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    copyButtonSuccess: {
        backgroundColor: "#7D8AFF",
        borderColor: "#7D8AFF",
    },
    copyButtonText: {
        color: "#7D8AFF", // В обычном состоянии текст в цвет бренда
        fontSize: 12,
        fontWeight: "700",
    },
    copyButtonTextSuccess: {
        color: "#FFF",
    },
});
