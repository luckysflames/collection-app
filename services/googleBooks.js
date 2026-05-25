import { cleanHtml, getCleanId } from "./helpers";

const GOOGLE_BOOKS_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_KEY;

export const googleBooksService = {
    async search(text, page) {
        const maxResults = 15;
        const startIndex = (page - 1) * maxResults;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(text)}&maxResults=${maxResults}&startIndex=${startIndex}&hl=ru&key=${GOOGLE_BOOKS_KEY}`;

        const res = await fetch(url);
        const json = await res.json();
        return (
            json.items?.map((item) => ({
                id: `book-${item.id}-${page}`,
                title: item.volumeInfo.title,
                year: item.volumeInfo.publishedDate?.split("-")[0] || "N/A",
                category: "Книга",
                image:
                    item.volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:") ||
                    "https://via.placeholder.com/500x750",
                description: cleanHtml(item.volumeInfo.description),
                isBook: true,
            })) || []
        );
    },

    async getDetails(id) {
        const bookId = getCleanId(id, "book-");
        const res = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}?hl=ru&key=${GOOGLE_BOOKS_KEY}`,
        );
        const json = await res.json();
        const info = json.volumeInfo;

        // Обработка категорий: "A / B" превращаем в ["A", "B"]
        const processedGenres = info.categories
            ? info.categories.flatMap((cat) => cat.split("/").map((s) => s.trim()))
            : [];

        return {
            type: "book",
            authors: info.authors || [],
            publisher: info.publisher,
            year: info.publishedDate,
            pageCount: info.pageCount || null,
            genres: processedGenres,
            score: info.averageRating || "0.0",
            rating: info.maturityRating,
            description: cleanHtml(info.description) || "Описание отсутствует",
            isBook: true,
        };
    },
};
