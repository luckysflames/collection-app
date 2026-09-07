import React, { useEffect, useState } from "react";
import { Clipboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../hooks/useTheme";

export const TitleItem = ({ label, value, onSelect }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

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
            <TouchableOpacity
                style={{ flex: 1, marginRight: 10 }}
                onPress={onSelect ? () => onSelect(value) : undefined}
                activeOpacity={onSelect ? 0.5 : 1}
                disabled={!onSelect}
            >
                <Text style={styles.modalLabel}>{label}</Text>
                <Text style={styles.modalValue} numberOfLines={3}>
                    {value}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.copyButton, copied && styles.copyButtonSuccess]}
                onPress={handleCopy}
                disabled={copied}
                activeOpacity={0.6}
            >
                <Text style={[styles.copyButtonText, copied && styles.copyButtonTextSuccess]}>
                    {copied ? "✓" : "Копировать"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        modalCopyRow: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentMuted,
        },
        modalLabel: {
            color: theme.accent,
            fontSize: 11,
            marginBottom: 4,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
        },
        modalValue: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "500",
            lineHeight: 20,
        },
        copyButton: {
            backgroundColor: theme.accentMuted,
            paddingVertical: 8,
            borderRadius: 12,
            width: 95,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: theme.accent,
        },
        copyButtonSuccess: {
            backgroundColor: theme.accent,
        },
        copyButtonText: {
            color: theme.accent,
            fontSize: 12,
            fontWeight: "700",
        },
        copyButtonTextSuccess: {
            color: theme.text,
        },
    });
