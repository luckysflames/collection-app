import React, { forwardRef } from "react";
import { Animated, View, Dimensions } from "react-native";
import { CategoryPage } from "../../shared/CategoryPage";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const MainPager = forwardRef(
    (
        {
            CATEGORIES,
            searchQuery,
            currentSection,
            myCollection,
            navigation,
            sortType,
            showFoldersOnly,
            activeFilters,
            handleCardPress,
            onCardLongPress,
            onScroll,
            onMomentumScrollEnd,
            listKey,
        },
        ref,
    ) => {
        return (
            <Animated.FlatList
                key={listKey}
                ref={ref}
                data={CATEGORIES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                onScroll={onScroll}
                onMomentumScrollEnd={onMomentumScrollEnd}
                renderItem={({ item }) => (
                    <View style={{ width: SCREEN_WIDTH }}>
                        <CategoryPage
                            category={item}
                            searchQuery={searchQuery}
                            currentSection={currentSection}
                            data={myCollection}
                            navigation={navigation}
                            sortType={sortType}
                            activeFilters={activeFilters}
                            onCardPress={handleCardPress}
                            onCardLongPress={onCardLongPress}
                            showFoldersOnly={showFoldersOnly}
                        />
                    </View>
                )}
                keyExtractor={(item) => `${currentSection}-${item}`}
            />
        );
    },
);
