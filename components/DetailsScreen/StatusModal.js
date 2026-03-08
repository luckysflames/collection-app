import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    TouchableWithoutFeedback,
    StyleSheet,
} from "react-native";

const STATUSES = ["Смотрю", "В планах", "Просмотрено", "Брошено", "Отложено"];

export const StatusModal = ({ visible, onClose, onSelect, currentStatus }) => (
    <Modal transparent visible={visible} animationType="slide">
        <Pressable style={styles.overlay} onPress={onClose}>
            <TouchableWithoutFeedback>
                <View style={styles.content}>
                    <Text style={styles.header}>Статус просмотра</Text>
                    {STATUSES.map((s) => (
                        <TouchableOpacity
                            key={s}
                            onPress={() => onSelect(s)}
                            style={styles.option}
                        >
                            <Text style={styles.optionText}>{s}</Text>
                            {currentStatus === s && (
                                <View style={styles.activeDot} />
                            )}
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={{ color: "#8E94A4" }}>Отмена</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </Pressable>
    </Modal>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "flex-end",
    },
    content: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
    },
    header: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.05)",
    },
    optionText: { color: "#fff", fontSize: 18 },
    activeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#7D8AFF",
    },
    closeBtn: { marginTop: 20, alignItems: "center", padding: 10 },
});
