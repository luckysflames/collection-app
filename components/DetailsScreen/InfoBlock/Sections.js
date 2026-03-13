import { Text, View } from "react-native";
import { LabelValue } from "./LabelValue";
import { styles } from "./InfoBlock.styles";
import { formatKind, formatRating } from "./utils";

export const AnimeQuickData = ({ data }) => (
    <View style={styles.quickMeta}>
        <Text style={styles.scoreText}>★ {data.score}</Text>
        <View style={styles.dot} />
        <Text style={styles.metaText}>{formatKind(data.kind)}</Text>
        <View style={styles.dot} />
        <Text style={styles.metaText}>{formatRating(data.rating)}</Text>
    </View>
);

export const MovieQuickData = ({ data }) => (
    <View style={styles.quickMeta}>
        <Text style={styles.scoreText}>★ {data.score}</Text>
    </View>
);

export const GameQuickData = ({ data }) => (
    <View style={styles.quickMeta}>
        <Text style={styles.scoreText}>★ {data.score}</Text>
    </View>
);

export const BookQuickData = ({ data }) => (
    <View style={styles.quickMeta}>
        <Text style={styles.scoreText}>★ {data.score}</Text>
    </View>
);

export const AnimeExtra = ({ data }) => (
    <LabelValue label="Студия" value={data.studios?.join(", ")} />
);

export const MovieExtra = ({ data }) => (
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
