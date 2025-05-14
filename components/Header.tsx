import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Removed invalid IconProps import

interface HeaderProps {
    title: string;
    onBack?: () => void;
    onToggleTheme?: () => void;
    isDarkMode?: boolean;
    dynamicStyles?: any;
    backIconName?: keyof typeof MaterialIcons.glyphMap;
    count?: number;
}

export default function Header({
    title,
    onBack,
    onToggleTheme,
    isDarkMode = false,
    dynamicStyles = {},
    backIconName = "arrow-back",
    count = 0,
}: HeaderProps) {
    return (
        <View style={[styles.header, dynamicStyles.header]}>
            {onBack && (
                <TouchableOpacity onPress={onBack} style={{ marginLeft: "1%" }}>
                    <MaterialIcons
                        name={backIconName}
                        size={28}
                        color={isDarkMode ? "#FFFFFF" : "#000"}
                    />
                </TouchableOpacity>
            )}
            <Text style={[dynamicStyles.text, { fontWeight: "bold", fontSize: 30 }]}>
                {title}
                {count > 0 && (
                    <Text style={{ fontSize: 12 }}> ({count})</Text>
                )}
            </Text>
            {onToggleTheme && (
                <TouchableOpacity onPress={onToggleTheme} style={{ marginRight: "1%" }}>
                    <MaterialIcons
                        name={isDarkMode ? "wb-sunny" : "dark-mode"}
                        size={24}
                        color={isDarkMode ? "#FFD700" : "black"}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
        paddingHorizontal: 20,
    },
});