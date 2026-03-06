import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const MediaCard = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
        <View>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>
                    {item.duration} • {item.category}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.07)",
    },
    image: {
        width: "100%",
        height: 120,
        borderRadius: 10,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        marginTop: 8,
        fontSize: 16,
    },
    subtitle: {
        color: "#8E94A4",
        fontSize: 10,
        marginTop: 4,
    },
});
