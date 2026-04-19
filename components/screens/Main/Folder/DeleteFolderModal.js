import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Trash2, FolderX, AlertCircle } from "lucide-react-native";
import { BottomSheet } from "../../../ui/BottomSheet";

export default function DeleteFolderModal({
    visible,
    onClose,
    onDeleteAll,
    onDeleteOnlyFolder,
}) {
    return (
        <BottomSheet
            visible={visible}
            onClose={onClose}
            containerStyle={styles.sheetContainer}
        >
            <View style={styles.iconHeader}>
                <AlertCircle color="#FF4B4B" size={40} strokeWidth={1.5} />
            </View>

            <Text style={styles.header}>Удаление папки</Text>
            <Text style={styles.subHeader}>
                В папке есть элементы. Выберите способ удаления:
            </Text>

            {/* Вариант 1: Удалить только папку */}
            <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => {
                    onDeleteOnlyFolder();
                    onClose();
                }}
            >
                <View
                    style={[
                        styles.iconBg,
                        { backgroundColor: "rgba(125, 138, 255, 0.1)" },
                    ]}
                >
                    <FolderX color="#7D8AFF" size={22} />
                </View>
                <View style={styles.optionTextContainer}>
                    <Text style={styles.optionTitle}>Удалить только папку</Text>
                    <Text style={styles.optionDesc}>
                        Элементы переместятся в общую библиотеку
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Вариант 2: Удалить всё */}
            <TouchableOpacity
                style={[styles.optionBtn, styles.optionBtnDestructive]}
                onPress={() => {
                    onDeleteAll();
                    onClose();
                }}
            >
                <View
                    style={[
                        styles.iconBg,
                        { backgroundColor: "rgba(255, 75, 75, 0.1)" },
                    ]}
                >
                    <Trash2 color="#FF4B4B" size={22} />
                </View>
                <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: "#FF4B4B" }]}>
                        Удалить всё
                    </Text>
                    <Text style={styles.optionDesc}>
                        Папка и всё её содержимое будут стерты
                    </Text>
                </View>
            </TouchableOpacity>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: "#0B1534",
        paddingHorizontal: 25,
    },
    iconHeader: {
        alignItems: "center",
        marginBottom: 10,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        textAlign: "center",
        marginBottom: 8,
    },
    subHeader: {
        color: "#8E94A4",
        fontSize: 15,
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    optionBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.05)",
    },
    optionBtnDestructive: {
        borderColor: "rgba(255, 75, 75, 0.1)",
    },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    optionTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    optionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    optionDesc: {
        color: "#62697D",
        fontSize: 12,
        marginTop: 2,
    },
});
