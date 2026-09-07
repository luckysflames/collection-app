import React, { useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useEditForm } from "../hooks/useEditForm";
import { useCollectionStore } from "../store/useCollectionStore";
import { useImagePicker } from "../hooks/useImagePicker";
import { prepareDataForSave } from "../utils/prepareDetailsData";

import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { EditSection } from "../components/screens/Details/Edit/EditSection";
import { useTheme } from "../hooks/useTheme";

export default function EditCardScreen({ route, navigation }) {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const { item, category, displayData } = route.params;
    const { pickImage } = useImagePicker();

    const updateCard = useCollectionStore((state) => state.updateCard);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    const [editForm, updateField] = useEditForm(true, {
        ...displayData,
        status: displayData.status || item?.status || "",
    });

    const onSave = useCallback(() => {
        const cardType = item.type || category;
        const finalData = prepareDataForSave(editForm, cardType);
        updateCard(item.id, finalData);
        navigation.goBack();
    }, [editForm, item, category, navigation, updateCard]);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scroll}
                contentContainerStyle={[{ paddingBottom: insets.bottom + 20, flexGrow: 1 }]}
                enableOnAndroid={true}
                extraScrollHeight={200}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <HeaderSection
                    isEditing={true}
                    image={editForm.image}
                    insets={insets}
                    showEditButton={true}
                    onLeftPress={() => navigation.goBack()}
                    onRightPress={onSave}
                    onPickImage={async () => {
                        const uri = await pickImage([12, 17], editForm.image, item.id);
                        if (uri) updateField("image", uri);
                    }}
                />
                <View style={styles.infoContainer}>
                    <EditSection
                        form={editForm}
                        updateField={updateField}
                        type={item.type || category}
                        onSave={onSave}
                        onCancel={() => navigation.goBack()}
                    />
                </View>

                <View
                    style={{
                        height: isCompactMenu ? insets.bottom + 100 : insets.bottom + 130,
                    }}
                />
            </KeyboardAwareScrollView>
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.dark },
        infoContainer: {
            padding: 20,
            backgroundColor: theme.dark,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            minHeight: 500,
        },
        scroll: { flex: 1 },
    });
