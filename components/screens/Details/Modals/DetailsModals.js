import React from "react";
import StatusModal from "../../../shared/StatusModal";
import FolderSelectModal from "./FolderSelectModal";
import { WarnModal } from "../../../ui/WarnModal";
import { CreateFolderModal } from "../../Main/Modals/CreateFolderModal"; // Проверь путь
import { FAVORITE_STATUS } from "../../../../constants";

export const DetailsModals = ({ state, actions, data, handlers }) => {
    // Внутренний хэндлер для создания
    const handleFolderCreated = (name) => {
        // Здесь можно вызвать логику создания из твоего стора
        // Например: handlers.handleCreateNewFolder(name);
        actions.closeCreateFolder();
    };

    return (
        <>
            <WarnModal
                visible={state.isInfoVisible}
                title="О личной оценке"
                message="Эта оценка видна только Вам. Она помогает структурировать Вашу личную коллекцию..."
                type="info"
                onClose={actions.closeInfo}
            />

            <FolderSelectModal
                visible={state.isFolderVisible}
                folders={data.existingFolders}
                selectedFolderIds={data.parentFolderIds}
                onClose={actions.closeFolder}
                onSelect={handlers.handleAddToFolder}
                onCreateNew={actions.openCreateFolder}
            />

            <CreateFolderModal
                isVisible={state.isCreateFolderVisible}
                onClose={actions.closeCreateFolder}
                onCreate={handlers.handleCreateFolder}
                activeCategory={FAVORITE_STATUS}
            />

            <StatusModal
                visible={state.isStatusVisible}
                category={data.category || "Фильмы"}
                onClose={actions.closeStatus}
                onSelect={handlers.handleStatusUpdate}
                currentStatus={data.currentStatus}
                removeCard={handlers.handleDelete}
            />
        </>
    );
};
