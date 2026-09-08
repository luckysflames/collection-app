import React, { useMemo, useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Vibration, ScrollView, KeyboardAvoidingView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Hooks
import { useFetchDetails } from "../hooks/useFetchDetails";
import { useDetailsData } from "../hooks/useDetailsData";
import { useDetailsActions } from "../hooks/useDetailsActions";
import { useCollectionStore } from "../store/useCollectionStore";
import { useDetailsModals } from "../hooks/useDetailsModals";
import { useTheme } from "../hooks/useTheme";

// Components
import { ContentSection } from "../components/screens/Details/ContentSection";
import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { DetailsModals } from "../components/screens/Details/Modals/DetailsModals";
import { DetailsSkeleton } from "../components/screens/Details/DetailsSkeleton";

// Utils, Services & UI
import { fetchDetailsById } from "../services/index";
import { WarnModal } from "../components/ui/WarnModal";
import { ImageModal } from "../components/shared/Modals/ImageModal";
import { StudioModal } from "../components/screens/Details/Modals/StudioModal";

const DATA_LOAD_DELAY = 300;
const SKELETON_FADE_DELAY = 600;

export default function DetailsScreen({ route, navigation }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const { item, category } = route.params;

    const [isLogicReady, setIsLogicReady] = useState(false);
    const [isAnimationFinished, setIsAnimationFinished] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [isStudioModalVisible, setIsStudioModalVisible] = useState(false);
    const [errorModal, setErrorModal] = useState({
        visible: false,
        message: "",
    });

    useEffect(() => {
        let idleHandle = null;
        let logicTimer = null;
        let animationTimer = null;

        const startTimers = () => {
            logicTimer = setTimeout(() => setIsLogicReady(true), DATA_LOAD_DELAY);
            animationTimer = setTimeout(() => setIsAnimationFinished(true), SKELETON_FADE_DELAY);
        };

        if (typeof requestIdleCallback !== "undefined") {
            idleHandle = requestIdleCallback(startTimers);
        } else {
            startTimers();
        }

        return () => {
            if (idleHandle && typeof cancelIdleCallback !== "undefined") {
                cancelIdleCallback(idleHandle);
            }
            if (logicTimer) clearTimeout(logicTimer);
            if (animationTimer) clearTimeout(animationTimer);
        };
    }, []);

    // Store
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const isVibration = useCollectionStore((state) => state.isVibration);

    // Data Fetching
    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
    );

    const { data: fullDetails, loading } = useFetchDetails(
        isDeleting || !isLogicReady || initialSavedItem ? null : item.id,
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

    const { modals, openModal, modalActions } = useDetailsModals(category, createFolder);

    const isBrilliant = savedItem?.isBrilliant || false;

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
                message: "Не удалось получить свежие данные. Проверьте соединение.",
            });
        }
    }, [item, refreshCardDetails]);

    const handleToggleBrilliant = useCallback(() => {
        const newIsBrilliant = !isBrilliant;
        updateCard(item.id, { isBrilliant: newIsBrilliant });
    }, [isBrilliant, updateCard, item.id]);

    const handleScoreWithHaptics = useCallback(
        (score) => {
            setUserScore(item.id, score);

            if (score !== 10 && isBrilliant) {
                updateCard(item.id, { isBrilliant: false });
            }

            if (isVibration && score !== 0) {
                const pattern = [0, 0];
                for (let i = 0; i < score; i++) pattern.push(30, 100);
                Vibration.vibrate(pattern);
            }
        },
        [item.id, isVibration, setUserScore, isBrilliant, updateCard],
    );

    const handleSelectStudio = useCallback(
        (studio) => {
            updateCard(item.id, { selectedStudio: studio });
        },
        [updateCard, item.id],
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

    const showSkeleton = !isAnimationFinished || (loading && !fullDetails && !savedItem);
    const posterImage = displayData.image || item.image;

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={true}
                    scrollEventThrottle={16}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                >
                    <HeaderSection
                        isEditing={false}
                        image={posterImage}
                        insets={insets}
                        onLeftPress={() => navigation.goBack()}
                        onRightPress={
                            isInCollection && savedItem?.isCustom
                                ? handleEditPress
                                : isInCollection && !savedItem?.isCustom
                                  ? handleRefresh
                                  : undefined
                        }
                        showEditButton={!showSkeleton && isInCollection && savedItem?.isCustom}
                        showRefreshButton={!showSkeleton && isInCollection && !savedItem?.isCustom}
                        isRefreshing={isRefreshing}
                        isBrilliant={isBrilliant}
                        isFocused={isFocused}
                        onPressPoster={() => setIsImageModalVisible(true)}
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
                                isBrilliant={isBrilliant}
                                onToggleBrilliant={handleToggleBrilliant}
                                isFocused={isFocused}
                                onStatusPress={() => openModal("status")}
                                onStudioPress={() => setIsStudioModalVisible(true)}
                                onFolderPress={() => openModal("folder")}
                                onInfoPress={() => openModal("info")}
                                onToggleFavorite={handleToggleFavorite}
                                onUpdateNotes={(text) => updateCard(item.id, { userNotes: text })}
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
                    <View
                        style={{
                            height: isCompactMenu ? insets.bottom + 160 : insets.bottom + 190,
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

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
                        setIsDeleting(true);
                        navigation.goBack();
                        setTimeout(() => {
                            deleteCard(item.id);
                        }, 400);
                    },
                }}
            />

            <ImageModal
                visible={isImageModalVisible}
                images={posterImage ? [posterImage] : []}
                initialIndex={0}
                onClose={() => setIsImageModalVisible(false)}
            />

            <StudioModal
                visible={isStudioModalVisible}
                onClose={() => setIsStudioModalVisible(false)}
                studios={displayData.studiosDubSub || []}
                selectedStudio={savedItem?.selectedStudio}
                onSelectStudio={handleSelectStudio}
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

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.dark,
        },
        infoContainer: {
            padding: 20,
            backgroundColor: theme.dark,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight: 500,
        },
    });
