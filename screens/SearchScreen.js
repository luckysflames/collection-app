import React from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useMediaSearch } from "../hooks/useMediaSearch";
import { MediaCard } from "../components/ui/MediaCard";
import { SearchHeader } from "../components/screens/Search/SearchHeader";
import { SearchEmptyState } from "../components/screens/Search/SearchEmptyState";
import { NoResultsFooter } from "../components/screens/Search/NoResultsFooter";
import { SearchSkeleton } from "../components/ui/Skeleton/SearchSkeleton";

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
        isEnd,
        loadingMore,
    } = useMediaSearch();

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
            <SearchHeader
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
            />

            {query.length === 0 && results.length === 0 && <SearchEmptyState />}

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
                    // ЛЕНИВАЯ ЗАГРУЗКА
                    onEndReachedThreshold={0.5} // Сработает, когда до конца останется пол-экрана
                    onEndReached={() => {
                        if (
                            !loading &&
                            !loadingMore &&
                            !isEnd &&
                            query.length >= 3
                        ) {
                            handleSearch(query, activeCategory, false);
                        }
                    }}
                    // ИНДИКАТОР ЗАГРУЗКИ ВНИЗУ
                    ListFooterComponent={() =>
                        loadingMore ? (
                            <ActivityIndicator
                                color="#7D8AFF"
                                style={{ marginVertical: 20 }}
                            />
                        ) : null
                    }
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
