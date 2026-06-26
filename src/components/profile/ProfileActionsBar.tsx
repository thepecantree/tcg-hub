import { Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

type ProfileActionsBarProps = {
    visible: boolean;

    onSave: () => void;

    onDiscard: () => void;
};

export default function ProfileActionsBar({
    visible,
    onSave,
    onDiscard,
}: ProfileActionsBarProps) {

    const { theme } =
        useTheme();

    if (
        !visible
    ) {
        return null;
    }

    return (
        <View
            style={{
                position: "absolute",

                right: 20,

                bottom: 20,

                flexDirection:
                    "row",

                gap: 10,
            }}
        >
            <Pressable
                onPress={
                    onDiscard
                }
                style={{
                    paddingVertical: 12,

                    paddingHorizontal: 16,

                    borderRadius: 999,

                    backgroundColor:
                        theme.colors.surface,

                    borderWidth: 1,

                    borderColor:
                        theme.colors.border,
                }}
            >
                <Text
                    style={{
                        color:
                            theme.colors.text,

                        fontWeight:
                            "bold",
                    }}
                >
                    Discard
                </Text>
            </Pressable>

            <Pressable
                onPress={
                    onSave
                }
                style={{
                    paddingVertical: 12,

                    paddingHorizontal: 18,

                    borderRadius: 999,

                    backgroundColor:
                        theme.colors.primary,
                }}
            >
                <Text
                    style={{
                        color:
                            "white",

                        fontWeight:
                            "bold",
                    }}
                >
                    Save
                </Text>
            </Pressable>
        </View>
    );
}