export type ThemeMode = "light" | "dark";

export const themes = {
    light: {
        mode: "light",
        colors: {
            background: "#F4F5F7",
            surface: "#FFFFFF",
            surfaceAlt: "#EEF0F4",
            text: "#111827",
            textMuted: "#6B7280",
            border: "#D1D5DB",
            primary: "#6A5ACD",
            danger: "#DC2626",
        },
    },

    dark: {
        mode: "dark",
        colors: {
            background: "#111318",
            surface: "#1B1F2A",
            surfaceAlt: "#252B38",
            text: "#F9FAFB",
            textMuted: "#A1A1AA",
            border: "#374151",
            primary: "#8B7CFF",
            danger: "#F87171",
        },
    },
} as const;

export const activeTheme = themes.light;