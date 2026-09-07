import { StyleSheet, Text, View } from "react-native";
import { DangerItem } from "./DangerItem";
import { useCollectionStore } from "../../../../store/useCollectionStore";
import { useTheme } from "../../../../hooks/useTheme";

export const DangerZone = ({ openConfirmModal }) => {
    const { createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const clearCollection = useCollectionStore((state) => state.clearCollection);
    const resetAllStatuses = useCollectionStore((state) => state.resetAllStatuses);
    const resetFullStore = useCollectionStore((state) => state.resetFullStore);
    const deletionPassword = useCollectionStore((state) => state.deletionPassword);

    return (
        <View>
            <Text style={styles.sectionTitle}>Опасные действия</Text>
            <View style={styles.card}>
                <DangerItem
                    title="Очистить коллекцию"
                    subtitle="Удалит все карточки и папки"
                    disabled={!deletionPassword}
                    onPress={() => openConfirmModal(clearCollection, "Очистка коллекции")}
                />
                <DangerItem
                    title="Сброс статусов"
                    subtitle="Вернёт статусы к значениям по умолчанию"
                    disabled={!deletionPassword}
                    onPress={() => openConfirmModal(resetAllStatuses, "Сброс категорий")}
                />
                <DangerItem
                    title="Очистить вообще всё"
                    subtitle="Полная очистка всех данных приложения"
                    disabled={!deletionPassword}
                    isLast
                    onPress={() => openConfirmModal(resetFullStore, "Полный сброс")}
                />
            </View>
        </View>
    );
};

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sectionTitle: {
            color: theme.textDark,
            fontSize: 12,
            fontWeight: "700",
            textTransform: "uppercase",
            marginBottom: 12,
            marginLeft: 8,
            letterSpacing: 1.2,
        },
        card: {
            backgroundColor: theme.main,
            borderRadius: 24,
            padding: 20,
            marginBottom: 25,
        },
    });
