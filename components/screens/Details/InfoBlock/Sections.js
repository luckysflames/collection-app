import { StyleSheet, Text, View } from "react-native";

import { LabelValue } from "./LabelValue";
import { formatKind, formatRating } from "./utils";
import { ANIME_ORIGIN_MAP } from "../../../..//constants/index";

export const AnimeQuickData = ({ data }) => {
    return (
        <View style={styles.quickMeta}>
            {!data.isCustom && data.score && (
                <>
                    <Text style={styles.scoreText}>★ {data.score}</Text>
                    <View style={styles.dot} />
                </>
            )}
            <Text style={styles.metaText}>{formatKind(data.animeKind)}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{formatRating(data.rating)}</Text>
        </View>
    );
};

export const MovieQuickData = ({ data }) => {
    if (data.isCustom) return null;

    return (
        <View style={styles.quickMeta}>
            <Text style={styles.scoreText}>★ {data.score}</Text>
        </View>
    );
};

export const TVQuickData = ({ data }) => {
    if (data.isCustom) return null;

    return (
        <View style={styles.quickMeta}>
            <Text style={styles.scoreText}>★ {data.score}</Text>
        </View>
    );
};

export const GameQuickData = ({ data }) => {
    if (data.isCustom) return null;

    return (
        <View style={styles.quickMeta}>
            <Text style={styles.scoreText}>★ {data.score}</Text>
        </View>
    );
};

export const BookQuickData = ({ data }) => {
    if (data.isCustom) return null;

    return (
        <View style={styles.quickMeta}>
            <Text style={styles.scoreText}>★ {data.score}</Text>
        </View>
    );
};

export const AnimeExtra = ({ data }) => (
    <>
        <LabelValue label="Студия" value={data.studios?.join(", ")} />
        <LabelValue
            label="Первоисточник"
            value={ANIME_ORIGIN_MAP[data.origin] || data.origin || "Неизвестно"}
        />
    </>
);

export const MovieExtra = ({ data }) => (
    <>
        <LabelValue label="Страны" value={data.countries?.join(", ")} />
        <LabelValue label="Компании" value={data.companies?.join(", ")} />
    </>
);

export const TVExtra = ({ data }) => (
    <>
        <LabelValue label="Страны" value={data.countries?.join(", ")} />
        <LabelValue label="Компании" value={data.companies?.join(", ")} />
    </>
);

export const GameExtra = ({ data }) => (
    <>
        <LabelValue label="Разработчики" value={data.developers?.join(", ")} />
        <LabelValue label="Платформы" value={data.platforms?.join(", ")} />
    </>
);

export const BookExtra = ({ data }) => (
    <>
        <LabelValue label="Авторы" value={data.authors?.join(", ")} />
        <LabelValue label="Издатель" value={data.publisher} />
    </>
);

const styles = StyleSheet.create({
    quickMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    scoreText: { color: "#FFD700", fontSize: 14, fontWeight: "bold" },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: "#444",
        marginHorizontal: 8,
    },
    metaText: { color: "#8E94A4", fontSize: 14, fontWeight: "500" },
});
