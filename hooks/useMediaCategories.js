import { useMemo } from "react";

export const useMediaCategories = (section) => {
    return useMemo(() => {
        let CATEGORIES = [];
        let sectionName = "";
        let defaultActive = "";

        if (section === "Книги") {
            CATEGORIES = [
                "Читаю",
                "В планах",
                "Прочитано",
                "Перечитываю",
                "Брошено",
                "Отложено",
            ];
            sectionName = "книг";
            defaultActive = "Читаю";
        } else if (section === "Игры") {
            CATEGORIES = [
                "Играю",
                "В планах",
                "Прошёл",
                "Переигрываю",
                "Брошено",
                "Отложено",
            ];
            sectionName = "игр";
            defaultActive = "Играю";
        } else {
            CATEGORIES = [
                "Смотрю",
                "В планах",
                "Просмотрено",
                "Пересматриваю",
                "Брошено",
                "Отложено",
            ];
            sectionName = section === "Аниме" ? "аниме" : "фильмов";
            defaultActive = "Смотрю";
        }

        return { CATEGORIES, sectionName, defaultActive };
    }, [section]);
};
