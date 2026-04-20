import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { ChevronLeft, Check, Pen, X } from "lucide-react-native";

import { BaseHeroLayout } from "../../../ui/BaseHeroLayout";
import { FolderEditForm } from "./FolderEditForm";
import { FolderInfo } from "./FolderInfo";
import { HeroPoster } from "../../../ui/HeroPoster";

export const FolderHeader = memo((props) => {
    const {
        insets,
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
        onInfoPress,
    } = props;

    return (
        <BaseHeroLayout
            image={displayImage}
            insets={insets}
            leftButton={{
                onPress: isEditing ? onCancel : onBack,
                icon: isEditing ? (
                    <X size={24} color="#fff" />
                ) : (
                    <ChevronLeft size={24} color="#fff" />
                ),
                style: isEditing ? styles.cancelButton : {},
            }}
            rightButton={{
                onPress: () => (isEditing ? onSave() : setIsEditing(true)),
                icon: isEditing ? (
                    <Check size={24} color="#fff" />
                ) : (
                    <Pen size={22} color="#fff" />
                ),
                style: isEditing ? styles.saveButton : {},
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
                            updateField={updateField}
                            onDelete={onDeletePress}
                            isReordering={isReordering}
                            onToggleReorder={onToggleReorder}
                        />
                    ) : (
                        <FolderInfo
                            folder={folder}
                            count={folderItems.length}
                            onStatusPress={onStatusPress}
                            onAddPress={onAddPress}
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
