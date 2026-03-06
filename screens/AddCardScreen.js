import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUSES = ["Смотрю", "В планах", "Просмотрено", "Брошено", "Отложено"];

export default function AddCardScreen({ route, navigation }) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [status, setStatus] = useState("Смотрю"); // Состояние для выбранного статуса
    const { currentSection } = route.params || { currentSection: "Фильмы" };
    const insets = useSafeAreaInsets();

    const addToCollection = useCollectionStore(
        (state) => state.addToCollection,
    );

    const handleSave = () => {
        const newCard = {
            id: Date.now().toString(),
            title: title.trim(),
            appSection: currentSection, // Наше новое поле
            status: status, // Выбранный чипс
            image: image || "...",
        };
        addToCollection(newCard);
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top - 10 }]}>
            <Text style={styles.header}>Добавить в {currentSection.toLowerCase()}</Text>

            <TextInput
                style={styles.input}
                placeholder="Название"
                placeholderTextColor="#8E94A4"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                style={styles.input}
                placeholder="Ссылка на обложку (URL)"
                placeholderTextColor="#8E94A4"
                value={image}
                onChangeText={setImage}
            />

            <Text style={{ color: "#fff", marginBottom: 10 }}>
                Выберите статус:
            </Text>
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 20,
                }}
            >
                {STATUSES.map((s) => (
                    <TouchableOpacity
                        key={s}
                        style={[
                            styles.miniChip,
                            status === s && styles.activeMiniChip,
                        ]}
                        onPress={() => setStatus(s)}
                    >
                        <Text style={{ color: "#fff", fontSize: 12 }}>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Сохранить в коллекцию</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                    style={{
                        color: "#8E94A4",
                        textAlign: "center",
                        marginTop: 20,
                    }}
                >
                    Отмена
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        paddingVertical: 20,
    },
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 10,
        padding: 15,
        color: "#fff",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    miniChip: {
        padding: 8,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    activeMiniChip: { backgroundColor: "#7D8AFF" },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 18,
        borderRadius: 12,
        marginTop: 10,
    },
    saveButtonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});
