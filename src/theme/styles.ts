import { StyleSheet } from "react-native";
import { activeTheme as theme } from "./theme";

export const colors = theme.colors;

export const layout = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    centeredScreen: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    card: {
        width: "100%",
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
});

export const text = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.text,
    },

    subtitle: {
        fontSize: 16,
        color: colors.textMuted,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.text,
        marginBottom: 8,
    },

    body: {
        fontSize: 15,
        color: colors.text,
    },

    muted: {
        fontSize: 14,
        color: colors.textMuted,
    },
});