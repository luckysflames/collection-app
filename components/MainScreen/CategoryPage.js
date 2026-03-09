import React from "react";
import { View, FlatList, Text, StyleSheet, Dimensions } from "react-native";
import { MediaCard } from "../MediaCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const CategoryPage = ({
    category,
    currentSection,
    data,
    navigation,
}) => {
    // Фильтруем данные внутри компонента страницы
    const pageData = data.filter(
        (item) =>
            item.appSection === currentSection &&
            (item.status || "Смотрю") === category,
    );

    return (
        <View style={{ width: SCREEN_WIDTH }}>
            <FlatList
                data={pageData}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listPadding}
                renderItem={({ item }) => (
                    <MediaCard
                        item={item}
                        onPress={() => navigation.navigate("Details", { item })}
                    />
                )}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            В разделе "{category}" пока пусто
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    listPadding: {
        paddingBottom: 120, // Запас под таб-бар
        paddingTop: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 50,
    },
    emptyText: {
        color: "#8E94A4",
        fontSize: 15,
        textAlign: "center",
        opacity: 0.6,
    },
});
