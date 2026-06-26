import type {
    CardSearchResult,
    GroupedCard,
} from "@/types/cards";

export function groupCardsByName(
    cards: CardSearchResult[]
): GroupedCard[] {
    const map =
        new Map<
            string,
            GroupedCard
        >();

    for (const card of cards) {
        const existing =
            map.get(
                card.name
            );

        if (!existing) {
            map.set(
                card.name,
                {
                    ...card,
                    printingCount: 1,
                }
            );
        } else {
            existing.printingCount += 1;
        }
    }

    return Array.from(
        map.values()
    );
}