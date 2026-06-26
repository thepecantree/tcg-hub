import { UserCardEntry } from "@/components/CardEntryList";
import { UserDeckEntry } from "@/components/DeckListEditor";

export type UserProfile = {
    userId: string;

    displayName: string;

    username: string;

    location: string;

    bio: string;

    avatar: string;

    decks: UserDeckEntry[];

    collection: UserCardEntry[];

    wishlist: UserCardEntry[];
};

export const LOCAL_USER_ID =
    "1";

export const STORAGE_KEY =
    "userProfile";

export const defaultProfile: UserProfile = {
    userId:
        LOCAL_USER_ID,

    displayName:
        "Nika",

    username:
        "sql",

    location:
        "Ann Arbor, MI",

    bio:
        "Control player, Commander brewer, always down for trades.",

    avatar:
        "https://placehold.co/300x300/png",

    decks: [],

    collection: [],

    wishlist: [],
};

export function sameProfile(
    a: UserProfile,
    b: UserProfile
) {
    return (
        JSON.stringify(a) ===
        JSON.stringify(b)
    );
}