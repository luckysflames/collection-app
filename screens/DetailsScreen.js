import React, { useMemo, useState } from "react";
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronLeft, Folder, Pen, Star, X } from "lucide-react-native";

// Hooks
import { useFetchDetails } from "../hooks/useFetchDetails";
import { useDetailsData } from "../hooks/useDetailsData";
import { useEditForm } from "../hooks/useEditForm";
import { useDetailsActions } from "../hooks/useDetailsActions";
import { useCollectionStore } from "../store/useCollectionStore";

// Components
import { BaseHeroLayout } from "../components/ui/BaseHeroLayout";
import StatusModal from "../components/shared/StatusModal";
import { ContentSection } from "../components/screens/Details/ContentSection";
import { EditSection } from "../components/screens/Details/EditSection";
import FolderSelectModal from "../components/screens/Details/Modals/FolderSelectModal";
import { DetailsPoster } from "../components/screens/Details/DetailsPoster";
import { HeroPoster } from "../components/ui/HeroPoster";
import { useImagePicker } from "../hooks/useImagePicker";
import { WarnModal } from "../components/ui/WarnModal";

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category } = route.params;
    const { pickImage } = useImagePicker();

    // Состояния модалок и режима редактирования
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isFolderModalVisible, setFolderModalVisible] = useState(false);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);

    // Данные из API и стора
    const { data: fullDetails, loading } = useFetchDetails(item.id);
    const myCollection = useCollectionStore((state) => state.myCollection);
    const setUserScore = useCollectionStore((state) => state.setUserScore); // Достаем метод

    // Подготовка данных для отображения
    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
    );

    const displayData = useDetailsData(item, fullDetails, initialSavedItem);

    // Действия (удаление, обновление, папки)
    const {
        savedItem,
        isInCollection,
        existingFolders,
        handleAddToFolder,
        handleStatusUpdate,
        handleToggleFavorite,
        updateCard,
        deleteCard, // Используем имя из стора через хук
    } = useDetailsActions(item, displayData, category);

    const isFavorite = !!savedItem?.isFavorite;

    // Форма редактирования
    const [editForm, updateField] = useEditForm(isEditing, {
        ...displayData,
        status: displayData.status || savedItem?.status || "",
    });

    const handleSave = (finalData) => {
        updateCard(item.id, finalData);
        setIsEditing(false);
    };

    // Логика отображения папок
    const parentFolders = useMemo(() => {
        const ids = savedItem?.parentFolderIds || [];
        return myCollection.filter((f) => ids.includes(f.id));
    }, [savedItem?.parentFolderIds, myCollection]);

    const folderLabel = useMemo(() => {
        if (parentFolders.length === 0) return "Добавить в папку";
        if (parentFolders.length === 1) return parentFolders[0].title;
        return `В папках: ${parentFolders.length}`;
    }, [parentFolders]);

    // Функция-обертка для экрана деталей
    const handlePickImage = async () => {
        const uri = await pickImage([240, 340]); // передаем нужные пропорции
        if (uri) {
            updateField("image", uri);
        }
    };

    const isAnyFolderSelected = parentFolders.length > 0;

    return (
        <ScrollView style={styles.container} bounces={false}>
            <BaseHeroLayout
                image={editForm.image || item.image}
                insets={insets}
                leftButton={{
                    onPress: isEditing
                        ? () => setIsEditing(false)
                        : () => navigation.goBack(),
                    icon: isEditing ? (
                        <X size={24} color="#fff" />
                    ) : (
                        <ChevronLeft size={24} color="#fff" />
                    ),
                    style: isEditing
                        ? { backgroundColor: "rgba(255, 79, 79, 0.2)" }
                        : {},
                }}
                // Правая кнопка: отображается, если айтем кастомный
                rightButton={
                    item?.isCustom || savedItem?.isCustom
                        ? {
                              onPress: isEditing
                                  ? () => handleSave(editForm)
                                  : () => setIsEditing(true),
                              icon: isEditing ? (
                                  <Check size={24} color="#fff" />
                              ) : (
                                  <Pen size={22} color="#fff" />
                              ),
                              style: isEditing
                                  ? { backgroundColor: "#7D8AFF" }
                                  : {},
                          }
                        : null
                }
            >
                <HeroPoster
                    image={editForm.image || item.image}
                    isEditing={isEditing}
                    onPickImage={handlePickImage}
                />
            </BaseHeroLayout>

            <View style={styles.infoContainer}>
                {loading && !fullDetails && !savedItem ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#7D8AFF" />
                    </View>
                ) : isEditing ? (
                    <EditSection
                        form={editForm}
                        updateField={updateField}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                    />
                ) : (
                    <ContentSection
                        displayData={displayData}
                        savedItem={savedItem}
                        isInCollection={isInCollection}
                        isFavorite={isFavorite}
                        folderLabel={folderLabel}
                        isAnyFolderSelected={isAnyFolderSelected}
                        onStatusPress={() => setStatusModalVisible(true)}
                        onFolderPress={() => setFolderModalVisible(true)}
                        onToggleFavorite={handleToggleFavorite}
                        onUpdateNotes={(text) =>
                            updateCard(item.id, { userNotes: text })
                        }
                        onSetScore={(score) => setUserScore(item.id, score)}
                        onInfoPress={() => setInfoModalVisible(true)}
                    />
                )}
            </View>

            <WarnModal
                visible={isInfoModalVisible}
                title="О личной оценке"
                message="Эта оценка видна только вам. Она помогает структурировать вашу личную коллекцию и никак не влияет на глобальный рейтинг произведения."
                type="info"
                onClose={() => setInfoModalVisible(false)}
            />

            {/* Модалка выбора папок */}
            <FolderSelectModal
                visible={isFolderModalVisible}
                folders={existingFolders}
                selectedFolderIds={savedItem?.parentFolderIds || []}
                onClose={() => setFolderModalVisible(false)}
                onSelect={handleAddToFolder}
                onCreateNew={() => setFolderModalVisible(false)}
            />

            {/* Модалка статуса и удаления */}
            <StatusModal
                visible={isStatusModalVisible}
                category={category || "Фильмы"}
                onClose={() => setStatusModalVisible(false)}
                onSelect={handleStatusUpdate}
                currentStatus={savedItem?.status}
                removeCard={() => {
                    deleteCard(item.id);
                    navigation.goBack();
                }}
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
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
    loaderContainer: {
        paddingVertical: 50,
        alignItems: "center",
    },
    addToFolderBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginBottom: 15,
    },
    favoriteBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 18,
        gap: 8,
    },
    favoriteBtnActive: {
        backgroundColor: "rgba(255,215,0,0.12)",
    },
    favoriteBtnText: {
        color: "#8E94A4",
        marginLeft: 4,
        fontSize: 13,
        fontWeight: "600",
    },
    folderBtnText: {
        color: "#8E94A4",
        marginLeft: 8,
        fontSize: 13,
        fontWeight: "600",
    },
});
