import { useMemo } from "react";

export const useDetailsData = (item, fullDetails, savedItem) => {
    const type = useMemo(() => {
        // Проверяем явно сохраненное поле type (приоритет)
        if (savedItem?.type) return savedItem.type;
        if (item?.type) return item.type;
        if (fullDetails?.type) return fullDetails.type;

        // Затем проверяем boolean флаги (от API)
        if (savedItem?.isAnime || item?.isAnime || fullDetails?.isAnime)
            return "anime";
        if (savedItem?.isGame || item?.isGame || fullDetails?.isGame)
            return "game";
        if (savedItem?.isBook || item?.isBook || fullDetails?.isBook)
            return "book";
        return "movie";
    }, [item, fullDetails, savedItem]);

    return useMemo(() => {
        const common = {
            type,
            isCustom: !!(
                item?.isCustom ||
                savedItem?.isCustom ||
                fullDetails?.isCustom
            ),
            title: savedItem?.title || item.title,
            score: fullDetails?.score || item.score || "0.0",
            description:
                savedItem?.description ||
                fullDetails?.description ||
                item.description,
            genres:
                savedItem?.genres || fullDetails?.genres || item.genres || [],
            image: item.image,
            // Для InfoStats
            duration:
                savedItem?.duration || fullDetails?.duration || item.duration,
        };

        switch (type) {
            case "anime":
                return {
                    ...common,
                    animeKind:
                        savedItem?.kind ||
                        savedItem?.animeKind ||
                        fullDetails?.kind ||
                        item?.kind,
                    episodes:
                        savedItem?.episodes || fullDetails?.episodes || "?",
                    episodesAired:
                        savedItem?.episodesAired ||
                        fullDetails?.episodesAired ||
                        "?",
                    airedOn: savedItem?.airedOn || fullDetails?.airedOn,
                    releasedOn:
                        savedItem?.releasedOn || fullDetails?.releasedOn,
                    studios: savedItem?.studios || fullDetails?.studios || [],
                    screenshots: savedItem?.screenshots || fullDetails?.screenshots || [],
                    rating: savedItem?.rating || fullDetails?.rating,
                    animeStatus:
                        savedItem?.animeStatus ||
                        fullDetails?.animeStatus ||
                        savedItem?.airingStatus,
                    englishTitle:
                        savedItem?.englishTitle || fullDetails?.englishTitle,
                    japaneseTitle:
                        savedItem?.japaneseTitle || fullDetails?.japaneseTitle,
                };
            case "movie":
                return {
                    ...common,
                    year: savedItem?.year || fullDetails?.year || item?.year,
                    budget: savedItem?.budget || fullDetails?.budget,
                    movieStatus:
                        savedItem?.movieStatus || fullDetails?.movieStatus,
                    countries:
                        savedItem?.countries || fullDetails?.countries || [],
                    companies:
                        savedItem?.companies || fullDetails?.companies || [],
                    originalTitle:
                        savedItem?.originalTitle || fullDetails?.originalTitle,
                };
            case "game":
                return {
                    ...common,
                    developers:
                        savedItem?.developers || fullDetails?.developers || [],
                    platforms:
                        savedItem?.platforms || fullDetails?.platforms || [],
                    metacritic:
                        savedItem?.metacritic || fullDetails?.metacritic,
                    year: savedItem?.year || fullDetails?.year || item?.year,
                    originalTitle:
                        savedItem?.originalTitle || fullDetails?.originalTitle,
                    esrb: savedItem?.esrb || fullDetails?.esrb,
                };
            case "book":
                return {
                    ...common,
                    pageCount:
                        savedItem?.pageCount ||
                        fullDetails?.pageCount ||
                        item?.pageCount,
                    authors:
                        savedItem?.authors ||
                        fullDetails?.authors ||
                        item?.authors ||
                        [],
                    year: savedItem?.year || fullDetails?.year || item?.year,
                    maturityRating:
                        savedItem?.maturityRating || fullDetails?.rating,
                    publisher: savedItem?.publisher || fullDetails?.publisher,
                };
            default:
                return common;
        }
    }, [item, fullDetails, savedItem, type]);
};
