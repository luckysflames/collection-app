import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BookCopy } from "lucide-react-native";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

// Добавляем новые пропсы: showOrderNumber (режим ли это) и orderNumber (сама цифра)
export const MediaCard = ({
    item,
    itemCount,
    onPress,
    showOrderNumber,
    orderNumber,
}) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.cardContainer}
    >
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            {/* Индикатор очереди при реордеринге */}
            {showOrderNumber && (
                <View
                    style={[
                        styles.orderBadge,
                        orderNumber && styles.orderBadgeActive, // Красим ярче, если выбрано
                    ]}
                >
                    <Text style={styles.orderText}>{orderNumber || ""}</Text>
                </View>
            )}

            {item.isFolder && (
                <View style={styles.folderBadge}>
                    <BookCopy size={15} color="#ffffff" />
                    <Text style={styles.folderCount}>{itemCount}</Text>
                </View>
            )}

            <LinearGradient
                colors={["transparent", "rgba(5, 11, 24, 0.9)"]}
                style={styles.gradient}
            />

            <View style={styles.info}>
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
        height: 280,
        borderRadius: 20,
        backgroundColor: "#1A2232",
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    // НОВЫЕ СТИЛИ ДЛЯ ЦИФР
    orderBadge: {
        position: "absolute",
        top: 10,
        left: 10, // С другой стороны от папок, чтобы не конфликтовать
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.2)", // По дефолту прозрачный круг
        borderWidth: 2,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    orderBadgeActive: {
        backgroundColor: "#7D8AFF", // Цвет под основной стиль твоего приложения
        borderColor: "#7D8AFF",
    },
    orderText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    // ... твои старые стили без изменений
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "50%",
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
    folderBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(125, 138, 255, 0.9)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 5,
    },
    folderCount: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});
