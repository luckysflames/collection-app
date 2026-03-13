import { Alert } from "react-native";
import { useCollectionStore } from "../store/useCollectionStore";
import { useEffect, useState } from "react";

export const useAddCardForm = (navigation) => {
    const addToCollection = useCollectionStore(
        (state) => state.addToCollection,
    );

    const [form, setForm] = useState({
        type: "movie",
        title: "",
        // Доп. названия (массив строк)
        extraTitles: [""],
        year: "", // Используем как основную дату (ГГГГ или ДД.ММ.ГГГГ)
        // Общие поля
        genres: "",
        description: "",
        status: "Смотрю",
        image: null,

        // Специфичные поля (будем доставать по ключам)
        budget: "",
        movieStatus: "released",
        countries: "",
        companies: "",
        originalTitle: "",

        // Аниме
        englishTitle: "",
        japaneseTitle: "",
        animeKind: "tv", // tv, movie, etc
        rating: "pg_13",
        airedOn: "", // период с
        releasedOn: "", // период по
        episodes: "",
        episodesAired: "",
        studios: "",

        // Книги
        pageCount: "",
        maturity: "",
        authors: "",
        publisher: "",

        // Игры
        metacritic: "",
        esrb: "",
        developers: "",
        platforms: "",
        duration: "", // Универсальное (мин для кино, часы для игр)
    });

    // Внутренний хелпер для определения статуса по умолчанию
    const getDefaultStatus = (type) => {
        switch (type) {
            case "book":
                return "Читаю";
            case "game":
                return "Играю";
            default:
                return "Смотрю";
        }
    };

    // Автоматическая смена статуса при изменении типа
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            status: getDefaultStatus(prev.type),
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
        if (!form.title) {
            Alert.alert("Упс!", "Название обязательно");
            return;
        }

        const baseCard = {
            type: form.type,
            id: Date.now().toString(),
            title: form.title,
            description: form.description,
            genres: split(form.genres),
            image: form.image || "https://via.placeholder.com/300x450",
            status: form.status,
            userNotes: "",
            isCustom: true,
            appSection:
                form.type === "movie"
                    ? "Фильмы"
                    : form.type === "anime"
                      ? "Аниме"
                      : form.type === "game"
                        ? "Игры"
                        : "Книги",
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
        navigation.goBack();
    };

    return { form, updateField, handleSave };
};
