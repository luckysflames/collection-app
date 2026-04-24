import React from "react";
import { X, ChevronLeft, Check, Pen } from "lucide-react-native";
import { BaseHeroLayout } from "../../ui/BaseHeroLayout";
import { HeroPoster } from "../../ui/HeroPoster";

export const HeaderSection = ({
    isEditing,
    image,
    onLeftPress,
    onRightPress,
    onPickImage,
    insets,
    showEditButton,
}) => (
    <BaseHeroLayout
        image={image}
        insets={insets}
        leftButton={{
            onPress: onLeftPress,
            icon: isEditing ? (
                <X size={24} color="#FF6B6B" />
            ) : (
                <ChevronLeft size={24} color="#fff" />
            ),
        }}
        rightButton={
            showEditButton
                ? {
                      onPress: onRightPress,
                      icon: isEditing ? (
                          <Check size={24} color="#7D8AFF" />
                      ) : (
                          <Pen size={22} color="#fff" />
                      ),
                  }
                : null
        }
    >
        <HeroPoster
            image={image}
            isEditing={isEditing}
            onPickImage={onPickImage}
        />
    </BaseHeroLayout>
);
