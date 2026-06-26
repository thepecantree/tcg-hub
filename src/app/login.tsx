import {
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    router,
} from "expo-router";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    API_BASE_URL,
} from "@/api/config";

type DevUser = {
    id: string;
    username: string;
    displayName: string;
};

export default function LoginScreen() {
    const { theme } =
        useTheme();

    const {
        login,
    } = useAuth();

    const [
        users,
        setUsers,
    ] = useState<
        DevUser[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(
        true
    );

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/auth/dev-users`
                );

            const data =
                await response.json();

            setUsers(
                data
            );
        } catch { }

        setLoading(
            false
        );
    }

    async function handleLogin(
        identifier: string
    ) {
        const success =
            await login(
                identifier
            );

        if (
            success
        ) {
            router.replace(
                "/(tabs)/hubs"
            );
        }
    }

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.background,
            }}
            contentContainerStyle={{
                padding: 20,
                gap: 14,
            }}
        >
            <Text
                style={{
                    color:
                        theme.colors.text,
                    fontSize:
                        34,
                    fontWeight:
                        "900",
                    marginTop:
                        40,
                }}
            >
                TCG Hub
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                    marginBottom:
                        10,
                }}
            >
                Select a development account
            </Text>

            {!loading &&
                users.map(
                    (
                        user
                    ) => (
                        <Pressable
                            key={
                                user.id
                            }
                            onPress={() =>
                                handleLogin(
                                    user.id
                                )
                            }
                            style={{
                                backgroundColor:
                                    theme.colors.surface,
                                borderWidth:
                                    1,
                                borderColor:
                                    theme.colors.border,
                                borderRadius:
                                    16,
                                padding:
                                    16,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        theme.colors.text,
                                    fontWeight:
                                        "900",
                                    fontSize:
                                        18,
                                }}
                            >
                                {
                                    user.displayName
                                }
                            </Text>

                            <Text
                                style={{
                                    color:
                                        theme.colors.textMuted,
                                    marginTop:
                                        4,
                                }}
                            >
                                ||
                                {" "}
                                {
                                    user.username
                                }
                            </Text>

                            <Text
                                style={{
                                    color:
                                        theme.colors.primary,
                                    marginTop:
                                        10,
                                    fontWeight:
                                        "900",
                                }}
                            >
                                Login
                            </Text>
                        </Pressable>
                    )
                )}
        </ScrollView>
    );
}