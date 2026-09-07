import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// --- ИМПОРТ КОНСТАНТ ---
import { getOrderedCategories, SECTIONS, STATUS_SELECTION_EXCLUDE } from "../constants/index";

import MovieFields from "../components/screens/AddCard/Fields/MovieFields";
import TVFields from "../components/screens/AddCard/Fields/TVFields";
import AnimeFields from "../components/screens/AddCard/Fields/AnimeFields";
import BookFields from "../components/screens/AddCard/Fields/BookFields";
import GameFields from "../components/screens/AddCard/Fields/GameFields";
import CommonField from "../components/screens/AddCard/Fields/CommonField";
import ImageUploader from "../components/shared/ImageUploader";
import SectionSelector from "../components/screens/AddCard/SectionSelector";
import StatusPicker from "../components/screens/AddCard/StatusPicker";
import { useAddCardForm } from "../hooks/useAddCardForm";
import { useMediaCategories } from "../hooks/useMediaCategories";
import { WarnModal } from "../components/ui/WarnModal";
import { useCollectionStore } from "../store/useCollectionStore";
import { useImagePicker } from "../hooks/useImagePicker";
import { useShallow } from "zustand/shallow";
import MaskedDateInput from "../components/screens/AddCard/Fields/MaskedDateInput";
import { useTheme } from "../hooks/useTheme";

const CollapsibleHeader = ({ title, isOpen, onPress, styles, theme }) => (
    <TouchableOpacity style={styles.collapsibleHeader} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.label}>{title}</Text>
        {isOpen ? (
            <ChevronUp size={20} color={theme.text} />
        ) : (
            <ChevronDown size={20} color={theme.text} />
        )}
    </TouchableOpacity>
);

export default function AddCardScreen({ navigation }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const categoryOrder = useCollectionStore((state) => state.categoryOrder);

    const [isStatusVisible, setIsStatusVisible] = useState(false);
    const [isOptionalVisible, setIsOptionalVisible] = useState(false);

    const lastCategoryType =
        categoryOrder && categoryOrder.length > 0 ? categoryOrder[categoryOrder.length - 1] : null;

    const orderedSections = useCollectionStore(
        useShallow((state) => getOrderedCategories(state.categoryOrder)),
    );

    const { form, updateField, handleSave, errorModal, closeError } = useAddCardForm(
        navigation,
        lastCategoryType,
    );
    const { pickImage } = useImagePicker();
    const { statuses } = useMediaCategories(form.type);
    const filteredStatuses = statuses.filter((s) => !STATUS_SELECTION_EXCLUDE.includes(s));

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: theme.dark }}
            contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top - 20 }]}
            extraScrollHeight={150}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.header}>Создать карточку</Text>

            <View style={styles.section}>
                <ImageUploader
                    image={form.image}
                    onImagePick={async () => {
                        const uri = await pickImage([12, 17], form.image);
                        if (uri) updateField("image", uri);
                    }}
                />
                <SectionSelector
                    sections={orderedSections}
                    currentType={form.type}
                    onSelect={(type) => updateField("type", type)}
                />
            </View>

            <View style={styles.section}>
                <CollapsibleHeader
                    title={`Статус в коллекции: ${form.status || "Выбрать"}`}
                    isOpen={isStatusVisible}
                    onPress={() => setIsStatusVisible(!isStatusVisible)}
                    styles={styles}
                    theme={theme}
                />

                {isStatusVisible && (
                    <View style={styles.collapsibleContent}>
                        <StatusPicker
                            categories={filteredStatuses}
                            currentStatus={form.status}
                            type={form.type}
                            onSelect={(status) => {
                                updateField("status", status);
                                setIsStatusVisible(false);
                            }}
                        />
                    </View>
                )}

                <CommonField
                    label="Название (обязательно)"
                    placeholder="Остров проклятых"
                    form={form}
                    updateField={updateField}
                    fieldName="title"
                />
            </View>

            <View style={styles.section}>
                <CollapsibleHeader
                    title="Дополнительная информация"
                    isOpen={isOptionalVisible}
                    onPress={() => setIsOptionalVisible(!isOptionalVisible)}
                    styles={styles}
                    theme={theme}
                />

                {isOptionalVisible && (
                    <View style={styles.collapsibleContent}>
                        {form.type !== "anime" && form.type !== "tv" && (
                            <MaskedDateInput
                                label="Дата выхода (дд.мм.гггг)"
                                placeholder="25.01.2026"
                                form={form}
                                updateField={updateField}
                                fieldName="year"
                            />
                        )}

                        {form.type === "movie" && (
                            <MovieFields form={form} updateField={updateField} />
                        )}
                        {form.type === "tv" && <TVFields form={form} updateField={updateField} />}
                        {form.type === "anime" && (
                            <AnimeFields form={form} updateField={updateField} />
                        )}
                        {form.type === "book" && (
                            <BookFields form={form} updateField={updateField} />
                        )}
                        {form.type === "game" && (
                            <GameFields form={form} updateField={updateField} />
                        )}

                        <CommonField
                            label="Жанры"
                            placeholder="Драма, Триллер..."
                            form={form}
                            updateField={updateField}
                            fieldName="genres"
                        />

                        <CommonField
                            label="Описание"
                            placeholder="О чем этот шедевр?"
                            form={form}
                            updateField={updateField}
                            fieldName="description"
                            multiline
                        />
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={[
                    styles.saveButton,
                    {
                        marginBottom: isCompactMenu ? insets.bottom + 120 : insets.bottom + 150,
                    },
                ]}
                onPress={() => handleSave(() => setIsOptionalVisible(false))}
            >
                <Text style={styles.saveButtonText}>Создать карточку</Text>
            </TouchableOpacity>

            <WarnModal
                visible={errorModal.visible}
                type="error"
                title="Ошибка заполнения"
                message={errorModal.message}
                onClose={closeError}
                confirmText="Исправить"
            />
        </KeyboardAwareScrollView>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        scrollContainer: {
            paddingHorizontal: 20,
            flexGrow: 1,
        },
        header: {
            color: theme.text,
            fontSize: 24,
            fontWeight: "800",
            marginTop: 7.5,
            marginBottom: 25,
            letterSpacing: -0.5,
        },
        section: {
            marginBottom: 20,
            gap: 20,
        },
        collapsibleHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.accentMuted,
            marginBottom: 15,
        },
        label: {
            color: theme.text,
            fontSize: 13,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
        },
        collapsibleContent: {
            marginTop: 5,
        },
        saveButton: {
            backgroundColor: theme.accent,
            padding: 18,
            borderRadius: 16,
            alignItems: "center",
            marginTop: 10,
        },
        saveButtonText: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "bold",
        },
    });
