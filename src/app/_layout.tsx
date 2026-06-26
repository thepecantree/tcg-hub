import { Stack } from "expo-router";

import {
    ThemeProvider,
    useTheme,
} from "@/theme/ThemeContext";

import {
    AuthProvider,
} from "@/auth/AuthContext";

function RootStack() {
    const { theme } =
        useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor:
                        theme.colors.background,
                },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="inbox" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootStack />
            </AuthProvider>
        </ThemeProvider>
    );
}