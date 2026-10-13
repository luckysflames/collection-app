import { cleanHtml, extractCreator, getCleanId } from "./helpers";

const SHIKIMORI_GRAPHQL_URL = "https://shikimori.io/api/graphql";

const fetchShikimoriGraphql = async (query, variables = {}) => {
    const res = await fetch(SHIKIMORI_GRAPHQL_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "Geekly/4.3.0 (contact: denisezakovskij341@gmail.com)",
        },
        body: JSON.stringify({ query, variables }),
    });
    return res.json();
};

export const shikimoriService = {
    async search(text, page) {
        const query = `
        query($search: String, $page: Int) {
          animes(search: $search, limit: 15, page: $page, order: popularity) {
            id
            licenseNameRu
            russian
            name
            poster { originalUrl }
          }
        }`;

        const json = await fetchShikimoriGraphql(query, {
            search: text,
            page,
        });
        return json.data.animes.map((item) => ({
            id: `anime-${item.id}-${page}`,
            title: item.licenseNameRu || item.russian || item.name,
            image: item.poster?.originalUrl,
            isAnime: true,
        }));
    },

    async getDetails(id) {
        const animeId = getCleanId(id, "anime-");

        const query = `
        query($id: String) {
          animes(ids: $id) {
            id
            licenseNameRu
            russian
            english
            japanese
            name
            poster { originalUrl }
            score
            status
            episodes
            episodesAired
            fansubbers
            fandubbers
            nextEpisodeAt
            airedOn { date }
            releasedOn { date }
            rating
            duration
            descriptionHtml
            kind
            genres { russian }
            studios { name }
            origin
            screenshots { x332Url }
            personRoles {
                rolesEn
                rolesRu
                person {
                    name
                }
            }
            related {
                id
                relationKind
                relationText
                anime {
                    id
                    name
                    russian
                    poster { originalUrl }
                }
                manga {
                    id
                    name
                    russian
                    poster { originalUrl }
                }
            }
          }
        }`;

        const json = await fetchShikimoriGraphql(query, { id: animeId });
        const data = json.data?.animes?.[0];

        if (!data) throw new Error("Anime not found");

        const dubAndSub = [...(data.fandubbers || []), ...(data.fansubbers || [])];

        const uniqueDubSub = Array.from(new Set(dubAndSub))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, "ru"));

        return {
            type: "anime",
            animeKind: data.kind,
            score: data.score || "0.0",
            animeStatus: data.status,
            episodes: data.episodes,
            episodesAired: data.episodesAired,
            studiosDubSub: uniqueDubSub,
            nextEpisodeAt: data.nextEpisodeAt || null,
            airedOn: data.airedOn?.date,
            releasedOn: data.releasedOn?.date,
            rating: data.rating,
            name: data.name || null,
            image: data.poster?.originalUrl,
            russian: data.russian || null,
            licenseNameRu: data.licenseNameRu || null,
            englishTitle: data.english || null,
            japaneseTitle: data.japanese || null,
            duration: data.duration || null,
            description: cleanHtml(data.descriptionHtml),
            genres: data.genres?.map((g) => g.russian) || [],
            studios: data.studios?.map((s) => s.name) || [],
            origin: data.origin || null,
            screenshots: data.screenshots?.map((s) => s.x332Url) || [],
            creator: extractCreator(data.personRoles),
            related:
                data.related
                    ?.map((relation) => {
                        const relatedItem = relation.anime || relation.manga;
                        if (!relatedItem) return null;

                        const type = relation.manga ? "manga" : "anime";
                        return {
                            id: `${type}-${relatedItem.id}-1`,
                            type,
                            title: relatedItem.russian || relatedItem.name,
                            image: relatedItem.poster?.originalUrl,
                            relationKind: relation.relationKind,
                            relationText: relation.relationText,
                        };
                    })
                    .filter(Boolean) || [],
            isAnime: true,
        };
    },
};

export const shikimoriMangaService = {
    async search(text, page) {
        const query = `
        query($search: String, $page: Int) {
          mangas(search: $search, limit: 15, page: $page, order: popularity) {
            id
            licenseNameRu
            russian
            name
            poster { originalUrl }
          }
        }`;

        const json = await fetchShikimoriGraphql(query, {
            search: text,
            page,
        });
        const mangas = json.data?.mangas;
        if (!Array.isArray(mangas)) {
            throw new Error(json.errors?.[0]?.message || "Manga search failed");
        }

        return mangas.map((item) => ({
            id: `manga-${item.id}-${page}`,
            type: "manga",
            title: item.licenseNameRu || item.russian || item.name,
            image: item.poster?.originalUrl,
            isManga: true,
        }));
    },

    async getDetails(id) {
        const mangaId = getCleanId(id, "manga-");
        const query = `
        query($id: String) {
          mangas(ids: $id) {
            id
            malId
            name
            russian
            licenseNameRu
            english
            japanese
            synonyms
            kind
            score
            status
            volumes
            chapters
            airedOn { date }
            releasedOn { date }
            url
            poster { originalUrl }
            genres { russian }
            publishers { name }
            personRoles {
              rolesRu
              rolesEn
              person { name }
            }
            related {
              id
              relationKind
              relationText
              anime {
                id
                name
                russian
                poster { originalUrl }
              }
              manga {
                id
                name
                russian
                poster { originalUrl }
              }
            }
            descriptionHtml
          }
        }`;

        const json = await fetchShikimoriGraphql(query, { id: mangaId });
        const data = json.data?.mangas?.[0];
        if (!data) {
            throw new Error(json.errors?.[0]?.message || "Manga not found");
        }

        const authors = Array.from(
            new Set(
                (data.personRoles || [])
                    .map((role) => role.person?.name)
                    .filter(Boolean),
            ),
        );
        const related = (data.related || [])
            .map((relation) => {
                const relatedItem = relation.manga || relation.anime;
                if (!relatedItem) return null;
                const type = relation.manga ? "manga" : "anime";
                return {
                    id: `${type}-${relatedItem.id}-1`,
                    type,
                    title: relatedItem.russian || relatedItem.name,
                    image: relatedItem.poster?.originalUrl,
                    relationKind: relation.relationKind,
                    relationText: relation.relationText,
                };
            })
            .filter(Boolean);

        return {
            type: "manga",
            mangaKind: data.kind,
            mangaStatus: data.status,
            score: data.score || "0.0",
            volumes: data.volumes,
            chapters: data.chapters,
            airedOn: data.airedOn?.date,
            releasedOn: data.releasedOn?.date,
            year: data.airedOn?.date || "",
            name: data.name || null,
            image: data.poster?.originalUrl,
            russian: data.russian || null,
            licenseNameRu: data.licenseNameRu || null,
            englishTitle: data.english || null,
            japaneseTitle: data.japanese || null,
            synonyms: data.synonyms || [],
            description: cleanHtml(data.descriptionHtml),
            genres: data.genres?.map((genre) => genre.russian).filter(Boolean) || [],
            publishers: data.publishers?.map((publisher) => publisher.name).filter(Boolean) || [],
            authors,
            creator: authors[0] || null,
            related,
            sourceUrl: data.url,
            isManga: true,
        };
    },
};
