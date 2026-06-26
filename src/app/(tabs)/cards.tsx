import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    useAuth,
} from "@/auth/AuthContext";

import { useTheme } from "@/theme/ThemeContext";

import type {
    CardSearchMode,
    CardSearchResult,
    UserCardEntry,
} from "@/types/cards";

import {
    groupCardsByName,
} from "@/components/cards/cardSearchUtils";

import CardSearchBar from "@/components/cards/CardSearchBar";
import CardSearchResults from "@/components/cards/CardSearchResults";
import CardSearchSettingsModal from "@/components/cards/CardSearchSettingsModal";
import LocalBinderDemand from "@/components/cards/LocalBinderDemand";
import LocalWishlistAvailability from "@/components/cards/LocalWishlistAvailability";

import {
    API_BASE_URL,
} from "@/api/config";

export default function CardsScreen() {
    const { theme } =
        useTheme();

    const {
        user,
    } = useAuth();

    const [
        query,
        setQuery,
    ] = useState("");

    const [
        rawCards,
        setRawCards,
    ] = useState<CardSearchResult[]>(
        []
    );

    const [
        localBinderCards,
        setLocalBinderCards,
    ] = useState<UserCardEntry[]>(
        []
    );

    const [
        localWishlistCards,
        setLocalWishlistCards,
    ] = useState<UserCardEntry[]>(
        []
    );

    const [
        submittedQuery,
        setSubmittedQuery,
    ] = useState("");

    const [
        hoveredCardName,
        setHoveredCardName,
    ] = useState<string | null>(
        null
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        settingsOpen,
        setSettingsOpen,
    ] = useState(false);

    const [
        searchMode,
        setSearchMode,
    ] = useState<CardSearchMode>(
        "string"
    );

    const groupedCards =
        useMemo(
            () =>
                groupCardsByName(
                    rawCards
                ),
            [rawCards]
        );

    const isSubmittedView =
        !!submittedQuery;

    useEffect(() => {
        async function initialize() {
            if (!user?.id) {
                setLocalBinderCards([]);
                setLocalWishlistCards([]);
                return;
            }

            const [collectionResponse, wishlistResponse] =
                await Promise.all([
                    fetch(
                        `${API_BASE_URL}/users/${encodeURIComponent(
                            user.id
                        )}/cards?listType=collection`
                    ),
                    fetch(
                        `${API_BASE_URL}/users/${encodeURIComponent(
                            user.id
                        )}/cards?listType=wishlist`
                    ),
                ]);

            const collectionData =
                await collectionResponse.json();

            const wishlistData =
                await wishlistResponse.json();

            setLocalBinderCards(
                Array.isArray(collectionData.cards)
                    ? collectionData.cards
                    : []
            );

            setLocalWishlistCards(
                Array.isArray(wishlistData.cards)
                    ? wishlistData.cards
                    : []
            );
        }

        initialize();
    }, [
        user?.id,
    ]);

    async function searchCards(
        searchText: string,
        submit = false
    ) {
        const trimmed =
            searchText.trim();

        if (!trimmed) {
            setRawCards([]);
            setSubmittedQuery("");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const response =
                await fetch(
                    `${API_BASE_URL}/cards/search?q=${encodeURIComponent(
                        trimmed
                    )}&mode=${searchMode}`
                );

            if (!response.ok) {
                throw new Error(
                    "Search failed."
                );
            }

            const data =
                await response.json();

            setRawCards(
                Array.isArray(data)
                    ? data
                    : []
            );

            if (submit) {
                setSubmittedQuery(
                    trimmed
                );
            }
        } catch {
            setErrorMessage(
                "Could not search cards. Make sure the server is running."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!query.trim()) {
            setRawCards([]);
            setSubmittedQuery("");
            return;
        }

        setSubmittedQuery("");

        const timeout =
            setTimeout(
                () => {
                    searchCards(
                        query,
                        false
                    );
                },
                250
            );

        return () =>
            clearTimeout(
                timeout
            );
    }, [
        query,
        searchMode,
    ]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.background,
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 120,
                }}
            >
                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        marginBottom: 16,
                    }}
                >
                    Search MTG cards by card name or set name.
                </Text>

                <CardSearchBar
                    query={query}
                    onChangeQuery={
                        setQuery
                    }
                    onSubmit={() =>
                        searchCards(
                            query,
                            true
                        )
                    }
                    onOpenSettings={() =>
                        setSettingsOpen(true)
                    }
                />

                {isLoading && (
                    <ActivityIndicator
                        size="small"
                        color={
                            theme.colors.primary
                        }
                        style={{
                            marginBottom: 12,
                        }}
                    />
                )}

                {!!errorMessage && (
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                            marginBottom: 12,
                        }}
                    >
                        {errorMessage}
                    </Text>
                )}

                <CardSearchResults
                    cards={
                        groupedCards
                    }
                    isSubmittedView={
                        isSubmittedView
                    }
                    hoveredCardName={
                        hoveredCardName
                    }
                    onHoverCard={
                        setHoveredCardName
                    }
                />

                <LocalBinderDemand
                    binderCards={localBinderCards}
                    localUserId={
                        user?.id
                    }
                />
                <LocalWishlistAvailability
                    wishlistCards={
                        localWishlistCards
                    }
                    localUserId={
                        user?.id
                    }
                />
            </ScrollView>

            <CardSearchSettingsModal
                visible={
                    settingsOpen
                }
                searchMode={
                    searchMode
                }
                onClose={() =>
                    setSettingsOpen(false)
                }
                onChangeMode={
                    setSearchMode
                }
            />
        </View>
    );
}