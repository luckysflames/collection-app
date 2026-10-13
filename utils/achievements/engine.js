// achievements/engine.js
import { ACHIEVEMENTS_DATA } from "./data/index";
import { checkIdsPresence } from "./helpers";

// Импортируем калькуляторы
import { commonCalculators } from "./calculators/common";
import { animeCalculators } from "./calculators/anime";
import { movieCalculators } from "./calculators/movie";
import { tvCalculators } from "./calculators/tv";
import { gameCalculators } from "./calculators/game";
import { bookCalculators } from "./calculators/book";
import { mangaCalculators } from "./calculators/manga";

export const calculateAchievements = (allCards) => {
    const safeCards = allCards || [];

    // ОПТИМИЗАЦИЯ: Разделяем коллекцию по категориям ОДИН раз за проход
    const splitCollection = {
        folder: [],
        anime: [],
        movie: [],
        tv: [],
        game: [],
        book: [],
        manga: [],
    };

    safeCards.forEach((card) => {
        if (card.isFolder) {
            splitCollection.folder.push(card);
        } else if (card.appSection) {
            const section = card.appSection.toLowerCase();
            if (splitCollection[section]) {
                splitCollection[section].push(card);
            }
        }
    });

    return ACHIEVEMENTS_DATA.map((achievement) => {
        let current = 0;

        // 1. Ищем калькулятор в общих
        if (commonCalculators[achievement.id]) {
            current = commonCalculators[achievement.id](safeCards);
        }
        // 2. Ищем в специфичных (и скармливаем только нужный срез данных!)
        else if (animeCalculators[achievement.id]) {
            current = animeCalculators[achievement.id](splitCollection.anime);
        } else if (movieCalculators[achievement.id]) {
            current = movieCalculators[achievement.id](splitCollection.movie);
        } else if (tvCalculators[achievement.id]) {
            current = tvCalculators[achievement.id](splitCollection.tv);
        } else if (gameCalculators[achievement.id]) {
            current = gameCalculators[achievement.id](splitCollection.game);
        } else if (bookCalculators[achievement.id]) {
            current = bookCalculators[achievement.id](splitCollection.book);
        } else if (mangaCalculators[achievement.id]) {
            current = mangaCalculators[achievement.id](splitCollection.manga);
        }
        // 3. Универсальный трекер по ID (поддерживает префиксы под разные разделы)
        else if (achievement.requiredIds) {
            const prefix = achievement.id.startsWith("tv_")
                ? "tv-"
                : achievement.id.startsWith("movie_")
                  ? "movie-"
                  : achievement.id.startsWith("game_")
                    ? "game-"
                    : achievement.id.startsWith("book_")
                      ? "book-"
                      : "anime-";
            current = checkIdsPresence(safeCards, achievement, prefix);
        }

        const isCompleted = current >= achievement.target;

        return {
            ...achievement,
            current: isCompleted ? achievement.target : current,
            isCompleted,
        };
    });
};
