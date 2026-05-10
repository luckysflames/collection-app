import React from "react";
import * as Icons from "lucide-react-native";

export const DynamicIcon = ({ name, size = 24, color = "#fff", style }) => {
    // Получаем компонент иконки по строковому ключу
    const IconComponent = Icons[name];

    // Если иконка не найдена, рисуем заглушку (HelpCircle)
    if (!IconComponent) {
        return <Icons.HelpCircle size={size} color={color} style={style} />;
    }

    return <IconComponent size={size} color={color} style={style} />;
};
