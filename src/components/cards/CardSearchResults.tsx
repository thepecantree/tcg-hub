import {
    FlatList,
    useWindowDimensions,
} from "react-native";

import CardSearchResultItem from "@/components/cards/CardSearchResultItem";

import type {
    GroupedCard,
} from "@/types/cards";

type Props = {
    cards: GroupedCard[];

    isSubmittedView: boolean;

    hoveredCardName: string | null;

    onHoverCard: (
        name: string | null
    ) => void;
};

export default function CardSearchResults({
    cards,
    isSubmittedView,
    hoveredCardName,
    onHoverCard,
}: Props) {
    const { width } =
        useWindowDimensions();

    const gap = 12;

    const columns =
        isSubmittedView
            ? Math.max(
                4,
                Math.floor(
                    width / 110
                )
            )
            : 1;

    const cardWidth =
        isSubmittedView
            ? (
                width -
                40 -
                gap *
                (
                    columns -
                    1
                )
            ) /
            columns
            : "100%";

    return (
        <FlatList
            data={cards}
            key={columns}
            numColumns={columns}
            columnWrapperStyle={
                isSubmittedView
                    ? {
                        gap,
                    }
                    : undefined
            }
            contentContainerStyle={{
                paddingBottom: 24,
            }}
            keyExtractor={(item) =>
                item.name
            }
            renderItem={({ item }) => {
                const isHovered =
                    hoveredCardName ===
                    item.name;

                return (
                    <CardSearchResultItem
                        card={item}
                        width={cardWidth}
                        isSubmittedView={
                            isSubmittedView
                        }
                        isHovered={
                            isHovered
                        }
                        onHoverIn={() =>
                            onHoverCard(
                                item.name
                            )
                        }
                        onHoverOut={() =>
                            onHoverCard(
                                null
                            )
                        }
                    />
                );
            }}
        />
    );
}