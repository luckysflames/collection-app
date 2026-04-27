import { useState } from "react";
import { FAVORITE_STATUS } from "../constants";

export const useDetailsModals = (category, createFolder) => {
    const [modals, setModals] = useState({
        status: false,
        folder: false,
        info: false,
        createFolder: false,
    });

    const openModal = (key) => setModals((prev) => ({ ...prev, [key]: true }));
    const closeModal = (key) =>
        setModals((prev) => ({ ...prev, [key]: false }));

    const modalActions = {
        closeStatus: () => closeModal("status"),
        closeFolder: () => closeModal("folder"),
        closeInfo: () => closeModal("info"),
        closeCreateFolder: () => closeModal("createFolder"),
        openCreateFolder: () => {
            closeModal("folder");
            openModal("createFolder");
        },
        handleCreateFolder: (name) => {
            createFolder(name, category, FAVORITE_STATUS, []);
            closeModal("createFolder");
        },
    };

    return { modals, openModal, modalActions };
};
