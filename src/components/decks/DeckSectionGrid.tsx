import {
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import DeckPreviewCard from "@/components/decks/DeckPreviewCard";

import type {
    DeckFormat,
    DeckPowerLevel,
    UserDeckEntry,
} from "@/components/DeckListEditor";

type Props = {
    ownerUserId: string;
    publicDecks: UserDeckEntry[];
    draftDecks?: UserDeckEntry[];
    showDrafts?: boolean;
};

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

function FormatDeckSection({
    title,
    decks,
    ownerUserId,
    cardWidth,
}: {
    title: string;
    decks: UserDeckEntry[];
    ownerUserId: string;
    cardWidth: number;
}) {
    const { theme } =
        useTheme();

    if (decks.length === 0) {
        return null;
    }

    return (
        <View
            style={{
                marginBottom: 18,
            }}
        >
            <Text
                style={{
                    color:
                        theme.colors.text,
                    fontWeight: "900",
                    fontSize: 18,
                    marginBottom: 12,
                }}
            >
                {title}
            </Text>

            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 12,
                }}
            >
                {decks.map((deck) => (
                    <DeckPreviewCard
                        key={deck.id}
                        deck={deck}
                        ownerUserId={
                            ownerUserId
                        }
                        cardWidth={
                            cardWidth
                        }
                    />
                ))}
            </View>
        </View>
    );
}

export default function DeckSectionGrid({
    ownerUserId,
    publicDecks,
    draftDecks = [],
    showDrafts = true,
}: Props) {
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

    const visibleDecks =
        showDrafts
            ? [
                ...publicDecks,
                ...draftDecks,
            ]
            : publicDecks;

    const groupedDecks =
        groupDecksByFormat(
            visibleDecks
        );

    return (
        <View
            style={{
                width: "100%",
            }}
        >
            {groupedDecks.map((group) => (
                <FormatDeckSection
                    key={group.format}
                    title={group.format}
                    decks={group.decks}
                    ownerUserId={
                        ownerUserId
                    }
                    cardWidth={
                        cardWidth
                    }
                />
            ))}
        </View>
    );
}