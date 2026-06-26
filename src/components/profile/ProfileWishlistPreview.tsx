import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import type {
    UserCardEntry,
} from "@/types/cards";

type Props = {
    userId: string;

    cards: UserCardEntry[];

    editable?: boolean;
};

const PREVIEW_LIMIT =
    12;

export default function ProfileWishlistPreview({
    userId,
    cards,
    editable = false,
}: Props) {
    const { theme } =
        useTheme();

    const previewCards =
        cards.slice(
            0,
            PREVIEW_LIMIT
        );

    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {previewCards.length === 0 ? (
                <View
                    style={{
                        marginBottom:
                            10,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                        }}
                    >
                        No cards in wishlist yet.
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        flexDirection:
                            "row",

                        flexWrap:
                            "wrap",

                        gap: 8,

                        marginBottom:
                            12,
                    }}
                >
                    {previewCards.map(
                        (
                            card,
                            index
                        ) => {
                            const borderColor =
                                card.printSpecific
                                    ? "#FACC15"
                                    : "#3B82F6";

                            return (
                                <View
                                    key={`${card.cardName}-${index}`}
                                    style={{
                                        width: 72,
                                    }}
                                >
                                    {card.imageSmall ? (
                                        <Image
                                            source={{
                                                uri:
                                                    card.imageSmall,
                                            }}
                                            style={{
                                                width: 72,

                                                height: 100,

                                                borderRadius: 6,

                                                backgroundColor:
                                                    theme.colors.surfaceAlt,

                                                borderWidth: 2,

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

                                                borderWidth: 2,

                                                borderColor,
                                            }}
                                        />
                                    )}
                                </View>
                            );
                        }
                    )}
                </View>
            )}

            <Pressable
                onPress={() =>
                    router.push({
                        pathname:
                            "/(tabs)/wishlist/[userId]",

                        params: {
                            userId,
                        },
                    })
                }
                style={{
                    alignSelf:
                        "flex-end",

                    paddingVertical:
                        9,

                    paddingHorizontal:
                        14,

                    borderRadius:
                        999,

                    backgroundColor:
                        theme.colors.primary,
                }}
            >
                <Text
                    style={{
                        color:
                            "white",

                        fontWeight:
                            "800",
                    }}
                >
                    {editable
                        ? "Edit Wishlist"
                        : "View Wishlist"}
                </Text>
            </Pressable>

            {previewCards.length > 0 && (
                <Text
                    style={{
                        color:
                            theme.colors.textMuted,

                        fontSize:
                            12,

                        marginTop:
                            10,
                    }}
                >
                    Blue = any printing. Yellow = print specific.
                </Text>
            )}
        </View>
    );
}