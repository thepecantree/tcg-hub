import type {
    UserCardEntry,
} from "@/types/cards";

function mockCard(
    cardName: string,
    options?: {
        imageSmall?: string | null;
        printSpecific?: boolean;
        quantity?: number;
        setCode?: string | null;
        scryfallId?: string | null;
    }
): UserCardEntry {
    return {
        cardName,

        scryfallId:
            options?.scryfallId ??
            null,

        setName:
            null,

        setCode:
            options?.setCode ??
            null,

        collectorNumber:
            null,

        imageSmall:
            options?.imageSmall ??
            null,

        typeLine:
            null,

        rarity:
            null,

        manaValue:
            null,

        colors:
            null,

        foil:
            false,

        quantity:
            options?.quantity ??
            1,

        printSpecific:
            options?.printSpecific ??
            false,
    };
}

export const mockPlayers = [
    {
        id: "1",

        displayName:
            "Nika",

        username:
            "sql",

        distance:
            "0.4 mi",

        distanceMiles:
            0.4,

        avatar:
            "https://placehold.co/300x300/png",

        games: [
            "Magic",
            "Pokémon",
        ],

        bio:
            "Control player, Commander brewer, always down for trades.",

        decks: [],

        collection: [
            mockCard(
                "Sol Ring"
            ),
            mockCard(
                "Rhystic Study"
            ),
            mockCard(
                "Counterspell"
            ),
        ],

        wishlist: [
            mockCard(
                "Mana Crypt",
                {
                    quantity: 1,
                    printSpecific: true,
                    setCode: "2xm",
                    scryfallId:
                        "manacrypt-special",
                }
            ),

            mockCard(
                "Force of Will",
                {
                    quantity: 2,
                }
            ),
        ],
    },

    {
        id: "2",

        displayName:
            "Maya",

        username:
            "manaforge",

        distance:
            "1.2 mi",

        distanceMiles:
            1.2,

        avatar:
            "https://placehold.co/300x300/png",

        games: [
            "Magic",
            "Yu-Gi-Oh!",
        ],

        bio:
            "Modern, Edison, and casual cube nights.",

        decks: [],

        collection: [
            mockCard(
                "Thoughtseize"
            ),
            mockCard(
                "Orcish Bowmasters"
            ),
        ],

        wishlist: [
            mockCard(
                "Rhystic Study",
                {
                    quantity: 4,
                }
            ),

            mockCard(
                "Sol Ring",
                {
                    quantity: 2,
                }
            ),
        ],
    },

    {
        id: "3",

        displayName:
            "Theo",

        username:
            "topdecktheo",

        distance:
            "2.1 mi",

        distanceMiles:
            2.1,

        avatar:
            "https://placehold.co/300x300/png",

        games: [
            "Pokémon",
            "One Piece",
        ],

        bio:
            "Looking for testing partners and local trades.",

        decks: [],

        collection: [
            mockCard(
                "Pikachu VMAX"
            ),
        ],

        wishlist: [
            mockCard(
                "Sol Ring",
                {
                    quantity: 4,
                }
            ),

            mockCard(
                "Counterspell",
                {
                    quantity: 2,
                }
            ),
        ],
    },

    {
        id: "4",

        displayName:
            "Alex",

        username:
            "stackresponder",

        distance:
            "2.8 mi",

        distanceMiles:
            2.8,

        avatar:
            "https://placehold.co/300x300/png",

        games: [
            "Magic",
        ],

        bio:
            "Draft addict and Commander regular.",

        decks: [],

        collection: [
            mockCard(
                "Force of Negation"
            ),
        ],

        wishlist: [
            mockCard(
                "Rhystic Study",
                {
                    quantity: 4,
                    printSpecific: true,
                    setCode: "jmp",
                    scryfallId:
                        "rhystic-jmp",
                }
            ),

            mockCard(
                "Counterspell",
                {
                    quantity: 1,
                }
            ),
        ],
    },

    {
        id: "5",

        displayName:
            "Sam",

        username:
            "sleevedup",

        distance:
            "3.5 mi",

        distanceMiles:
            3.5,

        avatar:
            "https://placehold.co/300x300/png",

        games: [
            "Pokémon",
            "Magic",
        ],

        bio:
            "Mostly Pokémon, sometimes Commander.",

        decks: [],

        collection: [
            mockCard(
                "Doubling Season"
            ),
        ],

        wishlist: [
            mockCard(
                "Sol Ring",
                {
                    quantity: 2,
                }
            ),

            mockCard(
                "Rhystic Study",
                {
                    quantity: 1,
                }
            ),
        ],
    },
]