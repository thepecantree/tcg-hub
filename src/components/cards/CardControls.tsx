import { Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";
import { UserCardEntry } from "@/types/cards";

type CardControlsProps = {
    item: UserCardEntry;
    onOpenPrintingPicker: () => void;
    onUpdate: (update: Partial<UserCardEntry>) => void;
    onRemove: () => void;
    onMakeFaceCard?: () => void;
};

export default function CardControls({
    item,
    onOpenPrintingPicker,
    onUpdate,
    onRemove,
    onMakeFaceCard,
}: CardControlsProps) {
    const { theme } = useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 8,
            }}
        >
            <Pressable onPress={onOpenPrintingPicker}>
                <Text
                    style={{
                        color: theme.colors.primary,
                        fontWeight: "700",
                    }}
                >
                    Print
                </Text>
            </Pressable>

            <Pressable
                onPress={() =>
                    onUpdate({
                        foil: !item.foil,
                    })
                }
            >
                <Text
                    style={{
                        color: theme.colors.text,
                    }}
                >
                    Foil: {item.foil ? "On" : "Off"}
                </Text>
            </Pressable>

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                    }}
                >
                    Qty
                </Text>

                <TextInput
                    value={String(item.quantity)}
                    keyboardType="numeric"
                    onChangeText={(value) => {
                        const next =
                            Math.max(
                                1,
                                Number(
                                    value.replace(/\D/g, "")
                                ) || 1
                            );

                        onUpdate({
                            quantity: next,
                        });
                    }}
                    style={{
                        width: 56,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                />
            </View>

            {!!onMakeFaceCard && (
                <Pressable onPress={onMakeFaceCard}>
                    <Text
                        style={{
                            color: theme.colors.primary,
                            fontWeight: "700",
                        }}
                    >
                        Make Face
                    </Text>
                </Pressable>
            )}

            <Pressable onPress={onRemove}>
                <Text
                    style={{
                        color: "#EF4444",
                        fontWeight: "700",
                    }}
                >
                    Remove
                </Text>
            </Pressable>
        </View>
    );
}