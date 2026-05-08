import React, { useState, useCallback, memo, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    Platform,
} from "react-native";
// Используем ScrollView из gesture-handler для нативного контроля
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { ImageModal } from "../Modals/ImageModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREENSHOT_WIDTH = 280;
const GAP = 12;
const BASE_PADDING = 20;

const ScreenshotItem = memo(({ uri, onPress }) => (
    <View style={styles.cardWrapper}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(uri)}>
            <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
    </View>
));

const ScreenshotCarouselComponent = ({ screenshots = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const snapOffsets = useMemo(() => {
        return screenshots.map((_, index) => {
            // Базовая позиция левого края карточки (с учетом отступа контейнера)
            const cardLeftEdge = index * (SCREENSHOT_WIDTH + GAP);

            // Чтобы карточка была по центру:
            // Нам нужно вычесть из левого края карточки половину свободного места экрана
            // Формула: Позиция = ЛевоКарточки - (ШиринаЭкрана - ШиринаКарточки) / 2
            const centerOffset =
                cardLeftEdge -
                (SCREEN_WIDTH - SCREENSHOT_WIDTH) / 2 +
                BASE_PADDING;

            // Для первой карточки офсет всегда 0 (прилипает к левому краю)
            if (index === 0) return 0;

            // Для последней карточки вычисляем офсет так, чтобы она прилипла к правому краю
            // Это общая ширина контента минус ширина экрана
            const totalContentWidth =
                screenshots.length * (SCREENSHOT_WIDTH + GAP) -
                GAP +
                BASE_PADDING * 2;
            const maxScroll = totalContentWidth - SCREEN_WIDTH;

            if (index === screenshots.length - 1) return maxScroll;

            return centerOffset;
        });
    }, [screenshots]);

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Кадры</Text>

            <GestureScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                disallowInterruption={true}
                activeOffsetX={[-5, 5]}
                contentContainerStyle={styles.flatListContent}
                decelerationRate="fast"
                // Используем наши просчитанные точки
                snapToOffsets={snapOffsets}
                // Ставим center, чтобы логика работала точнее при доводке
                snapToAlignment="center"
                disableIntervalMomentum={true}
                scrollEventThrottle={16}
            >
                <FlatList
                    data={screenshots}
                    renderItem={({ item }) => (
                        <ScreenshotItem uri={item} onPress={setSelectedImage} />
                    )}
                    keyExtractor={(item, index) => `shot-${index}`}
                    horizontal
                    scrollEnabled={false}
                    listKey="screenshots-list"
                    removeClippedSubviews={Platform.OS === "android"}
                />
            </GestureScrollView>

            <ImageModal
                visible={!!selectedImage}
                images={screenshots} // Весь массив
                initialIndex={screenshots.indexOf(selectedImage)} // Индекс нажатой картинки
                onClose={() => setSelectedImage(null)}
            />
        </View>
    );
};

export const ScreenshotCarousel = memo(ScreenshotCarouselComponent);

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: -BASE_PADDING,
        backgroundColor: "rgba(255,255,255,0.05)",
        paddingVertical: 20,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        marginLeft: BASE_PADDING,
    },
    flatListContent: {
        // Базовый паддинг слева, а отступы между элементами
        // регулируются через cardWrapper marginRight
        paddingLeft: BASE_PADDING,
        paddingRight: BASE_PADDING - GAP,
    },
    cardWrapper: {
        width: SCREENSHOT_WIDTH,
        marginRight: GAP,
    },
    image: {
        width: "100%",
        aspectRatio: 16 / 9,
        borderRadius: 20,
        backgroundColor: "#1A2232",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
    },
});
