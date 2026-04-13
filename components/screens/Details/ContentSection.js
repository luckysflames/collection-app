import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { InfoBlock } from "./InfoBlock/index";

export const ContentSection = ({
    displayData,
    savedItem,
    isInCollection,
    onStatusPress,
    onUpdateNotes,
}) => (
    <View>
        <InfoBlock
            status={savedItem?.status}
            onStatusPress={onStatusPress}
            displayData={displayData}
        />

        <Text style={styles.sectionTitle}>Описание</Text>
        <Text style={styles.description}>
            {displayData.description || "Описание временно отсутствует."}
        </Text>

        {isInCollection && (
            <View style={styles.userSection}>
                <Text style={styles.sectionTitle}>Мои заметки</Text>
                <TextInput
                    style={styles.notesInput}
                    multiline
                    value={savedItem.userNotes || ""}
                    onChangeText={onUpdateNotes}
                    placeholder="Ваши мысли..."
                    placeholderTextColor="#444"
                />
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    editToggle: {
        alignSelf: "flex-start",
        marginTop: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#7D8AFF",
    },
    editToggleText: {
        color: "#7D8AFF",
        fontSize: 14,
        fontWeight: "500",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 25,
        marginBottom: 10,
    },
    description: {
        color: "#8E94A4",
        fontSize: 16,
        lineHeight: 26,
    },
    userSection: {
        marginTop: 10,
        paddingBottom: 60,
    },
    notesInput: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        padding: 15,
        color: "#fff",
        minHeight: 120,
        textAlignVertical: "top",
    },
});
