import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/theme/ThemeContext";

type Props = {
    query: string;

    onChangeQuery: (
        value: string
    ) => void;

    onSubmit: () => void;

    onOpenSettings: () => void;
};

export default function CardSearchBar({
    query,
    onChangeQuery,
    onSubmit,
    onOpenSettings,
}: Props) {
    const { theme } =
        useTheme();

    const hasQuery =
        !!query.trim();

    return (
        <View
            style={{
                flexDirection: "row",
                gap: 8,
                marginBottom: 16,
                alignItems: "stretch",
            }}
        >
            <Pressable
                onPress={onOpenSettings}
                style={{
                    width: 48,
                    borderRadius: 14,
                    backgroundColor:
                        theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                        theme.colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Ionicons
                    name="options-outline"
                    size={22}
                    color={theme.colors.text}
                />
            </Pressable>

            <View
                style={{
                    position: "relative",
                    flex: 1,
                }}
            >
                <TextInput
                    value={query}
                    onChangeText={onChangeQuery}
                    onSubmitEditing={onSubmit}
                    placeholder="Search cards or sets..."
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    autoCapitalize="none"
                    style={{
                        backgroundColor:
                            theme.colors.surface,
                        color: theme.colors.text,
                        borderWidth: 1,
                        borderColor:
                            theme.colors.border,
                        borderRadius: 14,
                        padding: 14,
                        paddingRight:
                            hasQuery
                                ? 88
                                : 14,
                    }}
                />

                {hasQuery && (
                    <Pressable
                        onPress={onSubmit}
                        style={{
                            position: "absolute",
                            right: 5,
                            top: 5,
                            bottom: 5,
                            width: 78,
                            borderRadius: 10,
                            backgroundColor:
                                theme.colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            Search
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}