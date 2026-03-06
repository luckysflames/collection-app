import React from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, currentSection = "Фильмы" } = route.params;
    const { addToCollection } = useCollectionStore();
    const removeFromCollection = useCollectionStore(
        (state) => state.removeFromCollection,
    );

    const handleAdd = () => {
        const cardToSave = {
            ...item, // Тут остается оригинальная category от сервера (например "★ 7.4")
            appSection: currentSection, // А тут наше системное поле для таба
            status: "Смотрю",
        };
        addToCollection(cardToSave);
        alert("Добавлено!");
    };

    const handleDelete = () => {
        removeFromCollection(item.id);
        navigation.goBack(); // Возвращаемся в список, карточка исчезнет
    };

    return (
        <ScrollView style={styles.container}>
            {/* Кнопка Назад */}
            <TouchableOpacity
                style={[
                    styles.backButton,
                    { top: insets.top + 10 }, // Динамический отступ: шторка + 10 пикселей
                ]}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ color: "#fff" }}>
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    handleAdd();
                    alert("Добавлено в коллекцию!");
                }}
            >
                <Text style={{ color: "#fff" }}>Добавить в список</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
            >
                <Text style={{ color: "#fff" }}>Удалить из коллекции</Text>
            </TouchableOpacity>

            {/* Слой с постером и размытым фоном */}
            <View style={styles.heroSection}>
                {/* Размытая подложка (та же картинка) */}
                <Image
                    source={{ uri: item.image }}
                    style={styles.blurBackground}
                    blurRadius={5} // Размытие для эффекта глубины
                />

                <LinearGradient
                    colors={["transparent", "#050B18"]}
                    style={styles.gradient}
                />

                {/* Основной четкий постер */}
                <View style={styles.mainPosterWrapper}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.mainPoster}
                    />
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.category}</Text>
                </View>

                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.description}>
                    {item.description || "Описание отсутствует."}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },

    heroSection: {
        height: 450, // Высота верхней части с картинкой
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    blurBackground: {
        ...StyleSheet.absoluteFillObject, // Растягиваем на весь heroSection
        width: "100%",
        height: "120%", // Чуть больше, чтобы скрыть края при размытии
        opacity: 0.4, // Делаем фон приглушенным
    },
    mainPoster: {
        width: 240, // Фиксированная ширина для аккуратного вида
        height: 340,
        borderRadius: 20,
        resizeMode: "cover",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 600, // Высота перехода
    },

    backButton: {
        position: "absolute",
        top: 15,
        left: 15,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 15,
        borderRadius: 15,
    },
    addButton: {
        position: "absolute",
        top: 50,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 20,
    },
    deleteButton: {
        position: "absolute",
        top: 110,
        right: 20,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 20,
    },

    // Остальные стили (infoContainer, title и т.д.) остаются прежними...
    infoContainer: {
        padding: 20,
        marginTop: -20, // Немного "наезжаем" на картинку для стиля
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    description: { color: "#8E94A4", fontSize: 16, lineHeight: 24 },
    badge: {
        backgroundColor: "#7D8AFF",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: { color: "#fff", fontWeight: "bold" },
});
