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
    useEffect,
    useState,
} from "react";

import {
    router,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import {
    API_BASE_URL,
} from "@/api/config";

import type {
    UserCardEntry,
} from "@/types/cards";

type AvailabilityPlayer = {
    id: string;
    displayName: string;
    username: string;
    location?: string | null;
    avatar?: string | null;
    quantity: number;
    variants: UserCardEntry[];
};

type AvailabilityCard = {
    card: UserCardEntry;
    totalAvailable: number;
    players: AvailabilityPlayer[];
};

type AvailabilityRow = {
    userId: string;
    username: string;
    displayName: string;
    avatar?: string | null;
    location?: string | null;

    cardName: string;
    scryfallId?: string | null;
    setName?: string | null;
    setCode?: string | null;
    collectorNumber?: string | null;
    imageSmall?: string | null;
    typeLine?: string | null;
    rarity?: string | null;
    manaValue?: number | null;
    colors?: string | null;
    foil?: number | boolean;
    quantity: number;
    printSpecific?: number | boolean;
};

type Props = {
    wishlistCards: UserCardEntry[];
    localUserId?: string;
};

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
        availabilityCards,
        setAvailabilityCards,
    ] = useState<AvailabilityCard[]>([]);

    const [
        selectedCard,
        setSelectedCard,
    ] = useState<AvailabilityCard | null>(
        null
    );

    useEffect(() => {
        let cancelled = false;

        async function loadAvailability() {
            const cardsWithNames =
                wishlistCards.filter(
                    (card) =>
                        !!card.cardName
                );

            if (cardsWithNames.length === 0) {
                setAvailabilityCards([]);
                return;
            }

            try {
                const results =
                    await Promise.all(
                        cardsWithNames.map(
                            async (card) => {
                                const response =
                                    await fetch(
                                        `${API_BASE_URL}/cards/availability?cardName=${encodeURIComponent(
                                            card.cardName
                                        )}&excludeUserId=${encodeURIComponent(
                                            localUserId ?? ""
                                        )}`
                                    );

                                if (!response.ok) {
                                    return null;
                                }

                                const rows =
                                    await response.json();

                                const players =
                                    Array.isArray(rows)
                                        ? buildPlayers(rows)
                                        : [];

                                const totalAvailable =
                                    players.reduce(
                                        (total, player) =>
                                            total +
                                            player.quantity,
                                        0
                                    );

                                if (totalAvailable <= 0) {
                                    return null;
                                }

                                return {
                                    card,
                                    totalAvailable,
                                    players,
                                };
                            }
                        )
                    );

                if (cancelled) {
                    return;
                }

                setAvailabilityCards(
                    results
                        .filter(Boolean)
                        .sort(
                            (a, b) =>
                                (b?.totalAvailable ?? 0) -
                                (a?.totalAvailable ?? 0)
                        ) as AvailabilityCard[]
                );
            } catch {
                if (!cancelled) {
                    setAvailabilityCards([]);
                }
            }
        }

        loadAvailability();

        return () => {
            cancelled = true;
        };
    }, [
        wishlistCards,
        localUserId,
    ]);

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
                        color:
                            theme.colors.text,
                        fontSize: 20,
                        fontWeight: "900",
                        marginBottom: 6,
                    }}
                >
                    Local Wishlist Availability
                </Text>

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
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
                    color:
                        theme.colors.text,
                    fontSize: 20,
                    fontWeight: "900",
                    marginBottom: 4,
                }}
            >
                Local Wishlist Availability
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
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
                            width:
                                cardWidth,
                        }}
                    >
                        <View
                            style={{
                                position:
                                    "relative",
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
                                            width:
                                                cardWidth,
                                            height:
                                                cardHeight,
                                            borderRadius:
                                                8,
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
                                            width:
                                                cardWidth,
                                            height:
                                                cardHeight,
                                            borderRadius:
                                                8,
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
                                    setSelectedCard(
                                        item
                                    )
                                }
                                style={{
                                    position:
                                        "absolute",
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
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
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
                                    {item.totalAvailable}
                                </Text>
                            </Pressable>
                        </View>

                        <Text
                            numberOfLines={2}
                            style={{
                                color:
                                    theme.colors.text,
                                fontSize: 12,
                                fontWeight: "800",
                                textAlign:
                                    "center",
                                marginTop: 8,
                            }}
                        >
                            {item.card.cardName}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <AvailabilityModal
                selectedCard={
                    selectedCard
                }
                onClose={() =>
                    setSelectedCard(null)
                }
            />
        </View>
    );
}

function buildPlayers(
    rows: AvailabilityRow[]
): AvailabilityPlayer[] {
    const byUser =
        new Map<string, AvailabilityPlayer>();

    for (const row of rows) {
        const variant: UserCardEntry = {
            cardName: row.cardName,

            scryfallId: row.scryfallId ?? null,
            setName: row.setName ?? null,
            setCode: row.setCode ?? null,
            collectorNumber: row.collectorNumber ?? null,
            imageSmall: row.imageSmall ?? null,

            typeLine: row.typeLine ?? null,
            rarity: row.rarity ?? null,
            manaValue: row.manaValue ?? null,
            colors: row.colors ?? null,

            foil: Boolean(row.foil),
            quantity: Number(row.quantity ?? 1),
            printSpecific: Boolean(row.printSpecific),
        };

        const existing =
            byUser.get(row.userId);

        if (existing) {
            existing.quantity +=
                Number(row.quantity ?? 1);

            existing.variants.push(
                variant
            );

            continue;
        }

        byUser.set(
            row.userId,
            {
                id:
                    row.userId,

                displayName:
                    row.displayName,

                username:
                    row.username,

                location:
                    row.location,

                avatar:
                    row.avatar,

                quantity:
                    Number(row.quantity ?? 1),

                variants: [
                    variant,
                ],
            }
        );
    }

    return Array.from(
        byUser.values()
    );
}

function AvailabilityModal({
    selectedCard,
    onClose,
}: {
    selectedCard: AvailabilityCard | null;
    onClose: () => void;
}) {
    const { theme } =
        useTheme();

    return (
        <Modal
            visible={
                selectedCard !== null
            }
            transparent
            animationType="fade"
            onRequestClose={
                onClose
            }
        >
            <Pressable
                onPress={
                    onClose
                }
                style={{
                    flex: 1,
                    backgroundColor:
                        "rgba(0,0,0,.55)",
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
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
                            color:
                                theme.colors.text,
                            fontSize: 22,
                            fontWeight: "900",
                            marginBottom: 4,
                        }}
                    >
                        {selectedCard?.card.cardName}
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
                        {selectedCard?.players.map((player) => (
                            <Pressable
                                key={
                                    player.id
                                }
                                onPress={() => {
                                    onClose();

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
                                            player.avatar ||
                                            "https://placehold.co/300x300/png",
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
                                        {player.displayName}
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.textMuted,
                                        }}
                                    >
                                        @{player.username}
                                        {player.location
                                            ? ` · ${player.location}`
                                            : ""}
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
                                        paddingHorizontal: 8,
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
                                        {player.quantity}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}