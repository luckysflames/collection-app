import { useMemo } from "react";

export const useDetailsData = (item, fullDetails, savedItem) => {
    const type = useMemo(() => {
        if (item.isAnime || fullDetails?.isAnime) return "anime";
        if (item.isGame || fullDetails?.isGame) return "game";
        if (item.isBook || fullDetails?.isBook) return "book";
        return "movie";
    }, [item, fullDetails]);

    return useMemo(() => {
        const common = {
            type,
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
            duration: fullDetails?.duration || item.duration,
        };

        switch (type) {
            case "anime":
                return {
                    ...common,
                    kind: fullDetails?.kind || item?.kind,
                    episodes: fullDetails?.episodes || "?",
                    episodesAired: fullDetails?.episodesAired || "?",
                    airedOn: fullDetails?.airedOn,
                    releasedOn: fullDetails?.releasedOn,
                    studios: fullDetails?.studios || [],
                    rating: fullDetails?.rating,
                    status: fullDetails?.animeStatus,
                    englishTitle: fullDetails?.englishTitle,
                    japaneseTitle: fullDetails?.japaneseTitle,
                };
            case "movie":
                return {
                    ...common,
                    year: savedItem?.year || fullDetails?.year || item?.year,
                    budget: fullDetails?.budget,
                    movieStatus: fullDetails?.movieStatus,
                    countries:
                        savedItem?.countries || fullDetails?.countries || [],
                    companies: fullDetails?.companies || [],
                    originalTitle: fullDetails?.originalTitle,
                };
            case "game":
                return {
                    ...common,
                    developers: fullDetails?.developers || [],
                    platforms: fullDetails?.platforms || [],
                    metacritic: fullDetails?.metacritic,
                    year: fullDetails?.year || item?.year,
                    originalTitle: fullDetails?.originalTitle,
                    esrb: fullDetails?.esrb,
                };
            case "book":
                return {
                    ...common,
                    pageCount: fullDetails?.pageCount || item?.pageCount,
                    authors: fullDetails?.authors || item?.authors || [],
                    year: savedItem?.year || fullDetails?.year || item?.year,
                    maturityRating: fullDetails?.rating,
                    publisher: fullDetails?.publisher,
                };
            default:
                return common;
        }
    }, [item, fullDetails, savedItem, type]);
};
