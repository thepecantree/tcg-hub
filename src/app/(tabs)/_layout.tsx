import { Tabs } from "expo-router";
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