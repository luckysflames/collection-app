import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export const EditForm = ({ form, setForm, type }) => {
    // Помощник для обычных полей
    const updateField = (field, value) => setForm({ ...form, [field]: value });

    // Помощник для массивов (превращает строку "США, Франция" в массив ["США", "Франция"])
    const updateArrayField = (field, value) => {
        const arr = value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        setForm({ ...form, [field]: arr });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Название</Text>
            <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(v) => updateField("title", v)}
                placeholderTextColor="#444"
            />

            {/* Поля для Фильмов */}
            {type === "movie" && (
                <>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Год</Text>
                            <TextInput
                                style={styles.input}
                                value={form.year}
                                onChangeText={(v) => updateField("year", v)}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.label}>Бюджет</Text>
                            <TextInput
                                style={styles.input}
                                value={form.budget}
                                onChangeText={(v) => updateField("budget", v)}
                            />
                        </View>
                    </View>
                    <Text style={styles.label}>Страны (через запятую)</Text>
                    <TextInput
                        style={styles.input}
                        value={form.countries?.join(", ")}
                        onChangeText={(v) => updateArrayField("countries", v)}
                    />
                </>
            )}

            {/* Поля для Аниме */}
            {type === "anime" && (
                <>
                    <Text style={styles.label}>Японское название</Text>
                    <TextInput
                        style={styles.input}
                        value={form.japaneseTitle}
                        onChangeText={(v) => updateField("japaneseTitle", v)}
                    />
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Эпизоды</Text>
                            <TextInput
                                style={styles.input}
                                value={String(form.episodes || "")}
                                onChangeText={(v) => updateField("episodes", v)}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.label}>Студии</Text>
                            <TextInput
                                style={styles.input}
                                value={form.studios?.join(", ")}
                                onChangeText={(v) =>
                                    updateArrayField("studios", v)
                                }
                            />
                        </View>
                    </View>
                </>
            )}

            {/* Поля для Игр */}
            {type === "game" && (
                <>
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Metacritic</Text>
                            <TextInput
                                style={styles.input}
                                value={String(form.metacritic || "")}
                                onChangeText={(v) =>
                                    updateField("metacritic", v)
                                }
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.label}>ESRB</Text>
                            <TextInput
                                style={styles.input}
                                value={form.esrb}
                                onChangeText={(v) => updateField("esrb", v)}
                            />
                        </View>
                    </View>
                    <Text style={styles.label}>Разработчики</Text>
                    <TextInput
                        style={styles.input}
                        value={form.developers?.join(", ")}
                        onChangeText={(v) => updateArrayField("developers", v)}
                    />
                </>
            )}

            {/* Поля для Книг */}
            {type === "book" && (
                <>
                    <Text style={styles.label}>Авторы</Text>
                    <TextInput
                        style={styles.input}
                        value={form.authors?.join(", ")}
                        onChangeText={(v) => updateArrayField("authors", v)}
                    />
                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Страниц</Text>
                            <TextInput
                                style={styles.input}
                                value={String(form.pageCount || "")}
                                onChangeText={(v) =>
                                    updateField("pageCount", v)
                                }
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.label}>Издатель</Text>
                            <TextInput
                                style={styles.input}
                                value={form.publisher}
                                onChangeText={(v) =>
                                    updateField("publisher", v)
                                }
                            />
                        </View>
                    </View>
                </>
            )}

            <Text style={styles.label}>Жанры (через запятую)</Text>
            <TextInput
                style={styles.input}
                value={form.genres?.join(", ")}
                onChangeText={(v) => updateArrayField("genres", v)}
            />

            <Text style={styles.label}>Описание</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={form.description}
                onChangeText={(v) => updateField("description", v)}
                multiline
                numberOfLines={4}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { gap: 5 },
    label: {
        color: "#8E94A4",
        fontSize: 12,
        marginTop: 10,
        marginBottom: 4,
        textTransform: "uppercase",
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#1E293B",
        borderRadius: 8,
        color: "#fff",
        padding: 12,
        fontSize: 16,
    },
    row: { flexDirection: "row" },
    textArea: { minHeight: 100, textAlignVertical: "top" },
});
