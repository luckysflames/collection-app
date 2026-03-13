import React, { useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Сторы и Хуки
import { useCollectionStore } from "../store/useCollectionStore";
import { useFetchDetails } from "../hooks/useFetchDetails";

// Компоненты UI
import { HeroSection } from "../components/DetailsScreen/HeroSection";
import StatusModal from "../components/DetailsScreen/StatusModal";
import { useDetailsData } from "../hooks/useDetailsData";
import { useEditForm } from "../hooks/useEditForm";
import { ContentSection } from "../components/DetailsScreen/ContentSection";
import { EditSection } from "../components/DetailsScreen/EditSection";

const COLLECTION_ICON = {
    active: require("../assets/icons/collection(active).png"),
    inactive: require("../assets/icons/collection(inactive).png"),
};

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category } = route.params;
    const { data: fullDetails, loading } = useFetchDetails(item.id);

    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { myCollection, addToCollection, updateCard, removeFromCollection } =
        useCollectionStore();
    const savedItem = myCollection.find(
        (fav) => String(fav.id) === String(item.id),
    );

    const displayData = useDetailsData(item, fullDetails, savedItem);
    const [editForm, setEditForm] = useEditForm(isEditing, displayData);

    const isInCollection = !!savedItem;
    const isCustom = item.isCustom || savedItem?.isCustom;

    // Сохранение изменений
    const handleSave = () => {
        const prepareList = (str) =>
            str
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        updateCard(item.id, {
            ...editForm,
            genres: prepareList(editForm.genres),
            countries: prepareList(editForm.countries),
        });
        setIsEditing(false);
    };

    // Изменение статуса (просмотрено, в планах и т.д.)
    const handleStatusUpdate = (newStatus) => {
        if (isInCollection) {
            updateCard(item.id, { status: newStatus });
        } else {
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
                            <EditSection
                                form={editForm}
                                setForm={setEditForm}
                                onSave={handleSave}
                                onCancel={() => setIsEditing(false)}
                            />
                        ) : (
                            <ContentSection
                                displayData={displayData}
                                savedItem={savedItem}
                                isCustom={isCustom}
                                isInCollection={isInCollection}
                                onStatusPress={() => setModalVisible(true)}
                                onEditPress={() => setIsEditing(true)}
                                onUpdateNotes={(text) =>
                                    updateCard(item.id, { userNotes: text })
                                }
                            />
                        )}
                    </>
                )}
            </View>

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
