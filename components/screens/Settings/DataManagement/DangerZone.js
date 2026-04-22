import { StyleSheet, Text, View } from "react-native";
import { DangerItem } from "./DangerItem";
import { useCollectionStore } from "../../../../store/useCollectionStore";

export const DangerZone = ({ openConfirmModal }) => {
    const clearCollection = useCollectionStore(
        (state) => state.clearCollection,
    );
    const resetAllStatuses = useCollectionStore(
        (state) => state.resetAllStatuses,
    );
    const resetFullStore = useCollectionStore((state) => state.resetFullStore);
    const deletionPassword = useCollectionStore(
        (state) => state.deletionPassword,
    );

    return (
        <View>
            {/* СЕКЦИЯ ОПАСНЫХ ДЕЙСТВИЙ */}
            <Text style={styles.sectionTitle}>Опасные действия</Text>
            <View style={styles.card}>
                <DangerItem
                    title="Очистить коллекцию"
                    subtitle="Удалит все карточки и папки"
                    disabled={!deletionPassword}
                    onPress={() =>
                        openConfirmModal(
                            clearCollection,
                            "Очистка коллекции",
                        )
                    }
                />
                <DangerItem
                    title="Сброс статусов"
                    subtitle="Вернёт статусы к значениям по умолчанию"
                    disabled={!deletionPassword}
                    onPress={() =>
                        openConfirmModal(
                            resetAllStatuses,
                            "Сброс категорий",
                        )
                    }
                />
                <DangerItem
                    title="Очистить вообще всё"
                    subtitle="Полная очистка всех данных приложения"
                    disabled={!deletionPassword}
                    isLast
                    onPress={() =>
                        openConfirmModal(resetFullStore, "Полный сброс")
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        color: "#8E94A4",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        marginBottom: 12,
        marginLeft: 8,
        letterSpacing: 1.2,
    },
    card: {
        backgroundColor: "#0B1534",
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.12)",
        marginBottom: 25,
        // Небольшая тень для глубины
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
});
