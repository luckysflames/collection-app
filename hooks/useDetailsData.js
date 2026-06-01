import { useMemo } from "react";

export const useDetailsData = (item, fullDetails, savedItem) => {
    const type = useMemo(() => {
        // Проверяем явно сохраненное поле type (приоритет)
        if (savedItem?.type) return savedItem.type;
        if (item?.type) return item.type;
        if (fullDetails?.type) return fullDetails.type;

        // Затем проверяем boolean флаги (от API)
        if (savedItem?.isAnime || item?.isAnime || fullDetails?.isAnime) return "anime";
        if (savedItem?.isTV || item?.isTV || fullDetails?.isTV) return "tv";
        if (savedItem?.isGame || item?.isGame || fullDetails?.isGame) return "game";
        if (savedItem?.isBook || item?.isBook || fullDetails?.isBook) return "book";
        return "movie";
    }, [savedItem, item, fullDetails]);

    return useMemo(() => {
        const common = {
            id: savedItem?.id || item?.id || fullDetails?.id,
            type,
            isCustom: !!(savedItem?.isCustom || item?.isCustom || fullDetails?.isCustom),
            title: savedItem?.title || item?.title,
            score: savedItem?.score || item?.score || fullDetails?.score || "0.0",
            description: savedItem?.description || item?.description || fullDetails?.description,
            genres: savedItem?.genres || item?.genres || fullDetails?.genres || [],
            image: savedItem?.image || item?.image,
            duration: savedItem?.duration || item?.duration || fullDetails?.duration,
        };

        switch (type) {
            case "anime":
                return {
                    ...common,
                    animeKind: savedItem?.animeKind || item?.animeKind || fullDetails?.animeKind,
                    episodes: savedItem?.episodes || item?.episodes || fullDetails?.episodes || "?",
                    episodesAired:
                        savedItem?.episodesAired ||
                        item?.episodesAired ||
                        fullDetails?.episodesAired ||
                        "?",
                    airedOn: savedItem?.airedOn || item?.airedOn || fullDetails?.airedOn,
                    releasedOn:
                        savedItem?.releasedOn || item?.releasedOn || fullDetails?.releasedOn,
                    studios: savedItem?.studios || item?.studios || fullDetails?.studios || [],
                    origin: savedItem?.origin || item?.origin || fullDetails?.origin,
                    screenshots:
                        savedItem?.screenshots ||
                        item?.screenshots ||
                        fullDetails?.screenshots ||
                        [],
                    creator: savedItem?.creator || item?.creator || fullDetails?.creator,
                    related: savedItem?.related || item?.related || fullDetails?.related || [],
                    rating: savedItem?.rating || item?.rating || fullDetails?.rating,
                    animeStatus:
                        savedItem?.animeStatus ||
                        savedItem?.airingStatus ||
                        item?.animeStatus ||
                        fullDetails?.animeStatus,

                    name: savedItem?.name || item?.name || fullDetails?.name,
                    russian: savedItem?.russian || item?.russian || fullDetails?.russian,
                    licenseNameRu:
                        savedItem?.licenseNameRu ||
                        item?.licenseNameRu ||
                        fullDetails?.licenseNameRu,
                    englishTitle:
                        savedItem?.englishTitle || item?.englishTitle || fullDetails?.englishTitle,
                    japaneseTitle:
                        savedItem?.japaneseTitle ||
                        item?.japaneseTitle ||
                        fullDetails?.japaneseTitle,
                };
            case "movie":
                return {
                    ...common,
                    year: savedItem?.year || item?.year || fullDetails?.year,
                    budget: savedItem?.budget || item?.budget || fullDetails?.budget,
                    movieStatus:
                        savedItem?.movieStatus || item?.movieStatus || fullDetails?.movieStatus,
                    countries:
                        savedItem?.countries || item?.countries || fullDetails?.countries || [],
                    companies:
                        savedItem?.companies || item?.companies || fullDetails?.companies || [],
                    originalTitle:
                        savedItem?.originalTitle ||
                        item?.originalTitle ||
                        fullDetails?.originalTitle,
                };
            case "tv":
                return {
                    ...common,
                    first_air_date:
                        savedItem?.first_air_date ||
                        item?.first_air_date ||
                        fullDetails?.first_air_date,
                    last_air_date:
                        savedItem?.last_air_date ||
                        item?.last_air_date ||
                        fullDetails?.last_air_date,
                    budget: savedItem?.budget || item?.budget || fullDetails?.budget,
                    movieStatus:
                        savedItem?.movieStatus || item?.movieStatus || fullDetails?.movieStatus,
                    countries:
                        savedItem?.countries || item?.countries || fullDetails?.countries || [],
                    companies:
                        savedItem?.companies || item?.companies || fullDetails?.companies || [],
                    createdBy:
                        savedItem?.createdBy || item?.createdBy || fullDetails?.createdBy || [],
                    originalTitle:
                        savedItem?.originalTitle ||
                        item?.originalTitle ||
                        fullDetails?.originalTitle,
                    duration: savedItem?.duration || item?.duration || fullDetails?.duration,
                    seasonsCount:
                        savedItem?.seasonsCount || item?.seasonsCount || fullDetails?.seasonsCount,
                    seasonsList:
                        savedItem?.seasonsList ||
                        item?.seasonsList ||
                        fullDetails?.seasonsList ||
                        [],
                    related: savedItem?.related || item?.related || fullDetails?.related || [],
                    episodesCount:
                        savedItem?.episodesCount ||
                        item?.episodesCount ||
                        fullDetails?.episodesCount,
                };
            case "game":
                return {
                    ...common,
                    developers:
                        savedItem?.developers || item?.developers || fullDetails?.developers || [],
                    platforms:
                        savedItem?.platforms || item?.platforms || fullDetails?.platforms || [],
                    metacritic:
                        savedItem?.metacritic || item?.metacritic || fullDetails?.metacritic,
                    year: savedItem?.year || item?.year || fullDetails?.year,
                    originalTitle:
                        savedItem?.originalTitle ||
                        item?.originalTitle ||
                        fullDetails?.originalTitle,
                    esrb: savedItem?.esrb || item?.esrb || fullDetails?.esrb,
                };
            case "book":
                return {
                    ...common,
                    pageCount: savedItem?.pageCount || item?.pageCount || fullDetails?.pageCount,
                    authors: savedItem?.authors || item?.authors || fullDetails?.authors || [],
                    year: savedItem?.year || item?.year || fullDetails?.year,
                    maturityRating:
                        savedItem?.maturityRating || item?.maturityRating || fullDetails?.rating,
                    publisher: savedItem?.publisher || item?.publisher || fullDetails?.publisher,
                };
            default:
                return common;
        }
    }, [savedItem, item, fullDetails, type]);
};
