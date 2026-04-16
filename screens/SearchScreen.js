import React, { useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useMediaSearch } from "../hooks/useMediaSearch";
import { MediaCard } from "../components/ui/MediaCard";
import { SearchHeader } from "../components/screens/Search/SearchHeader";
import { SearchSkeleton } from "../components/ui/Skeleton/SearchSkeleton";
import { CategorySelector } from "../components/screens/Search/CategorySelector";
import { NoResultsFooter } from "../components/screens/Search/NoResultsFooter";
import { ChevronLeft } from "lucide-react-native";

export default function SearchScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [isCategorySelected, setIsCategorySelected] = useState(false);

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
    } = useMediaSearch();

    // Вход в категорию
    const handlePickCategory = (cat) => {
        setActiveCategory(cat);
        setIsCategorySelected(true);
    };

    // Выход назад к выбору категорий
    const handleReset = () => {
        setIsCategorySelected(false);
        setQuery("");
        clearCache(); // Очищаем всё при выходе
    };

    if (!isCategorySelected) {
        return (
            <CategorySelector onSelect={handlePickCategory} insets={insets} />
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top - 20 }]}>
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
                    // ПАГИНАЦИЯ
                    onEndReachedThreshold={0.5}
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
                    // ИНДИКАТОР ЗАГРУЗКИ ДОП. ДАННЫХ
                    ListFooterComponent={() =>
                        loadingMore ? (
                            <ActivityIndicator
                                color="#7D8AFF"
                                style={{ marginVertical: 20 }}
                            />
                        ) : null
                    }
                    // СОСТОЯНИЕ "НИЧЕГО НЕ НАЙДЕНО"
                    ListEmptyComponent={() =>
                        !loading && (
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
    container: { flex: 1, backgroundColor: "#050B18" },
    backText: { color: "#7D8AFF", marginLeft: 10, fontSize: 14 },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100, paddingTop: 10 },
});
