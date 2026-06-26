export type UserCardEntry = {
    cardName: string;

    scryfallId: string | null;

    setName: string | null;

    setCode: string | null;

    collectorNumber: string | null;

    imageSmall: string | null;

    typeLine?: string | null;

    rarity?: string | null;

    manaValue?: number | null;

    colors?: string | null;

    foil: boolean;

    quantity: number;

    printSpecific?: boolean;
};

export type CardPrinting = {
    scryfallId: string;

    name: string;

    setName: string;

    setCode: string;

    collectorNumber: string | null;

    rarity: string | null;

    imageSmall: string | null;

    typeLine?: string | null;

    manaValue?: number | null;

    colors?: string | null;
};

export type CardEntryListDisplayMode =
    | "list"
    | "deckGrid";

export type CardEntryListVariant =
    | "default"
    | "tradeBinder"
    | "wishlist";

export type CardEntryListProps = {
    title: string;

    items: UserCardEntry[];

    onChange: (
        items: UserCardEntry[]
    ) => void;

    displayMode?:
    CardEntryListDisplayMode;

    variant?:
    CardEntryListVariant;

    onMakeFaceCard?: (
        card: UserCardEntry
    ) => void;

    onPreviewCard?: (
        card:
            | UserCardEntry
            | null
    ) => void;
};



/*
|--------------------------------------------------------------------------
| Card search
|--------------------------------------------------------------------------
*/

export type CardSearchResult = {
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

export type GroupedCard =
    CardSearchResult & {
        printingCount: number;
    };

export type CardSearchMode =
    | "string"
    | "server";