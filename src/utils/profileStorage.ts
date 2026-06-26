import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import {
    defaultProfile,
    LOCAL_USER_ID,
    STORAGE_KEY,
    UserProfile,
} from "@/types/profile";

import { UserCardEntry } from "@/types/cards";

import {
    DeckFormat,
    DeckPowerLevel,
    UserDeckEntry,
} from "@/components/DeckListEditor";

const DEFAULT_FACE_CARD_IMAGE =
    "https://cards.scryfall.io/normal/front/8/5/85a874ec-07d2-4140-84a7-1f30e1608f80.jpg";

const VALID_FORMATS: DeckFormat[] = [
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

function normalizeDeckFormat(value: any): DeckFormat {
    return VALID_FORMATS.includes(value)
        ? value
        : "Unsorted";
}

function normalizePowerLevel(value: any): DeckPowerLevel {
    const number = Number(value);

    if (
        number === 1 ||
        number === 2 ||
        number === 3 ||
        number === 4 ||
        number === 5
    ) {
        return number;
    }

    return 1;
}

function normalizeCardEntry(item: any): UserCardEntry {
    if (typeof item === "string") {
        return {
            cardName: item,
            scryfallId: null,
            setName: null,
            setCode: null,
            collectorNumber: null,
            imageSmall: null,
            typeLine: null,
            rarity: null,
            manaValue: null,
            colors: null,
            foil: false,
            quantity: 1,
            printSpecific: false,
        };
    }

    return {
        cardName: item.cardName ?? item.name ?? "Unknown Card",
        scryfallId: item.scryfallId ?? null,
        setName: item.setName ?? null,
        setCode: item.setCode ?? null,
        collectorNumber: item.collectorNumber ?? null,
        imageSmall: item.imageSmall ?? null,
        typeLine: item.typeLine ?? null,
        rarity: item.rarity ?? null,
        manaValue: item.manaValue ?? null,
        colors: item.colors ?? null,
        foil: item.foil ?? false,
        quantity: item.quantity ?? 1,
        printSpecific: item.printSpecific ?? false,
    };
}

function normalizeDeckEntry(item: any): UserDeckEntry {
    if (typeof item === "string") {
        return {
            id: `deck-${item}`,
            name: item,
            faceCardName: "Loot, the Pathfinder",
            faceCardImage: DEFAULT_FACE_CARD_IMAGE,
            isPublic: false,
            format: "Unsorted",
            powerLevel: 1,
            cards: [],
        };
    }

    return {
        id: item.id ?? `deck-${Date.now()}`,
        name: item.name ?? "Untitled Deck",
        faceCardName: item.faceCardName ?? "Loot, the Pathfinder",
        faceCardImage: item.faceCardImage ?? DEFAULT_FACE_CARD_IMAGE,
        isPublic: item.isPublic ?? false,
        format: normalizeDeckFormat(item.format),
        powerLevel: normalizePowerLevel(item.powerLevel),
        cards: Array.isArray(item.cards)
            ? item.cards.map(normalizeCardEntry)
            : [],
    };
}

export function normalizeProfile(raw: any): UserProfile {
    return {
        ...defaultProfile,
        ...raw,

        userId: raw?.userId ?? LOCAL_USER_ID,
        location: raw?.location ?? defaultProfile.location,

        avatar:
            typeof raw?.avatar === "string" && raw.avatar.length > 0
                ? raw.avatar
                : defaultProfile.avatar,

        decks: Array.isArray(raw?.decks)
            ? raw.decks.map(normalizeDeckEntry)
            : [],

        collection: Array.isArray(raw?.collection)
            ? raw.collection.map(normalizeCardEntry)
            : [],

        wishlist: Array.isArray(raw?.wishlist)
            ? raw.wishlist.map(normalizeCardEntry)
            : [],
    };
}

function getProfileStorageKey(
    userId?: string
) {
    return `${STORAGE_KEY}:${userId ?? LOCAL_USER_ID}`;
}

export async function loadProfile(
    userId?: string
) {
    const profileKey =
        getProfileStorageKey(
            userId
        );

    const stored =
        await AsyncStorage.getItem(
            profileKey
        );

    if (!stored) {
        return normalizeProfile({
            ...defaultProfile,
            userId:
                userId ?? LOCAL_USER_ID,
        });
    }

    try {
        return normalizeProfile(
            JSON.parse(stored)
        );
    } catch {
        return normalizeProfile({
            ...defaultProfile,
            userId:
                userId ?? LOCAL_USER_ID,
        });
    }
}

export async function saveProfile(
    profile: UserProfile
) {
    const normalized =
        normalizeProfile(
            profile
        );

    const profileKey =
        getProfileStorageKey(
            normalized.userId
        );

    await AsyncStorage.setItem(
        profileKey,
        JSON.stringify(
            normalized
        )
    );
}

async function uriToDataUrl(uri: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Could not read avatar image."));
            }
        };

        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export async function saveUserAvatar(
    userId: string,
    sourceUri: string
) {
    if (Platform.OS === "web") {
        if (
            sourceUri.startsWith("data:") ||
            sourceUri.startsWith("http")
        ) {
            return sourceUri;
        }

        return await uriToDataUrl(sourceUri);
    }

    const avatarDir =
        `${FileSystem.documentDirectory}avatars/`;

    const avatarPath =
        `${avatarDir}${userId}-${Date.now()}.jpg`;

    const dirInfo =
        await FileSystem.getInfoAsync(avatarDir);

    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(
            avatarDir,
            {
                intermediates: true,
            }
        );
    }

    await FileSystem.copyAsync({
        from: sourceUri,
        to: avatarPath,
    });

    return avatarPath;
}