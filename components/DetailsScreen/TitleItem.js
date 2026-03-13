import React, { useEffect, useState } from "react";
import { Clipboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Вспомогательный компонент для строки названия с умной кнопкой
export const TitleItem = ({ label, value }) => {
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    const handleCopy = () => {
        Clipboard.setString(value);
        setCopied(true);
    };

    // Сбрасываем состояние галочки через 2 секунды
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
                <Text style={styles.modalValue} numberOfLines={2}>
                    {value}
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                onPress={handleCopy}
                disabled={copied}
            >
                <Text style={styles.copyButtonText}>
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
        textTransform: "uppercase",
    },
    modalValue: { color: "#fff", fontSize: 15, fontWeight: "500" },
    copyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    copyButton: {
        backgroundColor: "rgba(125, 138, 255, 0.15)", // Делаем в обычном состоянии поспокойнее
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        minWidth: 60,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.3)",
    },
    copyButtonSuccess: {
        backgroundColor: "#7D8AFF", // Зеленый при успехе
        borderColor: "#7D8AFF",
    },
    copyButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
});
