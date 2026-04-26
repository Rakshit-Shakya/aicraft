import { useTheme } from "next-themes";

export const UseCurrentTheme = () => {
    const { theme, systemTheme } = useTheme();
    if(theme === "dark" || theme === "light") {
        return theme;
    }
    return systemTheme;
};   

