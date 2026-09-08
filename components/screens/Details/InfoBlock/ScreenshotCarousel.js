import React, { useState, memo, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
} from "react-native";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { ImageModal } from "../../../shared/Modals/ImageModal";
import { useTheme } from "../../../../hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SCREENSHOT_WIDTH = 280;
const GAP = 12;
const BASE_PADDING = 20;

const ScreenshotItem = memo(({ uri, onPress, styles }) => (
    <View style={styles.cardWrapper}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(uri)}>
            <Image source={{ uri }} style={styles.image} />
        </TouchableOpacity>
    </View>
));

const ScreenshotCarouselComponent = ({ screenshots = [] }) => {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const [selectedImage, setSelectedImage] = useState(null);

    const snapOffsets = useMemo(() => {
        return screenshots.map((_, index) => {
            const cardLeftEdge = index * (SCREENSHOT_WIDTH + GAP);
            const centerOffset =
                cardLeftEdge - (SCREEN_WIDTH - SCREENSHOT_WIDTH) / 2 + BASE_PADDING;

            if (index === 0) return 0;

            const totalContentWidth =
                screenshots.length * (SCREENSHOT_WIDTH + GAP) - GAP + BASE_PADDING * 2;
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
                snapToOffsets={snapOffsets}
                snapToAlignment="center"
                disableIntervalMomentum={true}
                scrollEventThrottle={16}
            >
                <FlatList
                    data={screenshots}
                    renderItem={({ item }) => (
                        <ScreenshotItem uri={item} onPress={setSelectedImage} styles={styles} />
                    )}
                    keyExtractor={(item, index) => `shot-${index}`}
                    horizontal
                    scrollEnabled={false}
                    listKey="screenshots-list"
                    removeClippedSubviews={true}
                />
            </GestureScrollView>

            <ImageModal
                visible={!!selectedImage}
                images={screenshots}
                initialIndex={screenshots.indexOf(selectedImage)}
                onClose={() => setSelectedImage(null)}
            />
        </View>
    );
};

export const ScreenshotCarousel = memo(ScreenshotCarouselComponent);

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginTop: 20,
            marginHorizontal: -BASE_PADDING,
            backgroundColor: theme.main,
            paddingVertical: 20,
        },
        sectionTitle: {
            color: theme.text,
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            marginLeft: BASE_PADDING,
        },
        flatListContent: {
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
            backgroundColor: theme.textDark,
        },
    });
