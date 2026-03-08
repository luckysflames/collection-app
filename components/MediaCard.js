import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export const MediaCard = ({ item, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cardContainer}
    >
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Градиент поверх картинки снизу, чтобы текст читался лучше */}
            <LinearGradient
                colors={["transparent", "rgba(5, 11, 24, 0.9)"]}
                style={styles.gradient}
            />

            <View style={styles.info}>
                {/* numberOfLines={2} — спасет дизайн, если название очень длинное */}
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    cardContainer: {
        width: cardWidth,
        marginBottom: 16,
    },
    card: {
        width: "100%",
        height: 280, // Увеличили высоту для статности
        borderRadius: 20,
        backgroundColor: "#1A2232",
        overflow: "hidden", // Чтобы картинка не вылезала за скругления
        elevation: 5, // Тень для Android
        shadowColor: "#000", // Тень для iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "50%", // Затемняем нижнюю половину
    },
    info: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
    },
});
