import React, { useState, useEffect, useMemo } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Сторы и Хуки
import { useCollectionStore } from "../store/useCollectionStore";
import { useFetchDetails } from "../hooks/useFetchDetails";

// Компоненты UI
import { HeroSection } from "../components/DetailsScreen/HeroSection";
import { InfoBlock } from "../components/DetailsScreen/InfoBlock";
import { EditForm } from "../components/DetailsScreen/EditForm";
import StatusModal from "../components/DetailsScreen/StatusModal";

const COLLECTION_ICON = {
    active: require("../assets/icons/collection(active).png"),
    inactive: require("../assets/icons/collection(inactive).png"),
};

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category } = route.params;

    // Получаем расширенные данные через наш новый сервисный хук
    const { data: fullDetails, loading } = useFetchDetails(item.id);

    // UI состояния
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Достаем методы из Zustand
    const { myCollection, addToCollection, updateCard, removeFromCollection } =
        useCollectionStore();

    // Ищем, есть ли этот элемент в коллекции
    const savedItem = myCollection.find(
        (fav) => String(fav.id) === String(item.id),
    );
    const isInCollection = !!savedItem;
    const isCustom = item.isCustom || savedItem?.isCustom;

    // Объединяем данные (приоритет: данные из стора > данные из API > базовые данные из пропсов)
    const displayData = {
        title: savedItem?.title || item.title,
        year: savedItem?.year || fullDetails?.year || item.year,
        length: savedItem?.length || fullDetails?.filmLength || item.filmLength,
        countries:
            savedItem?.countries || fullDetails?.countries || item.countries,
        genres: savedItem?.genres || fullDetails?.genres || item.genres,
        description:
            savedItem?.description ||
            fullDetails?.description ||
            item.description,
    };

    // Локальный стейт для формы редактирования
    const [editForm, setEditForm] = useState({
        title: "",
        year: "",
        genres: "",
        countries: "",
        description: "",
    });

    // Синхронизация формы при входе в режим редактирования
    useEffect(() => {
        if (isEditing) {
            setEditForm({
                title: displayData.title || "",
                year: String(displayData.year || ""),
                filmLength: String(displayData.length || ""), // исправлено название поля
                genres: Array.isArray(displayData.genres)
                    ? displayData.genres.join(", ")
                    : "",
                countries: Array.isArray(displayData.countries)
                    ? displayData.countries.join(", ")
                    : "",
                description: displayData.description || "", // Подтягиваем описание
            });
        }
    }, [isEditing]);

    // Сохранение изменений
    const handleSave = () => {
        updateCard(item.id, {
            ...editForm,
            genres: editForm.genres
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            countries: editForm.countries
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        });
        setIsEditing(false);
    };

    // Изменение статуса (просмотрено, в планах и т.д.)
    const handleStatusUpdate = (newStatus) => {
        if (isInCollection) {
            updateCard(item.id, { status: newStatus });
        } else {
            // Если объекта нет в коллекции, добавляем его с выбранным статусом
            addToCollection({
                ...item,
                ...displayData,
                status: newStatus,
                appSection: category || "Фильмы",
            });
        }
        setModalVisible(false);
    };

    return (
        <ScrollView style={styles.container} bounces={false}>
            {/* Верхняя часть с картинкой и кнопками назад/добавить */}
            <HeroSection
                image={item.image}
                insets={insets}
                onBack={() => navigation.goBack()}
                onCollect={() =>
                    isInCollection
                        ? removeFromCollection(item.id)
                        : setModalVisible(true)
                }
                isInCollection={isInCollection}
                iconSources={COLLECTION_ICON}
            />

            <View style={styles.infoContainer}>
                {loading && !fullDetails && !savedItem ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#7D8AFF" />
                        <Text style={styles.loaderText}>
                            Загрузка деталей...
                        </Text>
                    </View>
                ) : (
                    <>
                        {isEditing ? (
                            <View>
                                <EditForm
                                    form={editForm}
                                    setForm={setEditForm}
                                />
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.saveButtonText}>
                                        Сохранить изменения
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setIsEditing(false)}
                                >
                                    <Text style={styles.cancelButtonText}>
                                        Отмена
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View>
                                <InfoBlock
                                    title={displayData.title}
                                    status={savedItem?.status}
                                    year={displayData.year}
                                    countries={displayData.countries}
                                    length={displayData.length}
                                    isAnime={!!item.isAnime}
                                    isGame={!!item.isGame}
                                    isMovie={!!item.isMovie}
                                    isBook={!!item.isBook}
                                    genres={displayData.genres}
                                    onStatusPress={() => setModalVisible(true)}
                                />

                                {isInCollection && isCustom && !isEditing && (
                                    <TouchableOpacity
                                        style={styles.editToggle}
                                        onPress={() => setIsEditing(true)}
                                    >
                                        <Text style={styles.editToggleText}>
                                            Редактировать инфо
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                <Text style={styles.sectionTitle}>
                                    Описание
                                </Text>
                                <Text style={styles.description}>
                                    {displayData.description ||
                                        "Описание временно отсутствует."}
                                </Text>

                                {isInCollection && (
                                    <View style={styles.userSection}>
                                        <Text style={styles.sectionTitle}>
                                            Мои заметки
                                        </Text>
                                        <TextInput
                                            style={styles.notesInput}
                                            multiline
                                            value={savedItem.userNotes || ""}
                                            onChangeText={(text) =>
                                                updateCard(item.id, {
                                                    userNotes: text,
                                                })
                                            }
                                            placeholder="Ваши мысли..."
                                            placeholderTextColor="#444"
                                        />
                                    </View>
                                )}
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Выбор статуса */}
            <StatusModal
                visible={isModalVisible}
                category={category || "Фильмы"}
                onClose={() => setModalVisible(false)}
                onSelect={handleStatusUpdate}
                currentStatus={savedItem?.status}
                removeCard={
                    isInCollection
                        ? () => {
                              removeFromCollection(item.id);
                              setModalVisible(false);
                          }
                        : null
                }
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
    },
    infoContainer: {
        padding: 20,
        marginTop: -30, // Наплыв на HeroSection
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
    loaderContainer: {
        paddingVertical: 50,
        alignItems: "center",
    },
    loaderText: {
        color: "#8E94A4",
        marginTop: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
    },
    description: {
        color: "#8E94A4",
        fontSize: 16,
        lineHeight: 26,
    },
    userSection: {
        marginTop: 10,
        paddingBottom: 60, // Запас снизу для скролла
    },
    notesInput: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        padding: 15,
        color: "#fff",
        minHeight: 120,
        textAlignVertical: "top",
    },
    editToggle: {
        alignSelf: "flex-start",
        marginTop: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#7D8AFF",
    },
    editToggleText: {
        color: "#7D8AFF",
        fontSize: 14,
        fontWeight: "500",
    },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 15,
        borderRadius: 15,
        marginTop: 20,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 5,
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 14,
    },
});
