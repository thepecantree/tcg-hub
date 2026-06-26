import type {
    UserCardEntry,
} from "@/types/cards";

export function normalizeCardName(
    value: string
) {
    return value
        .trim()
        .toLowerCase();
}

export function sameCardName(
    a: UserCardEntry,
    b: UserCardEntry
) {
    return (
        normalizeCardName(
            a.cardName
        ) ===
        normalizeCardName(
            b.cardName
        )
    );
}

export function sameExactPrinting(
    a: UserCardEntry,
    b: UserCardEntry
) {
    if (
        a.scryfallId &&
        b.scryfallId
    ) {
        return (
            a.scryfallId ===
            b.scryfallId
        );
    }

    return (
        sameCardName(
            a,
            b
        ) &&
        !!a.setCode &&
        !!b.setCode &&
        a.setCode.toLowerCase() ===
        b.setCode.toLowerCase() &&
        !!a.collectorNumber &&
        !!b.collectorNumber &&
        a.collectorNumber ===
        b.collectorNumber
    );
}

export function binderCardMatchesWishlistCard(
    binderCard: UserCardEntry,
    wishlistCard: UserCardEntry
) {
    if (
        !sameCardName(
            binderCard,
            wishlistCard
        )
    ) {
        return false;
    }

    if (
        wishlistCard.printSpecific &&
        !sameExactPrinting(
            binderCard,
            wishlistCard
        )
    ) {
        return false;
    }

    if (
        wishlistCard.foil &&
        !binderCard.foil
    ) {
        return false;
    }

    return true;
}

export function cardNameMatchesEntry(
    cardName: string,
    entry: UserCardEntry
) {
    return (
        normalizeCardName(
            cardName
        ) ===
        normalizeCardName(
            entry.cardName
        )
    );
}