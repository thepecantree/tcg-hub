import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import type {
    CardEntryListVariant,
    UserCardEntry,
} from "@/types/cards";

type DeckGridCardProps = {
    item: UserCardEntry;

    expanded: boolean;

    controls: React.ReactNode;

    variant?: CardEntryListVariant;

    onPress: () => void;

    onHoverIn?: () => void;

    onHoverOut?: () => void;
};

export default function DeckGridCard({
    item,
    expanded,
    controls,
    variant = "default",
    onPress,
    onHoverIn,
    onHoverOut,
}: DeckGridCardProps) {
    const { theme } =
        useTheme();

    const borderColor =
        variant === "wishlist"
            ? item.printSpecific
                ? "#FACC15"
                : "#3B82F6"
            : expanded
                ? theme.colors.primary
                : "transparent";

    const borderWidth =
        variant === "wishlist" ||
            expanded
            ? 2
            : 0;

    return (
        <View
            style={{
                width: 72,
                marginBottom: 6,
                position: "relative",
                zIndex: expanded ? 100 : 1,
            }}
        >
            {expanded && (
                <View
                    style={{
                        position: "absolute",
                        bottom: 112,
                        left: 0,
                        width: 260,
                        zIndex: 100,
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor:
                            theme.colors.surface,
                        borderWidth: 1,
                        borderColor:
                            theme.colors.border,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "700",
                        }}
                    >
                        {item.cardName}
                    </Text>

                    {controls}
                </View>
            )}

            <Pressable
                onHoverIn={onHoverIn}
                onHoverOut={onHoverOut}
                onPress={onPress}
            >
                {item.imageSmall ? (
                    <Image
                        source={{
                            uri: item.imageSmall,
                        }}
                        style={{
                            width: 72,
                            height: 100,
                            borderRadius: 6,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderWidth,
                            borderColor,
                        }}
                    />
                ) : (
                    <View
                        style={{
                            width: 72,
                            height: 100,
                            borderRadius: 6,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderWidth,
                            borderColor,
                        }}
                    />
                )}
            </Pressable>

            <Text
                numberOfLines={2}
                style={{
                    color: theme.colors.text,
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 4,
                }}
            >
                {item.quantity}x {item.cardName}
            </Text>
        </View>
    );
}