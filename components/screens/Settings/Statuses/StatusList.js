import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { StatusItem } from "./StatusItem";
import { PROTECTED_STATUSES } from "../../../../constants/index";

const ITEM_HEIGHT = 58;
const ITEM_GAP = 10;
const TOTAL_OFFSET = ITEM_HEIGHT + ITEM_GAP;

export const StatusList = ({
    statuses,
    section,
    onStatusesChange,
    onDragStateChange,
    onDelete,
    defaultStatus,
    onSetDefault,
}) => {
    const activeId = useSharedValue(null);

    // Сразу генерируем начальные позиции, чтобы при первом рендере не было пустых позиций (избегаем слипания)
    const initialPositions = useMemo(() => {
        const pos = {};
        statuses.forEach((status, index) => {
            pos[status] = index;
        });
        return pos;
    }, [statuses]);

    const positions = useSharedValue(initialPositions);

    // Синхронизируем, если массив поменялся извне (например, статус удалили)
    React.useEffect(() => {
        positions.value = initialPositions;
    }, [initialPositions]);

    const handleDragEnd = (fromIndex, toIndex) => {
        if (toIndex < 0 || toIndex >= statuses.length || fromIndex === toIndex) return;
        const updated = [...statuses];
        const [movedItem] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedItem);
        onStatusesChange(updated);
    };

    return (
        // Используем TOTAL_OFFSET для точного расчета высоты контейнера
        <View style={[styles.listContainer, { height: statuses.length * TOTAL_OFFSET }]}>
            {statuses.map((status, index) => (
                <StatusItem
                    key={`${section}-${status}`}
                    id={status}
                    status={status}
                    index={index} // Исходный индекс в массиве
                    statusesCount={statuses.length}
                    activeId={activeId}
                    positions={positions}
                    isSystem={PROTECTED_STATUSES.includes(status)}
                    onDelete={onDelete}
                    onDragStart={() => onDragStateChange(true)}
                    onDragEnd={(fromIdx, toIdx) => {
                        onDragStateChange(false);
                        handleDragEnd(fromIdx, toIdx);
                    }}
                    isSelectedDefault={status === defaultStatus}
                    onSetDefault={onSetDefault}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        position: "relative",
        width: "100%",
    },
});
