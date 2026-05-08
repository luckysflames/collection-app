import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
    View,
    StyleSheet,
    Platform,
    Vibration,
    InteractionManager,
    ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useFetchDetails } from "../hooks/useFetchDetails";
import { useDetailsData } from "../hooks/useDetailsData";
import { useDetailsActions } from "../hooks/useDetailsActions";
import { useCollectionStore } from "../store/useCollectionStore";
import { useDetailsModals } from "../hooks/useDetailsModals";

// Components
import { ContentSection } from "../components/screens/Details/ContentSection";
import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { DetailsModals } from "../components/screens/Details/Modals/DetailsModals";
import { DetailsSkeleton } from "../components/screens/Details/DetailsSkeleton";

// Utils & Services
import { fetchDetailsById } from "../services/apiService";
import { WarnModal } from "../components/ui/WarnModal";

const DATA_LOAD_DELAY = 300;
const SKELETON_FADE_DELAY = 600;

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { item, category } = route.params;

    const [isLogicReady, setIsLogicReady] = useState(false);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        message: "",
    });

    // Оптимизация входа на экран
    useEffect(() => {
        const interactionTask = InteractionManager.runAfterInteractions(() => {
            const logicTimer = setTimeout(
                () => setIsLogicReady(true),
                DATA_LOAD_DELAY,
            );
            const animationTimer = setTimeout(
                () => setIsAnimationFinished(true),
                SKELETON_FADE_DELAY,
            );

            return () => {
                clearTimeout(logicTimer);
                clearTimeout(animationTimer);
            };
        });
        return () => interactionTask.cancel();
    }, []);

    // Store
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const isVibration = useCollectionStore((state) => state.isVibration);
    const setRaining = useCollectionStore((state) => state.setRaining);

    // Data Fetching
    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
    );

    const { data: fullDetails, loading } = useFetchDetails(
        !isLogicReady || initialSavedItem ? null : item.id,
    );

    const displayData = useDetailsData(item, fullDetails, initialSavedItem);

    // Actions Logic
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

    const isBrilliant = savedItem?.isBrilliant || false;
    const isPeak = savedItem?.userScore === 10 || isBrilliant;

    // Handlers
    const handleEditPress = useCallback(() => {
        navigation.navigate("EditCard", {
            item,
            category,
            displayData,
        });
    }, [navigation, item, category, displayData]);

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
                    for (let i = 0; i < score; i++) pattern.push(30, 100);
                    Vibration.vibrate(pattern);
                } else {
                    Vibration.vibrate(10);
                }
            }
        },
        [item.id, isVibration, setUserScore],
    );

    const parentFolders = useMemo(() => {
        const ids = savedItem?.parentFolderIds || [];
        return myCollection.filter((f) => ids.includes(f.id));
    }, [savedItem?.parentFolderIds, myCollection]);

    const folderLabel = useMemo(() => {
        if (parentFolders.length === 0) return "Добавить в папку";
        if (parentFolders.length === 1) return parentFolders[0].title;
        return `В папках: ${parentFolders.length}`;
    }, [parentFolders]);

    useEffect(() => {
        if (isLogicReady) {
            setRaining(item.id, isFocused && isBrilliant);
        }
    }, [isFocused, isBrilliant, item.id, setRaining, isLogicReady]);

    const showSkeleton =
        !isAnimationFinished || (loading && !fullDetails && !savedItem);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={true}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
            >
                <HeaderSection
                    isEditing={false}
                    image={displayData.image || item.image}
                    insets={insets}
                    onLeftPress={() => navigation.goBack()}
                    onRightPress={
                        isInCollection && savedItem?.isCustom
                            ? handleEditPress
                            : isInCollection && !savedItem?.isCustom
                              ? handleRefresh
                              : undefined
                    }
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
                            onNavigateToDetails={(newItem) =>
                                navigation.push("Details", {
                                    item: newItem,
                                    category,
                                })
                            }
                        />
                    )}
                </View>
            </ScrollView>

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
    container: { flex: 1, backgroundColor: "#050B18" },
    infoContainer: {
        padding: 20,
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
});
