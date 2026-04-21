import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Animated,
} from "react-native";
import { ChevronLeft, Search, X } from "lucide-react-native";

export const ScreenHeader = ({
    title,
    onAddPress,
    onBack,
    searchQuery,
    setSearchQuery,
}) => {
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef(null);

    const toggleSearch = () => {
        if (isSearching) {
            setSearchQuery(""); // Сброс при закрытии
        }
        setIsSearching(!isSearching);
        if (!isSearching) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <View style={styles.headerRow}>
            {isSearching ? (
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder="Поиск по названию..."
                        placeholderTextColor="#4E5566"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        selectionColor="#7D8AFF"
                    />
                    <TouchableOpacity
                        onPress={toggleSearch}
                        style={styles.closeButton}
                    >
                        <X size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <TouchableOpacity
                        onPress={onBack}
                        style={styles.headerButton}
                    >
                        <ChevronLeft size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title}
                    </Text>

                    <View style={styles.headerButton}>
                        <TouchableOpacity onPress={toggleSearch}>
                            <Search size={26} color="#7D8AFF" />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 75, // Фиксируем высоту, чтобы поиск не «прыгал»
    },
    headerButton: {
        backgroundColor: "rgba(11, 21, 52, 0.8)",
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
        marginHorizontal: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
    },
    searchInput: {
        flex: 1,
        color: "#fff",
        fontSize: 16,
    },
    closeButton: {
        marginLeft: 10,
    },
});
