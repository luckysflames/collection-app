import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useEditForm } from "../hooks/useEditForm";
import { useCollectionStore } from "../store/useCollectionStore";
import { useImagePicker } from "../hooks/useImagePicker";
import { prepareDataForSave } from "../utils/prepareDetailsData";

import { HeaderSection } from "../components/screens/Details/HeaderSection";
import { EditForm } from "../components/screens/Details/Edit/EditForm";

export default function EditCardScreen({ route, navigation }) {
    const insets = useSafeAreaInsets();
    const { item, category, displayData } = route.params;
    const { pickImage } = useImagePicker();

    const updateCard = useCollectionStore((state) => state.updateCard);
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);

    // Инициализируем форму. Передаем true, так как мы всегда в режиме редактирования
    const [editForm, updateField] = useEditForm(true, {
        ...displayData,
        status: displayData.status || item?.status || "",
    });

    const onSave = useCallback(() => {
        const cardType = item.type || category;
        const finalData = prepareDataForSave(editForm, cardType);
        updateCard(item.id, finalData);
        navigation.goBack();
    }, [editForm, item, category, navigation]);

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={styles.scroll}
                contentContainerStyle={[{ paddingBottom: insets.bottom + 20, flexGrow: 1 }]}
                enableOnAndroid={true}
                extraScrollHeight={200}
                keyboardShouldPersistTaps="handled"
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
                    <EditForm
                        form={editForm}
                        updateField={updateField}
                        type={item.type || category}
                    />

                    <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                        <Text style={styles.saveButtonText}>Сохранить изменения</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.cancelButtonText}>Отмена</Text>
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    infoContainer: {
        padding: 20,
        backgroundColor: "#050B18",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: 500,
    },
    scroll: { flex: 1 },
    saveButton: {
        backgroundColor: "#7D8AFF",
        height: 58,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
    cancelButton: {
        height: 58,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: { color: "#8E94A4", fontSize: 16, fontWeight: "600" },
});
