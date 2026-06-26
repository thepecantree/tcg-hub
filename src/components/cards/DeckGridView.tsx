import {
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import type {
    CardEntryListVariant,
    UserCardEntry,
} from "@/types/cards";

import {
    groupCardsByType,
} from "@/utils/cardSorting";

import DeckGridCard from "./DeckGridCard";

type DeckGridViewProps = {
    items: UserCardEntry[];

    expandedCardIndex: number | null;

    variant?: CardEntryListVariant;

    onExpandCard: (
        index: number
    ) => void;

    renderControls: (
        item: UserCardEntry,
        index: number
    ) => React.ReactNode;

    onPreviewCard?: (
        card:
            | UserCardEntry
            | null
    ) => void;
};

const CARD_WIDTH =
    120;

const CARD_GAP =
    8;

const SECTION_PADDING =
    18;

function estimateSectionWidth(
    cardCount: number
) {
    return (
        cardCount *
        CARD_WIDTH +
        Math.max(
            0,
            cardCount - 1
        ) *
        CARD_GAP +
        SECTION_PADDING
    );
}

export default function DeckGridView({
    items,
    expandedCardIndex,
    variant = "default",
    onExpandCard,
    renderControls,
    onPreviewCard,
}: DeckGridViewProps) {
    const { theme } =
        useTheme();

    const { width } =
        useWindowDimensions();

    const grouped =
        groupCardsByType(
            items
        );

    const sections =
        Object.entries(
            grouped
        );

    const rows: typeof sections[] =
        [];

    let currentRow:
        typeof sections =
        [];

    let currentWidth =
        0;

    const maxRowWidth =
        width - 80;

    for (const section of sections) {
        const [
            _category,
            cards,
        ] = section;

        const sectionWidth =
            estimateSectionWidth(
                cards.length
            );

        if (
            currentRow.length >
            0 &&
            currentWidth +
            sectionWidth >
            maxRowWidth
        ) {
            rows.push(
                currentRow
            );

            currentRow = [];

            currentWidth = 0;
        }

        currentRow.push(
            section
        );

        currentWidth +=
            sectionWidth + 22;
    }

    if (
        currentRow.length > 0
    ) {
        rows.push(
            currentRow
        );
    }

    return (
        <View
            style={{
                gap: 18,
            }}
        >
            {rows.map(
                (
                    row,
                    rowIndex
                ) => (
                    <View
                        key={`row-${rowIndex}`}
                        style={{
                            flexDirection:
                                "row",

                            flexWrap:
                                "nowrap",

                            gap: 24,

                            alignItems:
                                "flex-start",
                        }}
                    >
                        {row.map(
                            ([
                                category,
                                cards,
                            ]) => (
                                <View
                                    key={
                                        category
                                    }
                                >
                                    <Text
                                        style={{
                                            color:
                                                theme.colors.text,

                                            fontSize:
                                                18,

                                            fontWeight:
                                                "700",

                                            marginBottom:
                                                8,
                                        }}
                                    >
                                        {
                                            category
                                        }
                                    </Text>

                                    <View
                                        style={{
                                            flexDirection:
                                                "row",

                                            flexWrap:
                                                "wrap",

                                            gap: 8,

                                            alignItems:
                                                "flex-start",

                                            maxWidth:
                                                estimateSectionWidth(
                                                    cards.length
                                                ),
                                        }}
                                    >
                                        {cards.map(
                                            (
                                                item
                                            ) => {
                                                const realIndex =
                                                    items.findIndex(
                                                        (
                                                            x
                                                        ) =>
                                                            x ===
                                                            item
                                                    );

                                                return (
                                                    <DeckGridCard
                                                        key={`${item.cardName}-${realIndex}`}
                                                        item={
                                                            item
                                                        }
                                                        expanded={
                                                            expandedCardIndex ===
                                                            realIndex
                                                        }
                                                        variant={
                                                            variant
                                                        }
                                                        controls={
                                                            renderControls(
                                                                item,
                                                                realIndex
                                                            )
                                                        }
                                                        onHoverIn={() =>
                                                            onPreviewCard?.(
                                                                item
                                                            )
                                                        }
                                                        onHoverOut={() =>
                                                            onPreviewCard?.(
                                                                null
                                                            )
                                                        }
                                                        onPress={() =>
                                                            onExpandCard(
                                                                realIndex
                                                            )
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </View>
                                </View>
                            )
                        )}
                    </View>
                )
            )}
        </View>
    );
}