import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import {
    useMemo,
    useState,
} from "react";

import {
    router,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import {
    mockPlayers,
} from "@/data/mockPlayers";

import type {
    UserCardEntry,
} from "@/types/cards";

import {
    binderCardMatchesWishlistCard,
} from "@/utils/cardMatching";

type AvailabilityPlayer = {
    id: string;
    displayName: string;
    username: string;
    distance: string;
    avatar: string;
    quantity: number;
    variants: UserCardEntry[];
};

type AvailabilityCard = {
    card: UserCardEntry;
    totalAvailable: number;
    players: AvailabilityPlayer[];
};

type Props = {
    wishlistCards: UserCardEntry[];
    localUserId?: string;
};

function buildAvailabilityCards(
    wishlistCards: UserCardEntry[],
    localUserId?: string
): AvailabilityCard[] {
    return wishlistCards
        .map((wishlistCard) => {
            const players =
                mockPlayers
                    .filter(
                        (player) =>
                            !localUserId ||
                            player.id !== localUserId
                    )
                    .map((player) => {
                        const available =
                            player.collection?.filter(
                                (binderCard) =>
                                    binderCardMatchesWishlistCard(
                                        binderCard,
                                        wishlistCard
                                    )
                            ) ?? [];

                        const quantity =
                            available.reduce(
                                (total, card) =>
                                    total + (card.quantity ?? 1),
                                0
                            );

                        if (quantity <= 0) {
                            return null;
                        }

                        return {
                            id: player.id,
                            displayName: player.displayName,
                            username: player.username,
                            distance: player.distance,
                            avatar: player.avatar,
                            quantity,
                            variants: available,
                        };
                    })
                    .filter(Boolean) as AvailabilityPlayer[];

            const totalAvailable =
                players.reduce(
                    (total, player) =>
                        total + player.quantity,
                    0
                );

            return {
                card: wishlistCard,
                totalAvailable,
                players,
            };
        })
        .filter((item) => item.totalAvailable > 0)
        .sort(
            (a, b) =>
                b.totalAvailable - a.totalAvailable
        );
}

export default function LocalWishlistAvailability({
    wishlistCards,
    localUserId,
}: Props) {
    const { theme } =
        useTheme();
    const { width } =
        useWindowDimensions();

    const cardWidth =
        width < 700
            ? 72
            : 96;

    const cardHeight =
        Math.round(
            cardWidth * 1.397
        );

    const [
        selectedCard,
        setSelectedCard,
    ] = useState<AvailabilityCard | null>(
        null
    );

    const availabilityCards =
        useMemo(
            () =>
                buildAvailabilityCards(
                    wishlistCards,
                    localUserId
                ),
            [
                wishlistCards,
                localUserId,
            ]
        );

    if (availabilityCards.length === 0) {
        return (
            <View
                style={{
                    backgroundColor:
                        theme.colors.surface,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor:
                        theme.colors.border,
                    padding: 14,
                    marginTop: 18,
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                        fontSize: 20,
                        fontWeight: "900",
                        marginBottom: 6,
                    }}
                >
                    Local Wishlist Availability
                </Text>

                <Text
                    style={{
                        color: theme.colors.textMuted,
                    }}
                >
                    No nearby trade binder matches found for cards in your wishlist yet.
                </Text>
            </View>
        );
    }

    return (
        <View
            style={{
                backgroundColor:
                    theme.colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                padding: 14,
                marginTop: 18,
            }}
        >
            <Text
                style={{
                    color: theme.colors.text,
                    fontSize: 20,
                    fontWeight: "900",
                    marginBottom: 4,
                }}
            >
                Local Wishlist Availability
            </Text>

            <Text
                style={{
                    color: theme.colors.textMuted,
                    marginBottom: 14,
                }}
            >
                Cards in your wishlist that nearby players have in trade binders.
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: 8,
                    paddingBottom: 4,
                }}
            >
                {availabilityCards.map((item) => (
                    <View
                        key={`${item.card.cardName}-${item.card.scryfallId ?? "any"}`}
                        style={{
                            width: cardWidth,
                        }}
                    >
                        <View
                            style={{
                                position: "relative",
                            }}
                        >
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/(tabs)/card/[name]",
                                        params: {
                                            name:
                                                item.card.cardName,
                                            startTab:
                                                "have",
                                        },
                                    })
                                }
                            >
                                {item.card.imageSmall ? (
                                    <Image
                                        source={{
                                            uri:
                                                item.card.imageSmall,
                                        }}
                                        style={{
                                            width: cardWidth,
                                            height: cardHeight,
                                            borderRadius: 8,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                            borderWidth:
                                                item.card.printSpecific
                                                    ? 2
                                                    : 0,
                                            borderColor:
                                                item.card.printSpecific
                                                    ? "#FACC15"
                                                    : "transparent",
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: cardWidth,
                                            height: cardHeight,
                                            borderRadius: 8,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                            borderWidth:
                                                item.card.printSpecific
                                                    ? 2
                                                    : 0,
                                            borderColor:
                                                item.card.printSpecific
                                                    ? "#FACC15"
                                                    : "transparent",
                                        }}
                                    />
                                )}
                            </Pressable>

                            <Pressable
                                onPress={() =>
                                    setSelectedCard(item)
                                }
                                style={{
                                    position: "absolute",
                                    right: -7,
                                    bottom: -7,
                                    minWidth: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    paddingHorizontal: 8,
                                    backgroundColor:
                                        theme.colors.primary,
                                    borderWidth: 2,
                                    borderColor:
                                        theme.colors.surface,
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "900",
                                    }}
                                >
                                    {item.totalAvailable}
                                </Text>
                            </Pressable>
                        </View>

                        <Text
                            numberOfLines={2}
                            style={{
                                color: theme.colors.text,
                                fontSize: 12,
                                fontWeight: "800",
                                textAlign: "center",
                                marginTop: 8,
                            }}
                        >
                            {item.card.cardName}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <Modal
                visible={selectedCard !== null}
                transparent
                animationType="fade"
                onRequestClose={() =>
                    setSelectedCard(null)
                }
            >
                <Pressable
                    onPress={() =>
                        setSelectedCard(null)
                    }
                    style={{
                        flex: 1,
                        backgroundColor:
                            "rgba(0,0,0,.55)",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
                    }}
                >
                    <Pressable
                        onPress={(event) =>
                            event.stopPropagation()
                        }
                        style={{
                            width: "100%",
                            maxWidth: 420,
                            backgroundColor:
                                theme.colors.surface,
                            borderRadius: 16,
                            padding: 16,
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.text,
                                fontSize: 22,
                                fontWeight: "900",
                                marginBottom: 4,
                            }}
                        >
                            {
                                selectedCard?.card
                                    .cardName
                            }
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                                marginBottom: 14,
                            }}
                        >
                            {selectedCard?.totalAvailable} available nearby
                        </Text>

                        <View
                            style={{
                                gap: 10,
                            }}
                        >
                            {selectedCard?.players.map(
                                (player) => (
                                    <Pressable
                                        key={player.id}
                                        onPress={() => {
                                            setSelectedCard(
                                                null
                                            );

                                            router.push({
                                                pathname:
                                                    "/(tabs)/player/[id]",
                                                params: {
                                                    id:
                                                        player.id,
                                                },
                                            });
                                        }}
                                        style={{
                                            flexDirection:
                                                "row",
                                            alignItems:
                                                "center",
                                            gap: 12,
                                            padding: 10,
                                            borderRadius: 12,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    player.avatar,
                                            }}
                                            style={{
                                                width: 46,
                                                height: 46,
                                                borderRadius: 23,
                                                backgroundColor:
                                                    theme.colors.surface,
                                            }}
                                        />

                                        <View
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        theme.colors.text,
                                                    fontWeight:
                                                        "900",
                                                }}
                                            >
                                                {
                                                    player.displayName
                                                }
                                            </Text>

                                            <Text
                                                style={{
                                                    color:
                                                        theme.colors.textMuted,
                                                }}
                                            >
                                                @{player.username} · {player.distance}
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                minWidth: 34,
                                                height: 34,
                                                borderRadius: 17,
                                                backgroundColor:
                                                    theme.colors.primary,
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                paddingHorizontal:
                                                    8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        "white",
                                                    fontWeight:
                                                        "900",
                                                }}
                                            >
                                                {
                                                    player.quantity
                                                }
                                            </Text>
                                        </View>
                                    </Pressable>
                                )
                            )}
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}