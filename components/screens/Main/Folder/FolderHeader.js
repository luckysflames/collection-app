import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { ChevronLeft, Check, Pen, X, Gem } from "lucide-react-native";

import { BaseHeroLayout } from "../../../layout/BaseHeroLayout";
import { FolderEditForm } from "./FolderEditForm";
import { FolderInfo } from "./FolderInfo";
import { HeroPoster } from "../../../ui/HeroPoster";

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
    } = props;

    return (
        <BaseHeroLayout
            image={displayImage}
            insets={insets}
            leftButton={{
                onPress: isEditing ? onCancel : onBack,
                icon: isEditing ? (
                    <X size={24} color="#FF6B6B" />
                ) : (
                    <ChevronLeft size={24} color="#fff" />
                ),
            }}
            centerButton={
                showBrilliantBtn
                    ? {
                          onPress: onBrilliantPress,
                          icon: isBrilliant ? (
                              <Gem size={22} color="#7D8AFF" />
                          ) : (
                              <Gem size={22} color="#fff" />
                          ),
                      }
                    : null
            }
            rightButton={{
                onPress: () => (isEditing ? onSave() : setIsEditing(true)),
                icon: isEditing ? (
                    <Check size={24} color="#7D8AFF" />
                ) : (
                    <Pen size={22} color="#fff" />
                ),
            }}
        >
            {/* Обертка для всего внутреннего контента */}
            <View style={styles.container}>
                <HeroPoster
                    image={displayImage}
                    isEditing={isEditing}
                    onPickImage={pickImage}
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
                        />
                    )}
                </View>
            </View>
        </BaseHeroLayout>
    );
});

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
    },
    contentWrapper: {
        width: "100%",
        marginTop: 10, // Отступ между постером и текстом
    },
    saveButton: { backgroundColor: "#7D8AFF", borderRadius: 15 },
    cancelButton: {
        backgroundColor: "rgba(255, 79, 79, 0.8)",
        borderRadius: 15,
    },
});
