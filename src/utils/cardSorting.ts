import { UserCardEntry } from "@/types/cards";

function parseColors(colors?: string | null): string[] {
    if (!colors) {
        return [];
    }

    try {
        const parsed = JSON.parse(colors);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch {
        return [];
    }
}

export function getCardTypeGroup(
    card: UserCardEntry
) {
    if (!card.typeLine) {
        return "Other";
    }

    const cleanType =
        card.typeLine
            .split("—")[0]
            .trim();

    const knownTypes = [
        "Artifact",
        "Battle",
        "Creature",
        "Enchantment",
        "Instant",
        "Land",
        "Planeswalker",
        "Sorcery",
        "Kindred",
    ];

    const found =
        knownTypes.filter((type) =>
            cleanType.includes(type)
        );

    return found.length
        ? found.join(" ")
        : "Other";
}

function getColorGroup(
    card: UserCardEntry
) {
    const colors =
        parseColors(card.colors);

    if (colors.length === 0) {
        return "Colorless";
    }

    if (colors.length > 1) {
        return "Multicolor";
    }

    switch (colors[0]) {
        case "W":
            return "White";
        case "U":
            return "Blue";
        case "B":
            return "Black";
        case "R":
            return "Red";
        case "G":
            return "Green";
        default:
            return "Colorless";
    }
}

export function compareCardsWithinType(
    a: UserCardEntry,
    b: UserCardEntry
) {
    const order = [
        "Colorless",
        "White",
        "Blue",
        "Black",
        "Red",
        "Green",
        "Multicolor",
    ];

    const colorDiff =
        order.indexOf(getColorGroup(a)) -
        order.indexOf(getColorGroup(b));

    if (colorDiff !== 0) {
        return colorDiff;
    }

    const aColors =
        parseColors(a.colors);

    const bColors =
        parseColors(b.colors);

    if (aColors.length !== bColors.length) {
        return aColors.length - bColors.length;
    }

    const manaDiff =
        (a.manaValue ?? 0) -
        (b.manaValue ?? 0);

    if (manaDiff !== 0) {
        return manaDiff;
    }

    return a.cardName.localeCompare(
        b.cardName
    );
}

export function groupCardsByType(
    cards: UserCardEntry[]
) {
    const groups =
        cards.reduce<Record<string, UserCardEntry[]>>(
            (groups, card) => {
                const group =
                    getCardTypeGroup(card);

                if (!groups[group]) {
                    groups[group] = [];
                }

                groups[group].push(card);

                return groups;
            },
            {}
        );

    for (const group of Object.keys(groups)) {
        groups[group].sort(compareCardsWithinType);
    }

    return groups;
}