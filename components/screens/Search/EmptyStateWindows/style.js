import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
    content: {
        marginTop: 40,
        alignItems: "center",
        paddingHorizontal: 20,
    },
    card: {
        width: width * 0.85,
        backgroundColor: "#0B1534", // Цвет из WarnModal
        borderRadius: 32,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.2)",
        // Тень как в модалке
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        color: "#FFF",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
        textAlign: "center",
    },
    subtitle: {
        color: "#8E94A4",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    addButton: {
        backgroundColor: "#7D8AFF",
        width: "100%",
        height: 58,
        borderRadius: 18,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#7D8AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    addButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
