import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import type {
    GroupedCard,
} from "@/types/cards";

type Props = {
    card: GroupedCard;

    width:
    | number
    | "100%";

    isSubmittedView: boolean;

    isHovered: boolean;

    onHoverIn: () => void;

    onHoverOut: () => void;
};

export default function CardSearchResultItem({
    card,
    width,
    isSubmittedView,
    isHovered,
    onHoverIn,
    onHoverOut,
}: Props) {
    const { theme } =
        useTheme();

    return (
        <Pressable
            onHoverIn={onHoverIn}
            onHoverOut={onHoverOut}
            onPress={() =>
                router.push({
                    pathname:
                        "/(tabs)/card/[name]",
                    params: {
                        name: card.name,
                    },
                })
            }
            style={{
                width,
                marginBottom: 14,
                backgroundColor:
                    theme.colors.surface,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                borderRadius: 14,
                overflow: "hidden",
            }}
        >
            {isSubmittedView ? (
                <>
                    {card.imageNormal ||
                        card.imageSmall ? (
                        <Image
                            source={{
                                uri:
                                    card.imageNormal ??
                                    card.imageSmall!,
                            }}
                            style={{
                                width: "100%",
                                aspectRatio: 0.716,
                                backgroundColor:
                                    theme.colors.surfaceAlt,
                            }}
                        />
                    ) : (
                        <View
                            style={{
                                width: "100%",
                                aspectRatio: 0.716,
                                backgroundColor:
                                    theme.colors.surfaceAlt,
                            }}
                        />
                    )}

                    <View
                        style={{
                            padding: 8,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight: "700",
                                fontSize: 13,
                            }}
                        >
                            {card.name}
                        </Text>

                        {isHovered && (
                            <Text
                                style={{
                                    color:
                                        theme.colors.primary,
                                    marginTop: 4,
                                }}
                            >
                                See more
                            </Text>
                        )}
                    </View>
                </>
            ) : (
                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                        padding: 12,
                    }}
                >
                    <Image
                        source={{
                            uri: card.imageSmall ?? "",
                        }}
                        style={{
                            width: 46,
                            height: 64,
                            borderRadius: 6,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight: "700",
                                fontSize: 16,
                            }}
                        >
                            {card.name}
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                            }}
                        >
                            {card.printingCount} printing
                            {card.printingCount === 1
                                ? ""
                                : "s"}
                        </Text>

                        {isHovered && (
                            <Text
                                style={{
                                    color:
                                        theme.colors.primary,
                                    marginTop: 6,
                                }}
                            >
                                See more
                            </Text>
                        )}
                    </View>
                </View>
            )}
        </Pressable>
    );
}