import {
    Redirect,
} from "expo-router";

import {
    View,
    ActivityIndicator,
} from "react-native";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    useTheme,
} from "@/theme/ThemeContext";

export default function ProfileScreen() {
    const {
        user,
        loading,
    } = useAuth();

    const {
        theme,
    } = useTheme();

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                        theme.colors.background,
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (!user?.id) {
        return (
            <Redirect
                href={
                    "/login" as any
                }
            />
        );
    }

    return (
        <Redirect
            href={
                {
                    pathname:
                        "/(tabs)/player/[id]",
                    params: {
                        id:
                            user.id,
                    },
                } as any
            }
        />
    );
}