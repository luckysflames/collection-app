import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusItem } from "./StatusItem";
import { SYSTEM_STATUSES } from "../../../../constants";

export const StatusList = ({
    statuses,
    section,
    onMove,
    onDelete,
    defaultStatus,
    onSetDefault,
}) => {
    return (
        <View style={styles.listContainer}>
            {statuses.map((status, index) => (
                <StatusItem
                    key={`${section}-${status}`}
                    status={status}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === statuses.length - 1}
                    isSystem={SYSTEM_STATUSES.includes(status)}
                    onDelete={onDelete}
                    onMove={onMove}
                    isSelectedDefault={status === defaultStatus}
                    onSetDefault={onSetDefault}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    scrollArea: { flex: 1 },
    listContainer: { gap: 8 },
});
