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
            score
            status
            episodes
            episodesAired
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
            }
          }
        }`;

        const json = await fetchShikimoriGraphql(query, { id: animeId });
        const data = json.data?.animes?.[0];

        if (!data) throw new Error("Anime not found");

        return {
            type: "anime",
            animeKind: data.kind,
            score: data.score || "0.0",
            animeStatus: data.status,
            episodes: data.episodes,
            episodesAired: data.episodesAired,
            nextEpisodeAt: data.nextEpisodeAt || null,
            airedOn: data.airedOn?.date,
            releasedOn: data.releasedOn?.date,
            rating: data.rating,
            name: data.name || null,
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
                    ?.filter((r) => r.anime !== null)
                    .map((r) => ({
                        id: `anime-${r.anime?.id}-1`,
                        title: r.anime?.russian || r.anime?.name,
                        image: r.anime?.poster?.originalUrl,
                        relationKind: r.relationKind,
                        relationText: r.relationText,
                    })) || [],
            isAnime: true,
        };
    },
};
