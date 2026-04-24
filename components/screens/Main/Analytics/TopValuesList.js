import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const TopValuesList = ({ title, values }) => {
    if (!values?.length) return null;
    const maxCount = Math.max(...values.map((v) => v.count));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.list}>
                {values.map((item, idx) => (
                    <View key={idx} style={styles.item}>
                        <View style={styles.rank}>
                            <Text style={styles.rankText}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        width: `${(item.count / maxCount) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                        <Text style={styles.count}>{item.count}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "rgba(125, 138, 255, 0.15)",
    },
    title: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 10,
        textTransform: "uppercase",
    },
    list: { gap: 8 },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 8,
    },
    rank: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(125, 138, 255, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    rankText: { color: "#7D8AFF", fontSize: 12, fontWeight: "700" },
    name: { color: "#fff", fontSize: 13, fontWeight: "500", marginBottom: 4 },
    bar: {
        height: 4,
        backgroundColor: "#7D8AFF",
        borderRadius: 2,
        opacity: 0.6,
    },
    count: {
        color: "#7D8AFF",
        fontSize: 12,
        fontWeight: "600",
        minWidth: 24,
        textAlign: "right",
    },
});
