import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeContext";
import AppHeader from "@/components/layout/AppHeader";

import {
    useAuth,
} from "@/auth/AuthContext";

export default function TabLayout() {
    const { theme } =
        useTheme();

    const {
        user,
    } = useAuth();

    return (
        <Tabs
            backBehavior="history"
            screenOptions={{
                header: ({
                    options,
                }) => (
                    <AppHeader
                        title={String(
                            options.title ??
                            ""
                        )}
                    />
                ),

                tabBarActiveTintColor:
                    theme.colors.primary,

                tabBarInactiveTintColor:
                    theme.colors.textMuted,

                tabBarStyle: {
                    backgroundColor:
                        theme.colors.surface,

                    borderTopColor:
                        theme.colors.border,
                },
            }}
        >
            <Tabs.Screen
                name="hubs"
                listeners={{
                    tabPress: () => {
                        router.replace("/hubs");
                    },
                }}
                options={{
                    title: "HUBS",
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="business-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="cards"
                listeners={{
                    tabPress: () => {
                        router.replace("/cards");
                    },
                }}
                options={{
                    title: "CARDS",
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="albums-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="people"
                listeners={{
                    tabPress: () => {
                        router.replace("/people");
                    },
                }}
                options={{
                    title: "PEOPLE",
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="people-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                listeners={{
                    tabPress: () => {
                        router.replace("/profile");
                    },
                }}
                options={{
                    title: "PROFILE",
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="person-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="forum"
                listeners={{
                    tabPress: () => {
                        router.replace("/forum");
                    },
                }}
                options={{
                    title: "FORUM",
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="chatbubbles-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="deck-draft/[id]"
                options={{
                    href: null,
                    title: "DECK",
                    header: () => (
                        <AppHeader
                            title="Deck"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="card/[name]"
                options={{
                    href: null,
                    title: "CARD",
                    header: () => (
                        <AppHeader
                            title="Card"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="message/[userId]"
                options={{
                    href: null,
                    title: "MESSAGE",
                    header: () => (
                        <AppHeader
                            title="Message"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="player/[id]"
                options={{
                    href: null,
                    title: "PLAYER",
                    header: () => (
                        <AppHeader
                            title="Player"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="admin"
                listeners={{
                    tabPress: () => {
                        router.replace("/admin");
                    },
                }}
                options={{
                    title: "ADMIN",
                    href:
                        user?.id === "1"
                            ? undefined
                            : null,
                    tabBarIcon: ({
                        color,
                        size,
                    }) => (
                        <Ionicons
                            name="shield-checkmark-outline"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="trade/[userId]"
                options={{
                    href: null,
                    title: "TRADE",
                    header: () => (
                        <AppHeader
                            title="Trade"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="trade-binder/[userId]"
                options={{
                    href: null,
                    title: "TRADE BINDER",
                    header: () => (
                        <AppHeader
                            title="Trade Binder"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="wishlist/[userId]"
                options={{
                    href: null,
                    title: "WISHLIST",
                    header: () => (
                        <AppHeader
                            title="Wishlist"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="inbox"
                options={{
                    href: null,
                    title: "INBOX",
                    header: () => (
                        <AppHeader
                            title="Inbox"
                            showBack
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    href: null,
                    title: "SETTINGS",
                    header: () => (
                        <AppHeader
                            title="Settings"
                            showBack
                        />
                    ),
                }}
            />
        </Tabs>
    );
}