import React, { useState, useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, BackHandler } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { useCollectionStore } from "../store/useCollectionStore";
import { useMediaSearch } from "../hooks/useMediaSearch";
import { MediaCard } from "../components/ui/MediaCard";
import { SearchHeader } from "../components/screens/Search/SearchHeader";
import { SearchSkeleton } from "../components/ui/Skeleton/SearchSkeleton";
import { CategorySelector } from "../components/screens/Search/CategorySelector";
import { NoResultsFooter } from "../components/screens/Search/EmptyStateWindows/NoResultsFooter";
import { SearchEmptyState } from "../components/screens/Search/EmptyStateWindows/SearchEmptyState";
import { useTheme } from "../hooks/useTheme";

export default function SearchScreen({ navigation, route }) {
    const { theme, createStyles } = useTheme();
    const styles = createStyles(createLocalStyles);

    const insets = useSafeAreaInsets();
    const [isCategorySelected, setIsCategorySelected] = useState(false);

    const myCollection = useCollectionStore((state) => state.myCollection);

    const normalizeItemId = useCallback((id) => {
        if (!id) return "";
        const parts = String(id).split("-");
        return parts.length > 2 ? parts.slice(0, -1).join("-") : String(id);
    }, []);

    const {
        query,
        setQuery,
        results,
        loading,
        loadingMore,
        activeCategory,
        setActiveCategory,
        handleSearch,
        isEnd,
        getCategoryById,
        clearCache,
        lastSearchedQuery,
    } = useMediaSearch("movie");

    const collectionMapByBaseId = useMemo(() => {
        const map = new Map();
        myCollection.forEach((item) => {
            map.set(normalizeItemId(item.id), item);
        });
        return map;
    }, [myCollection, normalizeItemId]);

    const mergedResults = useMemo(
        () =>
            results.map((item) => {
                const savedItem = collectionMapByBaseId.get(normalizeItemId(item.id));
                return savedItem ? { ...item, ...savedItem } : item;
            }),
        [results, collectionMapByBaseId, normalizeItemId],
    );

    const handlePickCategory = (catId) => {
        setActiveCategory(catId);
        setIsCategorySelected(true);
    };

    const handleReset = useCallback(() => {
        setIsCategorySelected(false);
        setQuery("");
        clearCache();
    }, [clearCache, setQuery]);

    // Перехват кнопки "Назад"
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (isCategorySelected) {
                    handleReset();
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => subscription.remove();
        }, [isCategorySelected, handleReset]),
    );

    // Слушаем сигнал сброса из TabBar
    useEffect(() => {
        if (route.params?.reset) {
            handleReset();
            navigation.setParams({ reset: undefined });
        }
    }, [route.params?.reset, handleReset]);

    if (!isCategorySelected) {
        return <CategorySelector onSelect={handlePickCategory} insets={insets} />;
    }

    return (
        <View style={styles.container}>
            <SearchHeader
                activeCategory={activeCategory}
                query={query}
                setQuery={setQuery}
                onSearch={() => handleSearch(query, activeCategory, true)}
                handleReset={handleReset}
            />

            {loading ? (
                <SearchSkeleton />
            ) : (
                <FlatList
                    key={activeCategory}
                    data={mergedResults}
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
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (
                            !loading &&
                            !loadingMore &&
                            !isEnd &&
                            query.length > 0 &&
                            query.trim() === lastSearchedQuery.trim()
                        ) {
                            handleSearch(query, activeCategory, false);
                        }
                    }}
                    ListFooterComponent={() =>
                        loadingMore && (
                            <ActivityIndicator
                                color={theme.accent}
                                style={{ marginVertical: 20 }}
                            />
                        )
                    }
                    ListEmptyComponent={() => {
                        if (loading) return null;

                        if (query.trim().length === 0) {
                            return <SearchEmptyState />;
                        }

                        return (
                            <NoResultsFooter
                                onPress={() =>
                                    navigation.navigate("AddCard", {
                                        currentSection: activeCategory,
                                    })
                                }
                            />
                        );
                    }}
                />
            )}
        </View>
    );
}

const createLocalStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.dark,
        },
        backText: {
            color: theme.accent,
            marginLeft: 10,
            fontSize: 14,
        },
        row: {
            justifyContent: "space-between",
            paddingHorizontal: 16,
        },
        listPadding: {
            paddingBottom: 100,
            paddingTop: 10,
        },
    });
