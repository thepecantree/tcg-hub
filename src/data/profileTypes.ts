export type UserCardEntry = {
    cardName: string;
    scryfallId: string | null;
    setName: string | null;
    setCode: string | null;
    collectorNumber: string | null;
    imageSmall: string | null;
    foil: boolean;
    quantity: number;
};

export type UserProfile = {
    userId: string;
    displayName: string;
    username: string;
    bio: string;
    avatar: string;
    decks: string[];
    collection: UserCardEntry[];
    wishlist: UserCardEntry[];
};