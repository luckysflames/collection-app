import React from "react";
import * as Icons from "lucide-react-native";

export const DynamicIcon = ({ name, size = 24, color, style }) => {
    const IconComponent = Icons[name];

    if (!IconComponent) {
        return <Icons.HelpCircle size={size} color={color} style={style} />;
    }

    return <IconComponent size={size} color={color} style={style} />;
};
