import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Pressable,
    StyleSheet,
    Animated,
    PanResponder,
    Dimensions,
    FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FolderPlus, Folder as FolderIcon, Check } from "lucide-react-native";

import { useCollectionStore } from "../../../../store/useCollectionStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function FolderSelectModal({
    visible,
    onClose,
    folders,
    onSelect,
    onCreateNew,
    selectedFolderIds = [], // Список ID папок, где уже есть этот айтем
}) {
    const insets = useSafeAreaInsets();
    const [shouldRender, setShouldRender] = useState(visible);
    const panY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    const myCollection = useCollectionStore((state) => state.myCollection);

    useEffect(() => {
        if (visible) {
            setShouldRender(true);
            Animated.spring(panY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
            }).start();
        }
    }, [visible]);

    const closeModal = () => {
        Animated.timing(panY, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            setShouldRender(false);
            onClose();
        });
    };

    // ОБНОВЛЕНО: Считаем айтемы, у которых id этой папки есть в массиве parentFolderIds
    const getItemCount = (folderId) => {
        return myCollection.filter(
            (item) =>
                item.parentFolderIds && item.parentFolderIds.includes(folderId),
        ).length;
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) =>
                gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) panY.setValue(gestureState.dy);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150 || gestureState.vy > 0.5) {
                    closeModal();
                } else {
                    Animated.spring(panY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        }),
    ).current;

    if (!shouldRender && !visible) return null;

    return (
        <Modal
            transparent
            visible={visible || shouldRender}
            animationType="none"
            statusBarTranslucent
            onRequestClose={closeModal}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    {
                        opacity: panY.interpolate({
                            inputRange: [0, SCREEN_HEIGHT / 2],
                            outputRange: [1, 0],
                            extrapolate: "clamp",
                        }),
                    },
                ]}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={closeModal}
                />

                <Animated.View
                    style={[
                        styles.content,
                        {
                            paddingBottom:
                                insets.bottom > 0 ? insets.bottom + 10 : 20,
                            transform: [{ translateY: panY }],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    <View style={styles.handle} />
                    <Text style={styles.header}>Добавить в папку</Text>

                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={() => {
                            onCreateNew();
                            closeModal();
                        }}
                    >
                        <View style={styles.createIconBg}>
                            <FolderPlus color="#fff" size={20} />
                        </View>
                        <Text style={styles.createBtnText}>
                            Создать новую папку
                        </Text>
                    </TouchableOpacity>

                    <View style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}>
                        <FlatList
                            data={folders}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                const isSelected = selectedFolderIds.includes(
                                    item.id,
                                );
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.folderItem,
                                            isSelected &&
                                                styles.folderItemActive,
                                        ]}
                                        onPress={() => {
                                            onSelect(item.id); // handleAddToFolder в useDetailsActions разберется: добавить или удалить
                                        }}
                                    >
                                        <View
                                            style={[
                                                styles.folderIconWrapper,
                                                isSelected &&
                                                    styles.folderIconWrapperActive,
                                            ]}
                                        >
                                            <FolderIcon
                                                color={
                                                    isSelected
                                                        ? "#7D8AFF"
                                                        : "#8E94A4"
                                                }
                                                size={20}
                                            />
                                        </View>

                                        <View style={styles.folderInfo}>
                                            <Text
                                                style={[
                                                    styles.folderText,
                                                    isSelected &&
                                                        styles.folderTextActive,
                                                ]}
                                            >
                                                {item.title}
                                            </Text>
                                            <Text style={styles.folderSubtext}>
                                                Элементов:{" "}
                                                {getItemCount(item.id)}
                                            </Text>
                                        </View>

                                        {isSelected && (
                                            <View style={styles.checkWrapper}>
                                                <Check
                                                    color="#7D8AFF"
                                                    size={20}
                                                    strokeWidth={3}
                                                />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>
                                    У вас пока нет папок
                                </Text>
                            }
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={closeModal}
                    >
                        <Text style={styles.closeBtnText}>Готово</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "flex-end",
    },
    content: {
        backgroundColor: "#0B1534",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: 3,
        alignSelf: "center",
        marginBottom: 15,
    },
    header: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    createBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(125, 138, 255, 0.08)",
        padding: 14,
        borderRadius: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "rgba(125, 138, 255, 0.15)",
    },
    createIconBg: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: "#7D8AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    createBtnText: {
        color: "#7D8AFF",
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "700",
    },
    folderItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginBottom: 4,
    },
    folderItemActive: {
        backgroundColor: "rgba(125, 138, 255, 0.05)",
    },
    folderIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    folderIconWrapperActive: {
        backgroundColor: "rgba(125, 138, 255, 0.1)",
    },
    folderInfo: {
        flex: 1,
    },
    folderText: {
        color: "#8E94A4",
        fontSize: 16,
        fontWeight: "600",
    },
    folderTextActive: {
        color: "#fff",
    },
    folderSubtext: {
        color: "#4E5564",
        fontSize: 12,
        marginTop: 2,
    },
    checkWrapper: {
        marginLeft: 10,
    },
    emptyText: {
        color: "#8E94A4",
        textAlign: "center",
        marginVertical: 30,
        fontSize: 15,
    },
    closeBtn: {
        marginTop: 20,
        alignItems: "center",
        padding: 16,
        backgroundColor: "#7D8AFF",
        borderRadius: 20,
    },
    closeBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
