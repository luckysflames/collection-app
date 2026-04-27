import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREENSHOT_WIDTH = 200; // Немного увеличим для красоты
const GAP = 12;
// Считаем отступ, чтобы картинка была по центру
const SIDE_SPACING = (SCREEN_WIDTH - SCREENSHOT_WIDTH) / 2;

export const ScreenshotCarousel = ({ screenshots = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);

    if (!screenshots.length) return null;

    const handleScroll = (direction) => {
        let nextIndex =
            direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex < 0 || nextIndex >= screenshots.length) return;

        setCurrentIndex(nextIndex);

        // РАСЧЕТ ЦЕНТРИРОВАНИЯ:
        // 1. Считаем позицию левого края нужной карточки: nextIndex * (ширина + зазор)
        // 2. Вычитаем SIDE_SPACING, чтобы карточка сместилась к центру, а не прилипла к левому краю
        const offset = nextIndex * (SCREENSHOT_WIDTH + GAP) - SIDE_SPACING + 15;

        // Маленькая проверка: если offset меньше 0 (для первого скрина), скроллим в 0
        const finalOffset = Math.max(0, offset);

        scrollRef.current?.scrollTo({
            x: finalOffset,
            animated: true,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Кадры</Text>

            <View style={styles.carouselWrapper}>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    // Убираем SIDE_SPACING отсюда, чтобы первый скрин стоял слева
                    contentContainerStyle={{
                        paddingHorizontal: 15, // Небольшой отступ, чтобы первый скрин не лип к краю
                        gap: GAP,
                    }}
                >
                    {screenshots.map((s, i) => (
                        <Image
                            key={i}
                            source={{ uri: s }}
                            style={styles.image}
                        />
                    ))}
                </ScrollView>

                {/* Кнопки навигации */}
                {currentIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.navButton, styles.leftButton]}
                        onPress={() => handleScroll("prev")}
                    >
                        <ChevronLeft color="#fff" size={30} />
                    </TouchableOpacity>
                )}

                {currentIndex < screenshots.length - 1 && (
                    <TouchableOpacity
                        style={[styles.navButton, styles.rightButton]}
                        onPress={() => handleScroll("next")}
                    >
                        <ChevronRight color="#fff" size={30} />
                    </TouchableOpacity>
                )}

                <View style={styles.counterBadge}>
                    <Text style={styles.counterText}>
                        {currentIndex + 1} / {screenshots.length}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        // Отрицательный маржин выводит компонент за пределы паддингов родителя
        // Подставь здесь то значение, которое у тебя в общем контейнере (например -15 или -20)
        marginHorizontal: -20,
    },
    sectionTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 12,
        marginLeft: 25, // Увеличил, так как теперь есть отрицательный маржин
    },
    carouselWrapper: {
        position: "relative",
    },
    image: {
        width: SCREENSHOT_WIDTH,
        aspectRatio: 16 / 9,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
    navButton: {
        position: "absolute",
        top: "50%",
        marginTop: -40,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Чуть темнее для контраста
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    leftButton: { left: 18 },
    rightButton: { right: 18 },
    counterBadge: {
        alignSelf: "center", // Теперь бадж центрируется относительно всего враппера
        marginTop: 10,
        backgroundColor: "rgba(255,255,255,0.1)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    counterText: {
        color: "#8E94A4",
        fontSize: 11,
        fontWeight: "bold",
    },
});
