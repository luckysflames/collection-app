import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ChevronLeft } from "lucide-react-native";

import { useMediaSearch } from "../hooks/useMediaSearch";
import { MediaCard } from "../components/ui/MediaCard";
import { SearchHeader } from "../components/screens/Search/SearchHeader";
import { SearchSkeleton } from "../components/ui/Skeleton/SearchSkeleton";
import { CategorySelector } from "../components/screens/Search/CategorySelector";
import { NoResultsFooter } from "../components/screens/Search/EmptyStateWindows/NoResultsFooter";
import { SearchEmptyState } from "../components/screens/Search/EmptyStateWindows/SearchEmptyState";

export default function SearchScreen({ navigation, route }) {
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
    } = useMediaSearch("movie");

    const handlePickCategory = (catId) => {
        setActiveCategory(catId);
        setIsCategorySelected(true);
    };

    // Логика сброса (вынесем в отдельную функцию для удобства)
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
                    handleReset(); // Если категория выбрана, сбрасываем её
                    return true; // Блокируем стандартный переход назад
                }
                return false; // Позволяем стандартное поведение
            };

            // Создаем подписку
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress,
            );

            // Правильная очистка через .remove()
            return () => subscription.remove();
        }, [isCategorySelected, handleReset]),
    );

    // Слушаем сигнал сброса из TabBar
    useEffect(() => {
        if (route.params?.reset) {
            handleReset();
            // Опционально: очищаем параметр, чтобы не срабатывало повторно при других действиях
            navigation.setParams({ reset: undefined });
        }
    }, [route.params?.reset, handleReset]);

    if (!isCategorySelected) {
        return (
            <CategorySelector onSelect={handlePickCategory} insets={insets} />
        );
    }

    return (
        <View style={styles.container}>
            <SearchHeader
                activeCategory={activeCategory}
                query={query}
                setQuery={setQuery}
                onSearch={() => handleSearch(query, activeCategory, true)}
                handleReset={handleReset}
                topInset={insets.top}
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
                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (
                            !loading &&
                            !loadingMore &&
                            !isEnd &&
                            query.length > 0
                        ) {
                            handleSearch(query, activeCategory, false);
                        }
                    }}
                    ListFooterComponent={() =>
                        loadingMore && (
                            <ActivityIndicator
                                color="#7D8AFF"
                                style={{ marginVertical: 20 }}
                            />
                        )
                    }
                    ListEmptyComponent={() => {
                        if (loading) return null; // Если идет загрузка, ничего не показываем (работает Skeleton)

                        // Если поисковая строка пуста (пользователь еще не начал искать)
                        if (query.trim().length === 0) {
                            return <SearchEmptyState />;
                        }

                        // Если запрос был сделан, но результатов 0
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#050B18" },
    backText: { color: "#7D8AFF", marginLeft: 10, fontSize: 14 },
    row: { justifyContent: "space-between", paddingHorizontal: 16 },
    listPadding: { paddingBottom: 100, paddingTop: 10 },
});
