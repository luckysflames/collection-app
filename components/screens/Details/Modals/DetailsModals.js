import React from "react";
import StatusModal from "../../../shared/StatusModal";
import FolderSelectModal from "./FolderSelectModal";
import { WarnModal } from "../../../ui/WarnModal";

export const DetailsModals = ({
    state, // объект со всеми visibility
    actions, // функции закрытия/открытия
    data, // необходимые данные (category, folders, и т.д.)
    handlers, // функции обработки (onSelect, onDelete)
}) => (
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
            onCreateNew={actions.closeFolder}
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
