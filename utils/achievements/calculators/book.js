import { hasAnyTag } from "../helpers";

export const bookCalculators = {
    // Всего книг в разделе
    book_reader: (cards) =>
        cards?.filter((card) => card.type === "book" && !card.isFolder).length || 0,

    // Прочитанные книги
    book_finished_legend: (cards) =>
        cards?.filter(
            (card) => card.type === "book" && !card.isFolder && card.status === "Прочитано",
        ).length || 0,

    // Жанры Фэнтези или Магический реализм
    book_fantasy_world: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                hasAnyTag(card.genres, ["Фэнтези", "Магический реализм", "Фантастика"]),
        ).length || 0,

    // Книги > 300 страниц
    book_longreader: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                card.pageCount &&
                Number(card.pageCount) > 300,
        ).length || 0,

    // Классика (выпущенная до 2000 года)
    book_classic_era: (cards) =>
        cards?.filter((card) => {
            if (card.type !== "book" || card.isFolder || !card.year) return false;
            const match = card.year.toString().match(/\b(19|20)\d{2}\b/);
            if (!match) return false;
            return parseInt(match[0], 10) < 2000;
        }).length || 0,

    // Поклонник автора (ищем максимальное количество книг одного автора)
    book_author_fan: (cards) => {
        const bookCards =
            cards?.filter(
                (card) => card.type === "book" && !card.isFolder && Array.isArray(card.authors),
            ) || [];
        const authorCounts = {};

        bookCards.forEach((card) => {
            card.authors.forEach((author) => {
                if (author) authorCounts[author] = (authorCounts[author] || 0) + 1;
            });
        });

        const maxBooksByOneAuthor = Math.max(...Object.values(authorCounts), 0);
        return maxBooksByOneAuthor;
    },

    // Личная оценка = 10
    book_perfect_score: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                card.userScore &&
                Number(card.userScore) === 10,
        ).length || 0,

    // Статус "Читаю" одновременно
    book_currently_reading: (cards) =>
        cards?.filter((card) => card.type === "book" && !card.isFolder && card.status === "Читаю")
            .length || 0,

    // Кастомные карточки
    book_custom_creator: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                (card.isCustom || !card.id?.startsWith("book-")),
        ).length || 0,

    // СЕКРЕТНЫЕ: Книги-кирпичи > 800 страниц (привет "Дому, в котором"!)
    book_brick_layer: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                card.pageCount &&
                Number(card.pageCount) > 800,
        ).length || 0,

    // СЕКРЕТНЫЕ: Независимые издательства
    book_indie_publisher: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                card.publisher &&
                [
                    "livebook",
                    "фантом пресс",
                    "миф",
                    "polyandria",
                    "новое литературное обозрение",
                ].includes(card.publisher.toLowerCase().trim()),
        ).length || 0,

    // СЕКРЕТНЫЕ: Книги со взрослым или подростковым рейтингом
    book_mature_audiences: (cards) =>
        cards?.filter(
            (card) =>
                card.type === "book" &&
                !card.isFolder &&
                card.maturityRating &&
                ["teen", "mature", "16+", "18+"].includes(card.maturityRating.toLowerCase()),
        ).length || 0,
};
