import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const HeroPoster = ({
    image,
    isEditing,
    onPickImage,
    posterWidth = 240,
    posterHeight = 340,
}) => {
    return (
        <View style={styles.posterWrapper}>
            <View
                style={[
                    styles.posterFrame,
                    { width: posterWidth, height: posterHeight },
                ]}
            >
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {isEditing && (
                    <TouchableOpacity
                        style={styles.cameraOverlay}
                        onPress={onPickImage}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="camera" size={32} color="#fff" />
                        <Text style={styles.cameraText}>Изменить</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    posterWrapper: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 25,
    },
    posterFrame: {
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: "#1A2232",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
    },
});
