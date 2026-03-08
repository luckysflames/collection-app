import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const InfoBlock = ({
    title,
    status,
    year,
    countries,
    length,
    genres,
    onStatusPress,
}) => (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {/* {status && (
            <TouchableOpacity
                onPress={onStatusPress}
                style={styles.statusBadge}
            >
                <Text style={styles.statusText}>{status}</Text>
            </TouchableOpacity>
        )} */}

        {status ? (
            <TouchableOpacity
                onPress={onStatusPress}
                style={styles.statusBadge}
            >
                <Text style={styles.statusText}>{status}</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                onPress={onStatusPress}
                style={styles.statusBadgeCollect}
            >
                <Text style={styles.statusText}>Добавить в коллекцию</Text>
            </TouchableOpacity>
        )}

        <View style={styles.metaRow}>
            {!!year && <Text style={styles.metaText}>{year}</Text>}
            {countries?.length > 0 && (
                <>
                    <View style={styles.dot} />
                    <Text style={styles.metaText}>
                        {Array.isArray(countries) ? countries[0] : countries}
                    </Text>
                </>
            )}
            {!!length && (
                <>
                    <View style={styles.dot} />
                    <Text style={styles.metaText}>{length} мин.</Text>
                </>
            )}
        </View>

        <View style={styles.genreRow}>
            {genres?.map((g, i) => (
                <View key={i} style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {typeof g === "string" ? g : g.name}
                    </Text>
                </View>
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    statusBadge: {
        borderColor: "#7D8AFF",
        borderWidth: 2,
        padding: 10,
        borderRadius: 15,
        marginBottom: 15,
    },
    statusBadgeCollect: {
        borderColor: "#7D8AFF",
        backgroundColor: "#7D8AFF",
        borderWidth: 2,
        padding: 10,
        borderRadius: 15,
        marginBottom: 15,
    },
    statusText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
    metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
    metaText: { color: "#8E94A4", fontSize: 14, fontWeight: "500" },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#444",
        marginHorizontal: 8,
    },
    genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
    badge: {
        backgroundColor: "rgba(125, 138, 255, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeText: { color: "#7D8AFF", fontSize: 12, fontWeight: "bold" },
});
