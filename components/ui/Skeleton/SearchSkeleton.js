import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { SkeletonCard } from "./SkeletonCard";

export const SearchSkeleton = () => {
    const data = Array.from({ length: 6 });

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                numColumns={2}
                columnWrapperStyle={styles.row}
                keyExtractor={(_, index) => index.toString()}
                renderItem={() => <SkeletonCard />}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
});
