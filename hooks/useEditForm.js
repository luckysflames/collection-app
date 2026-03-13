import { useState, useEffect } from "react";

export const useEditForm = (isEditing, displayData) => {
    const [editForm, setEditForm] = useState({
        title: "",
        year: "",
        genres: "",
        countries: "",
        description: "",
    });

    useEffect(() => {
        if (isEditing) {
            setEditForm({
                title: displayData.title || "",
                year: String(displayData.year || ""),
                genres: Array.isArray(displayData.genres)
                    ? displayData.genres.join(", ")
                    : "",
                countries: Array.isArray(displayData.countries)
                    ? displayData.countries.join(", ")
                    : "",
                description: displayData.description || "",
            });
        }
    }, [isEditing, displayData]);

    return [editForm, setEditForm];
};
