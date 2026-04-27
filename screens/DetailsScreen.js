import React, { useMemo, useState } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
    Vibration,
} from "react-native";
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
import { EditSection } from "../components/screens/Details/EditSection";
import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { DetailsModals } from "../components/screens/Details/Modals/DetailsModals";

// Utils & Services
import { prepareDataForSave } from "../utils/prepareDetailsData";
import { fetchDetailsById } from "../services/apiService";

export default function DetailsScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category } = route.params;
    const { pickImage } = useImagePicker();

    // 1. Store
    const myCollection = useCollectionStore((state) => state.myCollection);
    const createFolder = useCollectionStore((state) => state.createFolder);
    const setUserScore = useCollectionStore((state) => state.setUserScore);
    const isVibration = useCollectionStore((state) => state.isVibration);

    // 2. Data Fetching & Preparation
    const { data: fullDetails, loading } = useFetchDetails(item.id);
    const initialSavedItem = useMemo(
        () => myCollection.find((fav) => String(fav.id) === String(item.id)),
        [myCollection, item.id],
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

    // 5. Handlers
    const onSaveAction = () => {
        const finalData = prepareDataForSave(editForm, cardType);
        updateCard(item.id, finalData);
        setIsEditing(false);
    };

    const handleRefresh = async () => {
        try {
            await refreshCardDetails(item, fetchDetailsById);
        } catch (error) {
            Alert.alert(
                "Ошибка обновления",
                "Не удалось получить свежие данные.",
            );
        }
    };

    const handleScoreWithHaptics = (score) => {
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
    };

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

    return (
        <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={{ flexGrow: 1 }}
            bounces={false}
            extraScrollHeight={200}
            scrollEventThrottle={16}
            enableOnAndroid={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
        >
            <HeaderSection
                isEditing={isEditing}
                image={editForm.image || item.image}
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
                showEditButton={isInCollection && savedItem?.isCustom}
                showRefreshButton={isInCollection && !savedItem?.isCustom}
                isRefreshing={isRefreshing}
            />

            <View style={styles.infoContainer}>
                {loading && !fullDetails && !savedItem ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#7D8AFF" />
                    </View>
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
                    />
                )}
            </View>

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
        </KeyboardAwareScrollView>
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
});
