import { Pressable, Text, View } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type DeckActionsBarProps = {
    hasUnsavedChanges: boolean;
    onSave: () => void;
    onDiscard: () => void;
    onDelete: () => void;
};

export default function DeckActionsBar({
    hasUnsavedChanges,
    onSave,
    onDiscard,
    onDelete,
}: DeckActionsBarProps) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
            }}
        >
            {hasUnsavedChanges && (
                <>
                    <Pressable
                        onPress={onDiscard}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 12,
                            borderRadius: 999,
                            backgroundColor: theme.colors.surface,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontWeight: "700",
                            }}
                        >
                            Discard
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onSave}
                        style={{
                            paddingVertical: 8,
                            paddingHorizontal: 14,
                            borderRadius: 999,
                            backgroundColor: theme.colors.primary,
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "700" }}>
                            Save
                        </Text>
                    </Pressable>
                </>
            )}

            <Pressable
                onPress={onDelete}
                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: "#EF4444",
                }}
            >
                <Text style={{ color: "white", fontWeight: "700" }}>
                    Delete
                </Text>
            </Pressable>
        </View>
    );
}