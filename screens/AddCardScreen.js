import React, { useState } from "react";
import {
    Text,
    TouchableOpacity,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// --- ИМПОРТ КОНСТАНТ ---
// Теперь используем единый источник истины
import { SECTIONS, STATUS_SELECTION_EXCLUDE } from "../constants/index";

import MovieFields from "../components/screens/AddCard/Fields/MovieFields";
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

const CollapsibleHeader = ({ title, isOpen, onPress }) => (
    <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={styles.label}>{title}</Text>
        {isOpen ? (
            <ChevronUp size={20} color="#8E94A4" />
        ) : (
            <ChevronDown size={20} color="#8E94A4" />
        )}
    </TouchableOpacity>
);

export default function AddCardScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const isCompactMenu = useCollectionStore((state) => state.isCompactMenu);
    const [isOptionalVisible, setIsOptionalVisible] = useState(false);

    const { form, updateField, handleSave, errorModal, closeError } =
        useAddCardForm(navigation);
    const { pickImage } = useImagePicker();

    const currentSection = SECTIONS.find(
        (s) => (s.id || s.value) === form.type,
    );
    const sectionLabel =
        currentSection?.title || currentSection?.label || "Фильмы";

    const { statuses } = useMediaCategories(form.type);
    const filteredStatuses = statuses.filter(
        (s) => !STATUS_SELECTION_EXCLUDE.includes(s),
    );

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: "#050B18" }}
            contentContainerStyle={[
                styles.scrollContainer,
                {
                    paddingTop: insets.top - 20,
                },
            ]}
            extraScrollHeight={150}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.header}>Создать карточку</Text>

            <View style={styles.section}>
                <ImageUploader
                    image={form.image}
                    onImagePick={async () => {
                        const uri = await pickImage([2, 3], form.image);
                        if (uri) updateField("image", uri);
                    }}
                />
                {/* Передаем глобальные SECTIONS */}
                <SectionSelector
                    sections={SECTIONS}
                    currentType={form.type}
                    onSelect={(type) => updateField("type", type)}
                />
            </View>

            <View style={styles.section}>
                <CommonField
                    label="Название (обязательно)"
                    placeholder="Например: Начало"
                    form={form}
                    updateField={updateField}
                    fieldName="title"
                />
                <StatusPicker
                    categories={filteredStatuses}
                    currentStatus={form.status}
                    type={form.type}
                    onSelect={(status) => updateField("status", status)}
                />
            </View>

            <View style={styles.section}>
                <CollapsibleHeader
                    title="Дополнительная информация"
                    isOpen={isOptionalVisible}
                    onPress={() => setIsOptionalVisible(!isOptionalVisible)}
                />

                {isOptionalVisible && (
                    <View style={styles.optionalContent}>
                        {form.type !== "anime" && (
                            <CommonField
                                label="Год выпуска"
                                placeholder="2026"
                                form={form}
                                updateField={updateField}
                                fieldName="year"
                                keyboardType="numeric"
                            />
                        )}

                        {form.type === "movie" && (
                            <MovieFields
                                form={form}
                                updateField={updateField}
                            />
                        )}
                        {form.type === "anime" && (
                            <AnimeFields
                                form={form}
                                updateField={updateField}
                            />
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
                        marginBottom: isCompactMenu
                            ? insets.bottom + 90
                            : insets.bottom + 120,
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

const styles = StyleSheet.create({
    scrollContainer: { paddingHorizontal: 20, flexGrow: 1 },
    header: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        marginTop: 7.5,
        marginBottom: 25,
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 20,
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(142, 148, 164, 0.2)",
        marginBottom: 15,
    },
    label: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 5,
    },
    optionalContent: {
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: "#7D8AFF",
        padding: 18,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 10,
    },
    saveButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
