import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { MediaCard } from "../components/MediaCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMediaSearch } from "../hooks/useMediaSearch";
import { SearchHeader } from "../components/SearchScreen/SearchHeader";
import { SearchEmptyState } from "../components/SearchScreen/SearchEmptyState";
import { NoResultsFooter } from "../components/SearchScreen/NoResultsFooter";
import { SearchSkeleton } from "../components/SearchScreen/Skeleton/SearchSkeleton";

export default function SearchScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const {
        query,
        setQuery,
        results,
        loading,
        activeCategory,
        setActiveCategory,
        handleSearch,
        getCategoryById,
    } = useMediaSearch();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <SearchHeader
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
            />

            {query.length === 0 && <SearchEmptyState />}

            {/* Если идет загрузка — показываем скелетоны */}
            {loading ? (
                <SearchSkeleton />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listPadding}
                    renderItem={({ item }) => (
                        <MediaCard
                            item={item}
                            onPress={() =>
                                navigation.navigate("Details", {
                                    item,
                                    category: getCategoryById(item.id),
                                })
                            }
                        />
                    )}
                    ListEmptyComponent={() =>
                        !loading &&
                        query.length > 2 && (
                            <NoResultsFooter
                                onPress={() =>
                                    navigation.navigate("AddCard", {
                                        currentSection: activeCategory,
                                    })
                                }
                            />
                        )
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#050B18",
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    listPadding: {
        paddingBottom: 100,
        paddingTop: 20,
    },
});
