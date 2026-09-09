export const BASE_COLORS = {
    white: "#FFFFFF",
    whiteMuted: "#FFFFFF22",

    black: "#000000",
    blackMuted: "#00000022",

    red: "#FF5252",
    redMuted: "#FF525222",

    orange: "#E89149",
    orangeMuted: "#E8914922",

    yellow: "#FFD700",
    yellowMuted: "#FFD70022",

    transparent: "transparent",
};

export const THEMES = {
    geekly: {
        accent: "#7D8AFF",
        accentMuted: "#7D8AFF22",
        main: "#0B1534",
        dark: "#050B18",
        overlay: "rgba(2, 4, 10, 0.85)",
        text: "#FFFFFF",
        textDark: "#7f7f7f",
        chartColors: ["#7D8AFF", "#5362F6", "#35398C", "#212560", "#121538"],
    },
    schedly: {
        accent: "#0d82fd",
        accentMuted: "#0d82fd22",
        main: "#121212",
        dark: "#000000",
        overlay: "rgba(0, 0, 0, 0.85)",
        text: "#FFFFFF",
        textDark: "#2a2b2d",
        chartColors: ["#0D82FD", "#0A65C2", "#08498E", "#052E5C", "#02162E"],
    },
    leafly: {
        accent: "#e3cfa8",
        accentMuted: "#e3cfa822",
        main: "#132a22",
        dark: "#0a1813",
        overlay: "rgba(5, 12, 10, 0.85)",
        text: "#FFFFFF",
        textDark: "#335647",
        chartColors: ["#E3CFA8", "#BCA57A", "#8A7650", "#4D533C", "#243E33"],
    },
    finik: {
        accent: "#f5caa7",
        accentMuted: "#f5caa722",
        main: "#385144",
        dark: "#2d4237",
        overlay: "rgba(0, 0, 0, 0.8)",
        text: "#FFFFFF",
        textDark: "#3b7754",
        chartColors: ["#F5CAA7", "#DDA175", "#A86E49", "#6A7B6E", "#425B4E"],
    },
    nordic: {
        accent: "#f2e0d0",
        accentMuted: "#f2e0d022",
        main: "#738ab4",
        dark: "#6479a1",
        overlay: "rgba(0, 0, 0, 0.85)",
        text: "#FFFFFF",
        textDark: "#40629d",
        chartColors: ["#F2E0D0", "#CBB2A1", "#9CA3C7", "#5f7bb0", "#4C5F8A"],
    },
    berry: {
        accent: "#f0cdd2",
        accentMuted: "#f0cdd222",
        main: "#3c1950",
        dark: "#4a2461",
        overlay: "rgba(0, 0, 0, 0.85)",
        text: "#FFFFFF",
        textDark: "#8551a3",
        chartColors: ["#F0CDD2", "#C28CA2", "#8E4E77", "#5E255F", "#3C1950"],
    },
    coffee: {
        accent: "#eccdb1",
        accentMuted: "#eccdb122",
        main: "#44252b",
        dark: "#2e1116",
        overlay: "rgba(0, 0, 0, 0.85)",
        text: "#FFFFFF",
        textDark: "#855a63",
        chartColors: ["#ECCDB1", "#C49A7A", "#91624B", "#66383A", "#3a1d23"],
    },
    pumpkin: {
        accent: "#ffb07c",
        accentMuted: "#ffb07c22",
        main: "#2d1f1e",
        dark: "#1f1414",
        overlay: "rgba(15, 10, 10, 0.85)",
        text: "#FFFFFF",
        textDark: "#834239",
        chartColors: ["#FFB07C", "#D97B48", "#9E4C27", "#5B2A1E", "#3A1B17"],
    },
    sakura: {
        accent: "#fbcad0",
        accentMuted: "#fbcad022",
        main: "#211c27",
        dark: "#17131c",
        overlay: "rgba(10, 8, 13, 0.85)",
        text: "#FFFFFF",
        textDark: "#69484e",
        chartColors: ["#FBCAD0", "#C895A2", "#8F6073", "#56384B", "#2D2033"],
    },
    violet: {
        accent: "#B388FF",
        accentMuted: "#B388FF22",
        main: "#1C132B",
        dark: "#0F0A1C",
        overlay: "rgba(10, 6, 20, 0.85)",
        text: "#FFFFFF",
        textDark: "#7f7f7f",
        chartColors: ["#B388FF", "#805AD5", "#553C9A", "#322659", "#26173e"],
    },
};

export const DEFAULT_THEME_NAME = "geekly";

export const getThemeColors = (themeName = DEFAULT_THEME_NAME) => {
    const activeTheme = THEMES[themeName] || THEMES[DEFAULT_THEME_NAME];
    return {
        ...BASE_COLORS,
        ...activeTheme,
    };
};
