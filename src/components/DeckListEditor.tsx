import {
    API_BASE_URL,
} from "@/api/config";

import {
    Pressable,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import {
    router,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";
import DeckPreviewCard from "@/components/decks/DeckPreviewCard";

import type {
    UserCardEntry,
} from "@/types/cards";

export type DeckFormat =
    | "EDH"
    | "Standard"
    | "Pioneer"
    | "Modern"
    | "Premodern"
    | "Legacy"
    | "Vintage"
    | "Old School"
    | "Pauper"
    | "Unsorted";

export type DeckPowerLevel =
    | 1
    | 2
    | 3
    | 4
    | 5;

export type DeckVisibility =
    | "public"
    | "unlisted"
    | "private";

export type UserDeckEntry = {
    id: string;
    userId?: string;
    name: string;
    faceCardName?: string;
    faceCardImage?: string;
    isPublic: boolean;
    visibility?: DeckVisibility;
    format?: DeckFormat;
    powerLevel?: DeckPowerLevel;
    cards: UserCardEntry[];
};

type DeckListEditorProps = {
    userId: string;
    decks: UserDeckEntry[];
    onChange: (
        decks: UserDeckEntry[]
    ) => void;
};

const PLACEHOLDER_FACE_CARD =
    "https://cards.scryfall.io/normal/front/8/5/85a874ec-07d2-4140-84a7-1f30e1608f80.jpg";

const FORMAT_ORDER: DeckFormat[] = [
    "EDH",
    "Standard",
    "Pioneer",
    "Modern",
    "Premodern",
    "Legacy",
    "Vintage",
    "Old School",
    "Pauper",
    "Unsorted",
];

function getDeckFormat(
    deck: UserDeckEntry
): DeckFormat {
    return deck.format ?? "Unsorted";
}

function getDeckPowerLevel(
    deck: UserDeckEntry
): DeckPowerLevel {
    return deck.powerLevel ?? 1;
}

function groupDecksByFormat(
    decks: UserDeckEntry[]
) {
    const groups =
        new Map<
            DeckFormat,
            UserDeckEntry[]
        >();

    for (const deck of decks) {
        const format =
            getDeckFormat(deck);

        if (!groups.has(format)) {
            groups.set(format, []);
        }

        groups.get(format)!.push(deck);
    }

    for (const [
        format,
        formatDecks,
    ] of groups) {
        groups.set(
            format,
            [...formatDecks].sort(
                (a, b) =>
                    getDeckPowerLevel(b) -
                    getDeckPowerLevel(a)
            )
        );
    }

    return FORMAT_ORDER
        .map((format) => ({
            format,
            decks:
                groups.get(format) ?? [],
        }))
        .filter(
            (group) =>
                group.decks.length > 0
        );
}

export default function DeckListEditor({
    userId,
    decks,
    onChange,
}: DeckListEditorProps) {
    const { theme } =
        useTheme();

    const { width } =
        useWindowDimensions();

    const gap =
        12;

    const columns =
        width < 700
            ? 3
            : Math.max(
                5,
                Math.floor(
                    width / 150
                )
            );

    const availableWidth =
        Math.max(
            320,
            width - 80
        );

    const cardWidth =
        Math.max(
            80,
            Math.min(
                145,
                availableWidth * 0.13
            )
        );

    const groupedDecks =
        groupDecksByFormat(decks);

    async function addDeck() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        userId
                    )}/decks`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                name:
                                    "Untitled Deck",
                                faceCardName:
                                    "Loot, the Pathfinder",
                                faceCardImage:
                                    PLACEHOLDER_FACE_CARD,
                                visibility:
                                    "private",
                                isPublic:
                                    false,
                                format:
                                    "Unsorted",
                                powerLevel:
                                    1,
                            }),
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            const createdDeck =
                data.deck;

            onChange([
                ...decks,
                {
                    ...createdDeck,
                    cards: [],
                },
            ]);

            router.push({
                pathname:
                    "/(tabs)/deck-draft/[id]",
                params: {
                    id:
                        createdDeck.id,
                    userId,
                },
            } as any);
        } catch {
            alert(
                "Could not create deck."
            );
        }
    }

    async function deleteDeck(
        id: string
    ) {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        userId
                    )}/decks/${encodeURIComponent(
                        id
                    )}`,
                    {
                        method:
                            "DELETE",
                    }
                );

            if (!response.ok) {
                throw new Error();
            }
        } catch {
            alert(
                "Could not delete deck from server."
            );

            return;
        }

        onChange(
            decks.filter(
                (deck) =>
                    deck.id !== id
            )
        );
    }

    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {groupedDecks.map(
                (group) => (
                    <View
                        key={
                            group.format
                        }
                        style={{
                            marginBottom:
                                18,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontSize:
                                    18,
                                fontWeight:
                                    "900",
                                marginBottom:
                                    10,
                            }}
                        >
                            {group.format}
                        </Text>

                        <View
                            style={{
                                flexDirection:
                                    "row",
                                flexWrap:
                                    "wrap",
                                gap,
                                marginBottom:
                                    4,
                            }}
                        >
                            {group.decks.map(
                                (deck) => (
                                    <View
                                        key={
                                            deck.id
                                        }
                                        style={{
                                            width:
                                                cardWidth,
                                        }}
                                    >
                                        <DeckPreviewCard
                                            deck={deck}
                                            ownerUserId={userId}
                                            cardWidth={cardWidth}
                                            canEdit
                                            onDelete={() =>
                                                deleteDeck(deck.id)
                                            }
                                        />
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                )
            )}

            <Pressable
                onPress={addDeck}
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
                    Add Deck
                </Text>
            </Pressable>
        </View>
    );
}