import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type Props = {
    value: string;
    replyingToLabel?: string;
    onChangeText: (value: string) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function ForumReplyBox({
    value,
    replyingToLabel,
    onChangeText,
    onSubmit,
    onCancel,
}: Props) {
    const { theme } =
        useTheme();

    return (
        <View
            style={{
                backgroundColor:
                    theme.colors.surface,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                borderRadius: 14,
                padding: 10,
                gap: 8,
            }}
        >
            {!!replyingToLabel && (
                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        fontWeight: "700",
                    }}
                >
                    Replying to {replyingToLabel}
                </Text>
            )}

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder="Write a reply..."
                placeholderTextColor={
                    theme.colors.textMuted
                }
                multiline
                style={{
                    minHeight: 70,
                    maxHeight: 160,
                    color:
                        theme.colors.text,
                    backgroundColor:
                        theme.colors.surfaceAlt,
                    borderRadius: 12,
                    padding: 10,
                    textAlignVertical:
                        "top",
                }}
            />

            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                }}
            >
                <Pressable
                    onPress={onCancel}
                    style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 999,
                        alignItems: "center",
                        backgroundColor:
                            theme.colors.surfaceAlt,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.text,
                            fontWeight: "900",
                        }}
                    >
                        Cancel
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onSubmit}
                    style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 999,
                        alignItems: "center",
                        backgroundColor:
                            theme.colors.primary,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "900",
                        }}
                    >
                        Post Reply
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}