import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "light" | "dark";

const themes = {
    light: {
        colors: {
            background: "#F4F5F7",
            surface: "#FFFFFF",
            surfaceAlt: "#EEF0F4",
            text: "#111827",
            textMuted: "#6B7280",
            border: "#D1D5DB",
            primary: "#6A5ACD",
        },
    },

    dark: {
        colors: {
            background: "#111318",
            surface: "#1B1F2A",
            surfaceAlt: "#252B38",
            text: "#F9FAFB",
            textMuted: "#A1A1AA",
            border: "#374151",
            primary: "#8B7CFF",
        },
    },
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] = useState<ThemeMode>("dark");

    return (
        <ThemeContext.Provider
            value={{
                mode,
                setMode,
                theme: themes[mode],
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);