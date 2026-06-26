import {
    View,
    Text,
    Pressable,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

export default function SettingsScreen() {
    const {
        mode,
        setMode,
        theme,
    } = useTheme();

    const {
        logout,
    } = useAuth();

    async function handleLogout() {
        await logout();

        router.replace(
            "/login" as any
        );
    }

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor:
                    theme.colors.background,
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    color:
                        theme.colors.text,
                    marginBottom: 30,
                }}
            >
                Settings
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.text,
                    marginBottom: 20,
                    fontSize: 18,
                }}
            >
                Theme
            </Text>

            <Pressable
                onPress={() =>
                    setMode(
                        "light"
                    )
                }
                style={{
                    backgroundColor:
                        mode ===
                            "light"
                            ? theme.colors.primary
                            : theme.colors.surface,

                    padding: 15,

                    borderRadius: 10,

                    marginBottom: 10,
                }}
            >
                <Text>
                    ☀️ Light
                    Mode
                </Text>
            </Pressable>

            <Pressable
                onPress={() =>
                    setMode(
                        "dark"
                    )
                }
                style={{
                    backgroundColor:
                        mode ===
                            "dark"
                            ? theme.colors.primary
                            : theme.colors.surface,

                    padding: 15,

                    borderRadius: 10,

                    marginBottom: 30,
                }}
            >
                <Text>
                    🌙 Dark
                    Mode
                </Text>
            </Pressable>

            <Pressable
                onPress={
                    handleLogout
                }
                style={{
                    backgroundColor:
                        "#B91C1C",

                    padding: 15,

                    borderRadius: 12,

                    alignItems:
                        "center",
                }}
            >
                <Text
                    style={{
                        color:
                            "white",

                        fontWeight:
                            "900",

                        fontSize: 16,
                    }}
                >
                    Log Out
                </Text>
            </Pressable>
        </View>
    );
}