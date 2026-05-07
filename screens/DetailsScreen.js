import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
    View,
    StyleSheet,
    Platform,
    Vibration,
    BackHandler,
    InteractionManager,
} from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Hooks
import { useFetchDetails } from "../hooks/useFetchDetails";
import { useDetailsData } from "../hooks/useDetailsData";
import { useEditForm } from "../hooks/useEditForm";
import { useDetailsActions } from "../hooks/useDetailsActions";
import { useCollectionStore } from "../store/useCollectionStore";
import { useDetailsModals } from "../hooks/useDetailsModals";
import { useImagePicker } from "../hooks/useImagePicker";

// Components
import { ContentSection } from "../components/screens/Details/ContentSection";
import { EditSection } from "../components/screens/Details/Edit/EditSection";
import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { DetailsModals } from "../components/screens/Details/Modals/DetailsModals";
import { DetailsSkeleton } from "../components/screens/Details/DetailsSkeleton";

// Utils & Services
import { prepareDataForSave } from "../utils/prepareDetailsData";
import { fetchDetailsById } from "../services/apiService";
import { WarnModal } from "../components/ui/WarnModal";

// --- КОНФИГУРАЦИЯ ЗАДЕРЖЕК (Калибруй здесь) ---
const DATA_LOAD_DELAY = 300; // Через сколько мс начать инициализацию логики и запросы
const SKELETON_FADE_DELAY = 600; // Через сколько мс убрать скелет (когда всё уже точно готово)

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { item, category } = route.params;
    const { pickImage } = useImagePicker();

    // Состояния для калибровки
    const [isLogicReady, setIsLogicReady] = useState(false);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);

    const [errorModal, setErrorModal] = useState({
        visible: false,
        message: "",
    });

    // === ОПТИМИЗАЦИЯ: Используем InteractionManager для отложения инициализации ===
    useEffect(() => {
        // InteractionManager задерживает инициализацию до завершения всех анимаций переходов
        // Это означает что переход на экран будет плавным, а затем начнется загрузка данных
        const interactionTask = InteractionManager.runAfterInteractions(() => {
            const logicTimer = setTimeout(() => {
                setIsLogicReady(true);
            }, DATA_LOAD_DELAY);

            const animationTimer = setTimeout(() => {
                setIsAnimationFinished(true);
            }, SKELETON_FADE_DELAY);

            return () => {
                clearTimeout(logicTimer);
                clearTimeout(animationTimer);
            };
        });

        return () => interactionTask.cancel();
    }, []);

    // 1. Store (Всегда в начале, но используем осторожно)
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const isVibration = useCollectionStore((state) => state.isVibration);
    const setRaining = useCollectionStore((state) => state.setRaining);

    // 2. Data Fetching & Preparation
    // Передаем null в id, пока логика не готова, чтобы хук не начинал fetch мгновенно
    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
    );

    const { data: fullDetails, loading } = useFetchDetails(
        !isLogicReady || initialSavedItem ? null : item.id,
    );

    const displayData = useDetailsData(item, fullDetails, initialSavedItem);

    // 3. Logic Hooks
    const {
        savedItem,
        isInCollection,
        existingFolders,
        handleAddToFolder,
        handleStatusUpdate,
        handleToggleFavorite,
        updateCard,
        deleteCard,
        refreshCardDetails,
        isRefreshing,
    } = useDetailsActions(item, displayData, category);

    const { modals, openModal, modalActions } = useDetailsModals(
        category,
        createFolder,
    );

    // 4. Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, updateField] = useEditForm(isEditing, {
        ...displayData,
        status: displayData.status || savedItem?.status || "",
    });

    const cardType = item.type || savedItem?.type || category;
    const isBrilliant = savedItem?.isBrilliant || false;
    const isPeak = savedItem?.userScore === 10 || isBrilliant;

    // 5. Handlers (оптимизируем с useCallback для избежания ненужных ре-рендеров)
    const onSaveAction = useCallback(() => {
        const finalData = prepareDataForSave(editForm, cardType);
        updateCard(item.id, finalData);
        setIsEditing(false);
    }, [editForm, cardType, updateCard, item.id]);

    const handleNavigateToDetails = useCallback(
        (newItem) => {
            navigation.push("Details", {
                item: newItem,
                category: category,
            });
        },
        [navigation, category],
    );

    const handleRefresh = useCallback(async () => {
        try {
            await refreshCardDetails(item, fetchDetailsById);
        } catch (error) {
            setErrorModal({
                visible: true,
                message:
                    "Не удалось получить свежие данные. Проверьте соединение.",
            });
        }
    }, [item, refreshCardDetails]);

    const handleToggleBrilliant = useCallback(() => {
        const newIsBrilliant = !isBrilliant;
        updateCard(item.id, { isBrilliant: newIsBrilliant });
        setRaining(newIsBrilliant);
    }, [isBrilliant, updateCard, item.id, setRaining]);

    const handleScoreWithHaptics = useCallback(
        (score) => {
            setUserScore(item.id, score);
            if (isVibration && score !== 0) {
                if (Platform.OS === "android") {
                    const pattern = [0, 0];
                    for (let i = 0; i < score; i++) {
                        pattern.push(30, 100);
                    }
                    Vibration.vibrate(pattern);
                } else {
                    Vibration.vibrate(10);
                }
            }
        },
        [item.id, isVibration, setUserScore],
    );

    // 6. UI Helpers
    const parentFolders = useMemo(() => {
        const ids = savedItem?.parentFolderIds || [];
        return myCollection.filter((f) => ids.includes(f.id));
    }, [savedItem?.parentFolderIds, myCollection]);

    const folderLabel = useMemo(() => {
        if (parentFolders.length === 0) return "Добавить в папку";
        if (parentFolders.length === 1) return parentFolders[0].title;
        return `В папках: ${parentFolders.length}`;
    }, [parentFolders]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isEditing) {
                    setIsEditing(false);
                    return true;
                }
                return false;
            };
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress,
            );
            return () => subscription.remove();
        }, [isEditing]),
    );

    useEffect(() => {
        if (isLogicReady) {
            setRaining(item.id, isFocused && isBrilliant);
        }
    }, [isFocused, isBrilliant, item.id, setRaining, isLogicReady]);

    // Определяем, показывать ли скелет
    // Мы показываем его, если время анимации не вышло ИЛИ если данные еще реально грузятся
    const showSkeleton =
        !isAnimationFinished || (loading && !fullDetails && !savedItem);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                extraScrollHeight={200}
                scrollEventThrottle={16}
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
            >
                <HeaderSection
                    isEditing={isEditing}
                    image={
                        isEditing
                            ? editForm.image
                            : displayData.image || item.image
                    }
                    insets={insets}
                    onLeftPress={
                        isEditing
                            ? () => setIsEditing(false)
                            : () => navigation.goBack()
                    }
                    onRightPress={
                        isEditing
                            ? onSaveAction
                            : isInCollection && savedItem?.isCustom
                              ? () => setIsEditing(true)
                              : isInCollection && !savedItem?.isCustom
                                ? handleRefresh
                                : undefined
                    }
                    onPickImage={async () => {
                        const uri = await pickImage([240, 340]);
                        if (uri) updateField("image", uri);
                    }}
                    showEditButton={
                        !showSkeleton && isInCollection && savedItem?.isCustom
                    }
                    showRefreshButton={
                        !showSkeleton && isInCollection && !savedItem?.isCustom
                    }
                    isRefreshing={isRefreshing}
                    isBrilliant={isBrilliant}
                    onBrilliantPress={handleToggleBrilliant}
                    showBrilliantBtn={isPeak}
                />

                <View style={styles.infoContainer}>
                    {showSkeleton ? (
                        <DetailsSkeleton />
                    ) : isEditing ? (
                        <EditSection
                            form={editForm}
                            updateField={updateField}
                            type={cardType}
                            onSave={onSaveAction}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <ContentSection
                            displayData={displayData}
                            savedItem={savedItem}
                            isInCollection={isInCollection}
                            isFavorite={!!savedItem?.isFavorite}
                            folderLabel={folderLabel}
                            isAnyFolderSelected={parentFolders.length > 0}
                            onStatusPress={() => openModal("status")}
                            onFolderPress={() => openModal("folder")}
                            onInfoPress={() => openModal("info")}
                            onToggleFavorite={handleToggleFavorite}
                            onUpdateNotes={(text) =>
                                updateCard(item.id, { userNotes: text })
                            }
                            onSetScore={handleScoreWithHaptics}
                            onNavigateToDetails={handleNavigateToDetails}
                        />
                    )}
                </View>
            </KeyboardAwareScrollView>

            <DetailsModals
                state={{
                    isStatusVisible: modals.status,
                    isFolderVisible: modals.folder,
                    isInfoVisible: modals.info,
                    isCreateFolderVisible: modals.createFolder,
                }}
                actions={modalActions}
                data={{
                    category,
                    existingFolders,
                    parentFolderIds: savedItem?.parentFolderIds || [],
                    currentStatus: savedItem?.status,
                }}
                handlers={{
                    handleAddToFolder,
                    handleStatusUpdate,
                    handleCreateFolder: modalActions.handleCreateFolder,
                    handleDelete: () => {
                        deleteCard(item.id);
                        navigation.goBack();
                    },
                }}
            />

            <WarnModal
                visible={errorModal.visible}
                type="error"
                message={errorModal.message}
                onClose={() => setErrorModal({ ...errorModal, visible: false })}
            />
        </View>
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
});
