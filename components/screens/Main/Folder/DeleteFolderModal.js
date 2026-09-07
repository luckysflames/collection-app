import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Trash2, FolderX, AlertCircle } from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";
import { useTheme } from "../../../../hooks/useTheme";

export default function DeleteFolderModal({
    visible,
    isEmpty,
    onClose,
    onDeleteAll,
    onDeleteOnlyFolder,
}) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    return (
        <BottomSheet visible={visible} onClose={onClose} containerStyle={styles.sheetContainer}>
            <View style={styles.iconHeader}>
                <AlertCircle color={theme.red} size={40} strokeWidth={1.5} />
            </View>

            <Text style={styles.header}>Удаление папки</Text>

            {isEmpty ? (
                <View>
                    <Text style={styles.subHeader}>Вы уверены, что хотите удалить папку?</Text>
                    <TouchableOpacity
                        style={[styles.optionBtn, styles.optionBtnDestructive]}
                        onPress={() => {
                            onDeleteOnlyFolder();
                            onClose();
                        }}
                    >
                        <View style={styles.iconBgDestructiveLight}>
                            <Trash2 color={theme.red} size={22} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.destructiveTitle}>Да, я уверен, удаляйте</Text>
                            <Text style={styles.optionDesc}>Долой пустые папки</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.subHeader}>
                        В папке есть карточки. Выберите способ удаления:
                    </Text>

                    <TouchableOpacity
                        style={styles.optionBtn}
                        onPress={() => {
                            onDeleteOnlyFolder();
                            onClose();
                        }}
                    >
                        <View style={styles.iconBg}>
                            <FolderX color={theme.accent} size={22} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Удалить только папку</Text>
                            <Text style={styles.optionDesc}>
                                Вы сможете найти карточки отсюда в разделе "Всё"
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.optionBtn, styles.optionBtnDestructive]}
                        onPress={() => {
                            onDeleteAll();
                            onClose();
                        }}
                    >
                        <View style={styles.iconBgDestructiveLight}>
                            <Trash2 color={theme.red} size={22} />
                        </View>
                        <View style={styles.optionTextContainer}>
                            <Text style={styles.destructiveTitle}>Удалить всё</Text>
                            <Text style={styles.optionDesc}>
                                Папка и всё её содержимое будут стёрты
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </BottomSheet>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        sheetContainer: {
            backgroundColor: theme.main,
            paddingHorizontal: 25,
        },
        iconHeader: {
            alignItems: "center",
            marginBottom: 10,
        },
        header: {
            color: theme.text,
            fontSize: 22,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 8,
        },
        subHeader: {
            color: theme.textDark,
            fontSize: 15,
            textAlign: "center",
            marginBottom: 30,
            paddingHorizontal: 20,
        },
        optionBtn: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderRadius: 20,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: theme.accent,
        },
        optionBtnDestructive: {
            borderColor: theme.red,
        },
        iconBg: {
            width: 44,
            height: 44,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.accentMuted,
        },
        iconBgDestructiveLight: {
            width: 44,
            height: 44,
            borderRadius: 14,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.redMuted,
        },
        optionTextContainer: {
            marginLeft: 15,
            flex: 1,
        },
        optionTitle: {
            color: theme.text,
            fontSize: 16,
            fontWeight: "700",
        },
        destructiveTitle: {
            color: theme.red,
            fontSize: 16,
            fontWeight: "700",
        },
        optionDesc: {
            color: theme.textDark,
            fontSize: 12,
            marginTop: 2,
        },
    });
