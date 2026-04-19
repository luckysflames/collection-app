import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: { marginBottom: 10 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
    },
    infoIconButton: {
        backgroundColor: "rgba(255,255,255,0.1)",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },
    infoIconText: { color: "#7D8AFF", fontSize: 18, fontWeight: "bold" },

    actionButtonsRow: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 20,
        marginTop: -5, // Чтобы прижать чуть ближе к кнопке статуса
    },
    actionBtn: {
        flex: 1, // Чтобы кнопки делили место поровну
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
    },
    actionBtnActive: {
        backgroundColor: "rgba(255, 215, 0, 0.08)",
    },
    actionBtnText: {
        color: "#8E94A4",
        fontSize: 13,
        fontWeight: "600",
    },

    quickMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    metaText: { color: "#8E94A4", fontSize: 14, fontWeight: "500" },
    scoreText: { color: "#FFD700", fontSize: 14, fontWeight: "bold" },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: "#444",
        marginHorizontal: 8,
    },

    statusBadge: {
        borderColor: "#7D8AFF",
        borderWidth: 1.5,
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    statusBadgeCollect: {
        backgroundColor: "#7D8AFF",
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    statusText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15,
    },

    statsGrid: {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    statSubGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    statRowSeparator: {
        height: 1,
        backgroundColor: "rgba(255,255,255,0.05)",
        marginVertical: 4,
    },
    subItem: { flex: 1 },
    statLabel: {
        color: "#8E94A4",
        fontSize: 11,
        marginBottom: 4,
        textTransform: "uppercase",
    },
    statValue: { color: "#fff", fontSize: 14, fontWeight: "600" },

    studioText: {
        color: "#7D8AFF",
        fontSize: 14,
        marginBottom: 15,
        paddingHorizontal: 5,
    },

    genreRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    badge: {
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    badgeText: { color: "#7D8AFF", fontSize: 12, fontWeight: "600" },

    // Стили модалки
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#1A2232",
        borderRadius: 20,
        padding: 20,
        width: "100%",
    },
    modalHeader: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    closeModalButton: { marginTop: 10, padding: 10, alignItems: "center" },
    closeModalButtonText: { color: "#8E94A4", fontSize: 14 },
    saveButton: {
        backgroundColor: "#3B82F6", // Синий
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    cancelButton: {
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#8E94A4",
        fontSize: 14,
    },
});
