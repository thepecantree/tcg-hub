import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import {
    mockPlayers,
} from "@/data/mockPlayers";

import type {
    UserCardEntry,
} from "@/types/cards";

import {
    cardNameMatchesEntry,
} from "@/utils/cardMatching";

type CardPrinting = {
    scryfallId: string;
    oracleId: string | null;
    name: string;
    setName: string;
    setCode: string;
    collectorNumber: string | null;
    lang: string | null;
    releasedAt: string | null;
    typeLine: string | null;
    rarity: string | null;
    imageSmall: string | null;
    imageNormal: string | null;
};

type ListingTab =
    | "editions"
    | "have"
    | "want";

import {
    API_BASE_URL,
} from "@/api/config";

function exactPrintingMatches(
    entry: UserCardEntry,
    selectedIds: string[]
) {
    if (
        selectedIds.length === 0
    ) {
        return true;
    }

    if (
        entry.scryfallId
    ) {
        return selectedIds.includes(
            entry.scryfallId
        );
    }

    return false;
}

export default function CardPage() {
    const { theme } =
        useTheme();

    const {
        name,
        startTab,
    } = useLocalSearchParams<{
        name: string;
        startTab?: ListingTab;
    }>();

    const decodedName =
        decodeURIComponent(
            name ?? ""
        );

    const [
        printings,
        setPrintings,
    ] = useState<CardPrinting[]>(
        []
    );

    const [
        activeTab,
        setActiveTab,
    ] = useState<ListingTab>(
        startTab === "want"
            ? "want"
            : "editions"
    );

    const [
        selectedPrintingIds,
        setSelectedPrintingIds,
    ] = useState<string[]>(
        []
    );

    const anySelected =
        selectedPrintingIds.length ===
        0;

    useEffect(() => {
        async function loadPrintings() {
            if (!decodedName) {
                return;
            }

            const response =
                await fetch(
                    `${API_BASE_URL}/cards/editions?name=${encodeURIComponent(
                        decodedName
                    )}`
                );

            const data =
                await response.json();

            setPrintings(
                Array.isArray(data)
                    ? data
                    : []
            );
        }

        loadPrintings();
    }, [
        decodedName,
    ]);

    function togglePrinting(
        scryfallId: string
    ) {
        setSelectedPrintingIds(
            (current) =>
                current.includes(
                    scryfallId
                )
                    ? current.filter(
                        (id) =>
                            id !== scryfallId
                    )
                    : [
                        ...current,
                        scryfallId,
                    ]
        );
    }

    function entryIsRelevantByName(
        entry: UserCardEntry
    ) {
        return cardNameMatchesEntry(
            decodedName,
            entry
        );
    }

    function entryMatchesSelectedPrinting(
        entry: UserCardEntry
    ) {
        return (
            entryIsRelevantByName(
                entry
            ) &&
            exactPrintingMatches(
                entry,
                selectedPrintingIds
            )
        );
    }

    function wishlistEntryMatches(
        entry: UserCardEntry
    ) {
        if (
            !entryIsRelevantByName(
                entry
            )
        ) {
            return false;
        }

        if (
            !entry.printSpecific
        ) {
            return true;
        }

        return exactPrintingMatches(
            entry,
            selectedPrintingIds
        );
    }

    function matchingVariants(
        entries: UserCardEntry[],
        mode:
            | "have"
            | "want"
    ) {
        return entries.filter(
            (entry) =>
                mode === "have"
                    ? entryMatchesSelectedPrinting(
                        entry
                    )
                    : wishlistEntryMatches(
                        entry
                    )
        );
    }

    function totalQuantity(
        cards: UserCardEntry[]
    ) {
        return cards.reduce(
            (total, card) =>
                total +
                (
                    card.quantity ??
                    1
                ),
            0
        );
    }

    const playersWithCard =
        useMemo(
            () =>
                mockPlayers
                    .map(
                        (player) => {
                            const matches =
                                matchingVariants(
                                    player.collection,
                                    "have"
                                );

                            const quantity =
                                totalQuantity(
                                    matches
                                );

                            if (
                                quantity <=
                                0
                            ) {
                                return null;
                            }

                            return {
                                ...player,
                                quantity,
                                variants:
                                    matches,
                            };
                        }
                    )
                    .filter(Boolean) as any[],
            [
                decodedName,
                selectedPrintingIds,
            ]
        );

    const playersWantingCard =
        useMemo(
            () =>
                mockPlayers
                    .map(
                        (player) => {
                            const matches =
                                matchingVariants(
                                    player.wishlist,
                                    "want"
                                );

                            const quantity =
                                totalQuantity(
                                    matches
                                );

                            if (
                                quantity <=
                                0
                            ) {
                                return null;
                            }

                            return {
                                ...player,
                                quantity,
                                variants:
                                    matches,
                            };
                        }
                    )
                    .filter(Boolean) as any[],
            [
                decodedName,
                selectedPrintingIds,
            ]
        );

    function renderVariantPreview(
        variants: UserCardEntry[]
    ) {
        return (
            <View
                style={{
                    flexDirection: "row",
                    gap: 4,
                    marginRight: 8,
                }}
            >
                {variants
                    .slice(0, 3)
                    .map(
                        (
                            card,
                            index
                        ) => (
                            <View
                                key={`${card.cardName}-${card.scryfallId ?? index}`}
                                style={{
                                    width: 34,
                                    height: 48,
                                    borderRadius: 4,
                                    overflow: "hidden",
                                    backgroundColor:
                                        theme.colors.surfaceAlt,
                                    borderWidth: card.foil
                                        ? 2
                                        : 1,
                                    borderColor: card.foil
                                        ? "#FACC15"
                                        : theme.colors.border,
                                }}
                            >
                                {card.imageSmall && (
                                    <Image
                                        source={{
                                            uri: card.imageSmall,
                                        }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                )}
                            </View>
                        )
                    )}

                {variants.length > 3 && (
                    <View
                        style={{
                            width: 34,
                            height: 48,
                            borderRadius: 4,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight:
                                    "900",
                                fontSize: 11,
                            }}
                        >
                            +{variants.length - 3}
                        </Text>
                    </View>
                )}
            </View>
        );
    }

    function renderPlayerRow(
        player: any
    ) {
        return (
            <View
                key={
                    player.id
                }
                style={{
                    backgroundColor:
                        theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                        theme.colors.border,
                    borderRadius: 14,
                    padding: 12,
                    marginBottom: 12,
                    gap: 10,
                }}
            >
                <Pressable
                    onPress={() =>
                        router.push({
                            pathname:
                                "/(tabs)/player/[id]",
                            params: {
                                id:
                                    player.id,
                            },
                        })
                    }
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                    }}
                >
                    <Image
                        source={{
                            uri:
                                player.avatar,
                        }}
                        style={{
                            width: 54,
                            height: 54,
                            borderRadius: 27,
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
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight:
                                    "900",
                                fontSize: 16,
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
                            @{player.username} � {player.distance}
                        </Text>
                    </View>

                    {anySelected &&
                        renderVariantPreview(
                            player.variants
                        )}

                    <View
                        style={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor:
                                theme.colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 8,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "900",
                            }}
                        >
                            {
                                player.quantity
                            }
                        </Text>
                    </View>
                </Pressable>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 8,
                    }}
                >
                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname:
                                    "/(tabs)/message/[userId]",
                                params: {
                                    userId:
                                        player.id,
                                },
                            })
                        }
                        style={{
                            flex: 1,
                            paddingVertical: 9,
                            borderRadius: 999,
                            backgroundColor:
                                "#1D4ED8",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "800",
                            }}
                        >
                            Message
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            router.push({
                                pathname:
                                    "/(tabs)/trade/[userId]",
                                params: {
                                    userId:
                                        player.id,
                                },
                            })
                        }
                        style={{
                            flex: 1,
                            paddingVertical: 9,
                            borderRadius: 999,
                            backgroundColor:
                                "#047857",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "800",
                            }}
                        >
                            Trade
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.background,
            }}
            contentContainerStyle={{
                padding: 20,
                paddingBottom: 120,
            }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "900",
                    color: theme.colors.text,
                }}
            >
                {decodedName}
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                    marginBottom: 16,
                }}
            >
                {anySelected
                    ? "Any printing"
                    : `${selectedPrintingIds.length} selected printing${selectedPrintingIds.length === 1 ? "" : "s"}`}{" "}
                � {playersWithCard.length} have � {playersWantingCard.length} want
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 18,
                }}
            >
                {[
                    ["editions", "Editions"],
                    ["have", "Have"],
                    ["want", "Want"],
                ].map(([key, label]) => {
                    const active =
                        activeTab === key;

                    return (
                        <Pressable
                            key={key}
                            onPress={() =>
                                setActiveTab(
                                    key as ListingTab
                                )
                            }
                            style={{
                                flex: 1,
                                padding: 11,
                                borderRadius: 999,
                                alignItems: "center",
                                backgroundColor:
                                    active
                                        ? theme.colors.primary
                                        : theme.colors.surfaceAlt,
                            }}
                        >
                            <Text
                                style={{
                                    color: active
                                        ? "white"
                                        : theme.colors.text,
                                    fontWeight: "800",
                                }}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {activeTab === "editions" && (
                <>
                    <Pressable
                        onPress={() =>
                            setSelectedPrintingIds(
                                []
                            )
                        }
                        style={{
                            padding: 12,
                            borderRadius: 14,
                            marginBottom: 12,
                            backgroundColor:
                                anySelected
                                    ? theme.colors.primary
                                    : theme.colors.surface,
                            borderWidth: 1,
                            borderColor:
                                anySelected
                                    ? theme.colors.primary
                                    : theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                color: anySelected
                                    ? "white"
                                    : theme.colors.text,
                                fontWeight: "900",
                            }}
                        >
                            Any printing
                        </Text>

                        <Text
                            style={{
                                color: anySelected
                                    ? "white"
                                    : theme.colors.textMuted,
                                marginTop: 3,
                            }}
                        >
                            Show all possessors and wanters for this card name.
                        </Text>
                    </Pressable>

                    {printings.map((card) => {
                        const selected =
                            selectedPrintingIds.includes(
                                card.scryfallId
                            );

                        return (
                            <Pressable
                                key={card.scryfallId}
                                onPress={() =>
                                    togglePrinting(
                                        card.scryfallId
                                    )
                                }
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    backgroundColor:
                                        selected
                                            ? theme.colors.surfaceAlt
                                            : theme.colors.surface,
                                    borderWidth: selected
                                        ? 2
                                        : 1,
                                    borderColor:
                                        selected
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                    borderRadius: 14,
                                    padding: 12,
                                    marginBottom: 12,
                                }}
                            >
                                {card.imageSmall ? (
                                    <Image
                                        source={{
                                            uri:
                                                card.imageSmall,
                                        }}
                                        style={{
                                            width: 64,
                                            height: 89,
                                            borderRadius: 6,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                        }}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            width: 64,
                                            height: 89,
                                            borderRadius: 6,
                                            backgroundColor:
                                                theme.colors.surfaceAlt,
                                        }}
                                    />
                                )}

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
                                                "800",
                                        }}
                                    >
                                        {card.setName} ({card.setCode?.toUpperCase()})
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.textMuted,
                                        }}
                                    >
                                        #{card.collectorNumber} � {card.rarity}
                                    </Text>

                                    {!!card.releasedAt && (
                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.textMuted,
                                            }}
                                        >
                                            Released {card.releasedAt}
                                        </Text>
                                    )}

                                    {!!card.typeLine && (
                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.text,
                                                marginTop: 6,
                                            }}
                                        >
                                            {card.typeLine}
                                        </Text>
                                    )}
                                </View>

                                <Text
                                    style={{
                                        color: selected
                                            ? theme.colors.primary
                                            : theme.colors.textMuted,
                                        fontWeight: "900",
                                    }}
                                >
                                    {selected
                                        ? "Selected"
                                        : "Select"}
                                </Text>
                            </Pressable>
                        );
                    })}
                </>
            )}

            {activeTab === "have" &&
                (playersWithCard.length ? (
                    playersWithCard.map(
                        renderPlayerRow
                    )
                ) : (
                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                        }}
                    >
                        No nearby players have this selected printing.
                    </Text>
                ))}

            {activeTab === "want" &&
                (playersWantingCard.length ? (
                    playersWantingCard.map(
                        renderPlayerRow
                    )
                ) : (
                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                        }}
                    >
                        No nearby players want this selected printing.
                    </Text>
                ))}
        </ScrollView>
    );
}