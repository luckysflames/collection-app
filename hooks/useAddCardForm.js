import { Alert } from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { useEffect, useState } from "react";
import {
    DEFAULT_FALLBACK_STATUS,
    DEFAULT_STATUS_BY_SECTION,
    INITIAL_FORM_STATE,
    SECTION_MAPPING,
    SECTIONS,
    FAVORITE_STATUS,
} from "../constants";

export const useAddCardForm = (navigation) => {
    const addToCollection = useCollectionStore(
        (state) => state.addToCollection,
    );

    const [form, setForm] = useState(INITIAL_FORM_STATE);

    const [errorModal, setErrorModal] = useState({
        visible: false,
        message: "",
    });

    // При смене типа карточки статус остается "Избранное"
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            status: FAVORITE_STATUS,
        }));
    }, [form.type]);

    const split = (str) =>
        str
            ? str
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
            : [];

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            setErrorModal({
                visible: true,
                message:
                    "Пожалуйста, введите название. Мы не можем добавить совсем пустую карточку в вашу коллекцию.",
            });
            return;
        }

        const baseCard = {
            type: form.type,
            id: Date.now().toString(),
            title: form.title,
            description: form.description,
            genres: split(form.genres),
            image: form.image || "https://via.placeholder.com/300x450",
            status:
                form.status === FAVORITE_STATUS ? "Без статуса" : form.status,
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
                    budget: `$${form.budget || "?"}`,
                    movieStatus: form.movieStatus,
                    countries: split(form.countries),
                    companies: split(form.companies),
                    duration: `${form.duration || "?"} мин.`,
                    originalTitle: form.originalTitle,
                };
                break;
            case "anime":
                extendedData = {
                    englishTitle: form.englishTitle,
                    japaneseTitle: form.japaneseTitle,
                    kind: form.animeKind,
                    rating: form.rating,
                    airedOn: form.airedOn,
                    releasedOn: form.releasedOn,
                    episodes: form.episodes,
                    episodesAired: form.episodesAired,
                    studios: split(form.studios),
                    duration: `по ~${form.duration || "?"} мин.`,
                    animeStatus: form.animeStatus,
                };
                break;
            case "book":
                extendedData = {
                    year: form.year,
                    pageCount: `${form.pageCount} стр.`,
                    maturityRating: form.maturity,
                    authors: split(form.authors),
                    publisher: form.publisher,
                };
                break;
            case "game":
                extendedData = {
                    year: form.year,
                    metacritic: form.metacritic,
                    esrb: form.esrb,
                    developers: split(form.developers),
                    platforms: split(form.platforms),
                    duration: `${form.duration} ч.`,
                };
                break;
        }

        const finalCard = { ...baseCard, ...extendedData };
        addToCollection(finalCard);
        setForm(INITIAL_FORM_STATE);

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
