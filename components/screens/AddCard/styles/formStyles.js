import { StyleSheet } from "react-native";
import { useTheme } from "../../../../hooks/useTheme";

const createFormStyles = (theme) =>
    StyleSheet.create({
        input: {
            backgroundColor: theme.dark,
            borderRadius: 10,
            color: theme.text,
            padding: 12,
            fontSize: 15,
            marginBottom: 12,
        },
        rowInputs: { flexDirection: "row", gap: 12 },
    });

export const useFormStyles = () => {
    const { createStyles } = useTheme();
    return createStyles(createFormStyles);
};
