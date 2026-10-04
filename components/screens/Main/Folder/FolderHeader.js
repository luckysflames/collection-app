import React, { memo, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { ChevronLeft, Check, Pen, X } from "lucide-react-native";
import LottieView from "lottie-react-native";

import { BaseHeroLayout } from "../../../layout/BaseHeroLayout";
import { FolderEditForm } from "./FolderEditForm";
import { FolderInfo } from "./FolderInfo";
import { HeroPoster } from "../../../ui/HeroPoster";
import { useTheme } from "../../../../hooks/useTheme";

export const FolderHeader = memo((props) => {
    const {
        insets,
        toggleFavorite,
        displayImage,
        isEditing,
        setIsEditing,
        onSave,
        onCancel,
        onBack,
        pickImage,
        folder,
        folderItems,
        editForm,
        updateField,
        onRatingUpdate,
        onDeletePress,
        isReordering,
        onToggleReorder,
        onStatusPress,
        onAddPress,
        onSortPress,
        onInfoPress,
        showBrilliantBtn,
        isBrilliant,
        onBrilliantPress,
        isFocused,
        sortType,
        onPressPoster,
    } = props;

    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const headerLottieRef = useRef(null);

    useEffect(() => {
        if (isBrilliant && isFocused) {
            headerLottieRef.current?.play();
        } else {
            headerLottieRef.current?.pause();
        }
    }, [isFocused, isBrilliant]);

    return (
        <BaseHeroLayout
            image={displayImage}
            insets={insets}
            leftButton={{
                onPress: isEditing ? onCancel : onBack,
                icon: isEditing ? (
                    <X size={24} color={theme.red} />
                ) : (
                    <ChevronLeft size={24} color={theme.text} />
                ),
            }}
            centerButton={
                showBrilliantBtn
                    ? {
                          unstyled: true,
                          style: styles.lottieContainer,
                          onPress: onBrilliantPress,
                          icon: (
                              <LottieView
                                  ref={headerLottieRef}
                                  source={require("../../../../assets/diamond.json")}
                                  style={styles.headerLottie}
                                  autoPlay={isFocused && isBrilliant}
                                  loop={true}
                                  resizeMode="contain"
                              />
                          ),
                      }
                    : null
            }
            rightButton={{
                onPress: () => (isEditing ? onSave() : setIsEditing(true)),
                icon: isEditing ? (
                    <Check size={24} color={theme.accent} />
                ) : (
                    <Pen size={22} color={theme.text} />
                ),
            }}
        >
            <View style={styles.container}>
                <HeroPoster
                    image={displayImage}
                    isEditing={isEditing}
                    onPickImage={pickImage}
                    onPressPoster={onPressPoster}
                />

                <View style={styles.contentWrapper}>
                    {isEditing ? (
                        <FolderEditForm
                            form={editForm}
                            disableReorder={folderItems.length < 2}
                            updateField={updateField}
                            onDelete={onDeletePress}
                            isReordering={isReordering}
                            onToggleReorder={onToggleReorder}
                        />
                    ) : (
                        <FolderInfo
                            folder={folder}
                            count={folderItems.length}
                            toggleFavorite={toggleFavorite}
                            onStatusPress={onStatusPress}
                            onAddPress={onAddPress}
                            onSortPress={onSortPress}
                            folderItems={folderItems}
                            onRatingUpdate={onRatingUpdate}
                            onInfoPress={onInfoPress}
                            isBrilliant={isBrilliant}
                            onBrilliantPress={onBrilliantPress}
                            sortType={sortType}
                        />
                    )}
                </View>
            </View>
        </BaseHeroLayout>
    );
});

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            width: "100%",
            alignItems: "center",
        },
        contentWrapper: {
            width: "100%",
            marginTop: 10,
        },
        lottieContainer: {
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -15,
            justifyContent: "center",
            alignItems: "center",
        },
        headerLottie: {
            width: "100%",
            height: "100%",
        },
    });
