import { useMemo } from "react";

export const useMediaCategories = (section) => {
    return useMemo(() => {
        let CATEGORIES = [];
        let sectionName = "";
        let defaultActive = "";

        if (section === "Книги") {
            CATEGORIES = [
                "Читаю",
                "Перечитываю",
                "В планах",
                "Прочитано",
                "Брошено",
                "Отложено",
            ];
            sectionName = "книг";
            defaultActive = "Читаю";
        } else if (section === "Игры") {
            CATEGORIES = [
                "Играю",
                "Переигрываю",
                "В планах",
                "Прошёл",
                "Брошено",
                "Отложено",
            ];
            sectionName = "игр";
            defaultActive = "Играю";
        } else {
            CATEGORIES = [
                "Смотрю",
                "Пересматриваю",
                "В планах",
                "Просмотрено",
                "Брошено",
                "Отложено",
            ];
            sectionName = section === "Аниме" ? "аниме" : "фильмов";
            defaultActive = "Смотрю";
        }

        return { CATEGORIES, sectionName, defaultActive };
    }, [section]);
};
