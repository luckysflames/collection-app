import { Alert, Keyboard } from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { useEffect, useState } from "react";
import { parseList } from "../utils/listParser";
import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUS_BY_SECTION,
    INITIAL_FORM_STATE,
    SECTION_MAPPING,
    SECTIONS,
    FAVORITE_STATUS,
} from "../constants/index";

// Передаем в хук вторым аргументом initialType (тип по умолчанию)
export const useAddCardForm = (navigation, initialType) => {
    const addToCollection = useCollectionStore((state) => state.addToCollection);

    // Инициализируем форму: если передан initialType, подставляем его в type
    const [form, setForm] = useState(() => ({
        ...INITIAL_FORM_STATE,
        type: initialType || INITIAL_FORM_STATE.type,
    }));

    const [errorModal, setErrorModal] = useState({
        visible: false,
        message: "",
    });

    // Исправленный useEffect: следим ТОЛЬКО за изменением form.type,
    // чтобы принудительно переключать статус в FAVORITE_STATUS
    const currentType = form.type;
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            status: FAVORITE_STATUS,
        }));
    }, [currentType]); // Следим за конкретной строкой, а не за всем объектом формы

    const split = parseList;

    const extractNumeric = (value) => {
        if (!value) return "";
        const normalized = String(value).replace(",", ".").trim();
        const match = normalized.match(/\d+(\.\d+)?/);
        return match ? match[0] : "";
    };

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (onSuccess) => {
        if (!form.title.trim()) {
            setErrorModal({
                visible: true,
                message: "Пожалуйста, введите название.",
            });
            return;
        }

        const baseCard = {
            type: form.type,
            id: Date.now().toString(),
            title: form.title,
            description: form.description,
            genres: split(form.genres),
            image: form.image || null,
            status: form.status === FAVORITE_STATUS ? "Без статуса" : form.status,
            userNotes: "",
            isCustom: true,
            isFavorite: form.status === FAVORITE_STATUS,
            appSection: form.type,
            parentFolderIds: [],
        };

        let extendedData = {};

        switch (form.type) {
            case "movie":
                extendedData = {
                    year: form.year,
                    budget: extractNumeric(form.budget),
                    movieStatus: form.movieStatus,
                    countries: split(form.countries),
                    companies: split(form.companies),
                    duration: extractNumeric(form.duration),
                    originalTitle: form.originalTitle,
                };
                break;
            case "tv":
                extendedData = {
                    first_air_date: form.first_air_date,
                    last_air_date: form.last_air_date,
                    budget: extractNumeric(form.budget),
                    movieStatus: form.movieStatus,
                    countries: split(form.countries),
                    companies: split(form.companies),
                    duration: extractNumeric(form.duration),
                    originalTitle: form.originalTitle,
                    seasonsCount: extractNumeric(form.seasons),
                    episodesCount: extractNumeric(form.episodes),
                };
                break;
            case "anime":
                extendedData = {
                    englishTitle: form.englishTitle,
                    japaneseTitle: form.japaneseTitle,
                    animeKind: form.animeKind,
                    rating: form.rating,
                    airedOn: form.airedOn,
                    releasedOn: form.releasedOn,
                    episodes: extractNumeric(form.episodes),
                    episodesAired: extractNumeric(form.episodesAired),
                    studios: split(form.studios),
                    duration: extractNumeric(form.duration),
                    animeStatus: form.animeStatus,
                };
                break;
            case "manga":
                extendedData = {
                    year: form.airedOn || form.year,
                    englishTitle: form.englishTitle,
                    japaneseTitle: form.japaneseTitle,
                    mangaKind: form.mangaKind,
                    mangaStatus: form.mangaStatus,
                    airedOn: form.airedOn,
                    releasedOn: form.releasedOn,
                    volumes: extractNumeric(form.volumes),
                    chapters: extractNumeric(form.chapters),
                    authors: split(form.authors),
                    publishers: split(form.publishers),
                };
                break;
            case "book":
                extendedData = {
                    year: form.year,
                    pageCount: extractNumeric(form.pageCount),
                    maturityRating: form.maturityRating,
                    authors: split(form.authors),
                    publisher: form.publisher,
                };
                break;
            case "game":
                extendedData = {
                    year: form.year,
                    metacritic: extractNumeric(form.metacritic),
                    esrb: form.esrb,
                    developers: split(form.developers),
                    platforms: split(form.platforms),
                    duration: extractNumeric(form.duration),
                };
                break;
        }

        const finalCard = { ...baseCard, ...extendedData };
        addToCollection(finalCard);

        Keyboard.dismiss();

        // После сохранения сбрасываем в дефолтный стейт, сохраняя кастомный тип
        setForm({
            ...INITIAL_FORM_STATE,
            type: initialType || INITIAL_FORM_STATE.type,
        });

        if (onSuccess) onSuccess();
        navigation.navigate("Коллекция", { screen: "Дашборд" });
    };

    return {
        form,
        updateField,
        handleSave,
        errorModal,
        closeError: () => setErrorModal({ ...errorModal, visible: false }),
    };
};
