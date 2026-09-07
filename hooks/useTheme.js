import { useMemo } from "react";
import { useCollectionStore } from "../store/useCollectionStore";
import { getThemeColors } from "../theme/themes";

export const useTheme = () => {
    const themeName = useCollectionStore((state) => state.themeName);
    const setThemeName = useCollectionStore((state) => state.setThemeName);

    const theme = useMemo(() => getThemeColors(themeName), [themeName]);

    const createStyles = (stylesFactory) => {
        return useMemo(() => stylesFactory(theme), [theme]);
    };

    return {
        theme,
        themeName,
        setThemeName,
        createStyles,
    };
};
