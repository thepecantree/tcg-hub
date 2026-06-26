import { useState } from "react";

import {
    Pressable,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type Props = {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
};

export default function CollapsiblePanel({
    title,
    children,
    defaultOpen = false,
}: Props) {
    const { theme } = useTheme();

    const [open, setOpen] =
        useState(defaultOpen);

    return (
        <View
            style={{
                width: "100%",
                marginBottom: 8,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 14,
                overflow: "hidden",
            }}
        >
            <Pressable
                onPress={() => setOpen(!open)}
                style={{
                    height: 42,
                    paddingHorizontal: 14,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                        fontSize: 14,
                        fontWeight: "800",
                    }}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        color: theme.colors.textMuted,
                        fontSize: 14,
                        fontWeight: "800",
                    }}
                >
                    {open ? "▲" : "▼"}
                </Text>
            </Pressable>

            {open && (
                <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.border,
                        padding: 12,
                    }}
                >
                    {children}
                </View>
            )}
        </View>
    );
}