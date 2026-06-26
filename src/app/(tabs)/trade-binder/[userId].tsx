import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import CardEntryList from "@/components/CardEntryList";
import DeckActionsBar from "@/components/decks/DeckActionsBar";
import DeckImportPanel from "@/components/decks/DeckImportPanel";
import DeckPreviewPanel from "@/components/decks/DeckPreviewPanel";

import type {
    UserCardEntry,
} from "@/types/cards";

import {
    UserProfile,
} from "@/types/profile";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    fetchUserProfile,
} from "@/api/users";

import {
    API_BASE_URL,
} from "@/api/config";

export default function TradeBinderPage() {
    const { theme } =
        useTheme();

    const { userId } =
        useLocalSearchParams<{
            userId: string;
        }>();

    const {
        user,
    } = useAuth();

    const isCurrentUser =
        userId === user?.id;

    const [
        savedCards,
        setSavedCards,
    ] = useState<UserCardEntry[]>(
        []
    );

    const [
        draftCards,
        setDraftCards,
    ] = useState<UserCardEntry[]>(
        []
    );

    const [
        importText,
        setImportText,
    ] = useState("");

    const [
        showImportPanel,
        setShowImportPanel,
    ] = useState(false);

    const [
        previewCard,
        setPreviewCard,
    ] = useState<UserCardEntry | null>(
        null
    );

    const [
        notice,
        setNotice,
    ] = useState("");

    const [
        filterText,
        setFilterText,
    ] = useState("");

    useEffect(() => {
        loadBinder();
    }, [
        userId,
    ]);

    const hasUnsavedChanges =
        useMemo(
            () =>
                JSON.stringify(
                    savedCards
                ) !==
                JSON.stringify(
                    draftCards
                ),
            [
                savedCards,
                draftCards,
            ]
        );

    const filteredCards =
        useMemo(
            () => {
                const trimmed =
                    filterText
                        .trim()
                        .toLowerCase();

                if (!trimmed) {
                    return draftCards;
                }

                return draftCards.filter(
                    (
                        card
                    ) => {
                        const haystack =
                            [
                                card.cardName,
                                card.setName,
                                card.setCode,
                                card.typeLine,
                                card.rarity,
                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();

                        return haystack.includes(
                            trimmed
                        );
                    }
                );
            },
            [
                draftCards,
                filterText,
            ]
        );

    function showNotice(
        message: string
    ) {
        setNotice(
            message
        );

        setTimeout(
            () =>
                setNotice(
                    ""
                ),
            1800
        );
    }

    async function loadBinder() {
        if (!userId) {
            setSavedCards([]);
            setDraftCards([]);
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        userId
                    )}/cards?listType=collection`
                );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            const cards =
                Array.isArray(
                    data.cards
                )
                    ? data.cards
                    : [];

            setSavedCards(
                cards
            );

            setDraftCards(
                JSON.parse(
                    JSON.stringify(
                        cards
                    )
                )
            );
        } catch {
            setSavedCards([]);
            setDraftCards([]);
        }
    }

    async function saveBinder() {
        if (
            !isCurrentUser ||
            !userId
        ) {
            return;
        }

        try {
            await fetch(
                `${API_BASE_URL}/users/${encodeURIComponent(
                    userId
                )}/cards/replace-collection`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body:
                        JSON.stringify({
                            cards:
                                draftCards,
                        }),
                }
            );

            setSavedCards(
                JSON.parse(
                    JSON.stringify(
                        draftCards
                    )
                )
            );

            showNotice(
                "Trade binder saved"
            );
        } catch {
            showNotice(
                "Could not save binder"
            );
        }
    }

    function discardChanges() {
        setDraftCards(
            JSON.parse(
                JSON.stringify(
                    savedCards
                )
            )
        );

        showNotice(
            "Changes discarded"
        );
    }

    async function clearBinder() {
        if (!isCurrentUser) {
            return;
        }

        const confirmDelete =
            Platform.OS ===
                "web"
                ? window.confirm(
                    "Clear your trade binder?"
                )
                : true;

        if (!confirmDelete) {
            return;
        }

        setDraftCards(
            []
        );

        showNotice(
            "Trade binder cleared"
        );
    }

    function parseImportLine(
        line: string
    ) {
        const trimmed =
            line.trim();

        if (!trimmed) {
            return null;
        }

        const quantityMatch =
            trimmed.match(
                /^(\d+)\s+(.+)$/
            );

        const quantity =
            quantityMatch
                ? Number(
                    quantityMatch[1]
                )
                : 1;

        let cardName =
            quantityMatch
                ? quantityMatch[2]
                : trimmed;

        cardName =
            cardName.replace(
                /\s+\([A-Za-z0-9]+\)(?:\s+[A-Za-z0-9]+)?$/,
                ""
            );

        return {
            quantity,

            cardName:
                cardName.trim(),
        };
    }

    async function resolveCard(
        cardName: string,
        quantity: number
    ): Promise<UserCardEntry | null> {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/cards/search?q=${encodeURIComponent(
                        cardName
                    )}`
                );

            const results =
                await response.json();

            if (
                !Array.isArray(
                    results
                ) ||
                results.length === 0
            ) {
                return null;
            }

            const selected =
                results.find(
                    (
                        card: any
                    ) =>
                        card.name?.toLowerCase() ===
                        cardName.toLowerCase()
                ) ??
                results[0];

            return {
                cardName:
                    selected.name,

                scryfallId:
                    selected.scryfallId,

                setName:
                    selected.setName,

                setCode:
                    selected.setCode,

                collectorNumber:
                    selected.collectorNumber,

                imageSmall:
                    selected.imageSmall,

                typeLine:
                    selected.typeLine,

                rarity:
                    selected.rarity,

                manaValue:
                    selected.manaValue,

                colors:
                    selected.colors,

                foil:
                    false,

                quantity,
            };
        } catch {
            return null;
        }
    }

    async function importCards() {
        if (!isCurrentUser) {
            return;
        }

        const lines =
            importText
                .split(/\r?\n/)
                .map(
                    (
                        line
                    ) =>
                        line.trim()
                )
                .filter(Boolean);

        if (
            lines.length === 0
        ) {
            showNotice(
                "No cards entered"
            );

            return;
        }

        showNotice(
            `Checking ${lines.length} cards...`
        );

        const resolved:
            UserCardEntry[] = [];

        const missed:
            string[] = [];

        for (
            const line of lines
        ) {
            const parsed =
                parseImportLine(
                    line
                );

            if (!parsed) {
                missed.push(
                    line
                );

                continue;
            }

            const card =
                await resolveCard(
                    parsed.cardName,
                    parsed.quantity
                );

            if (card) {
                resolved.push(
                    card
                );
            } else {
                missed.push(
                    parsed.cardName
                );
            }
        }

        if (
            resolved.length ===
            0
        ) {
            showNotice(
                `No cards found: ${missed[0] ?? "unknown"}`
            );

            return;
        }

        setDraftCards([
            ...draftCards,
            ...resolved,
        ]);

        setImportText(
            ""
        );

        showNotice(
            missed.length
                ? `Added ${resolved.length}, missed ${missed.length}`
                : `Added ${resolved.length} cards`
        );
    }

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
                    padding: 16,

                    paddingBottom:
                        120,

                    flexDirection:
                        "row",

                    gap: 20,
                }}
            >
                <DeckPreviewPanel
                    faceCardImage={
                        draftCards[0]
                            ?.imageSmall
                    }
                    previewCard={
                        previewCard
                    }
                />

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 28,

                            fontWeight:
                                "800",

                            color:
                                theme.colors.text,

                            marginBottom:
                                12,
                        }}
                    >
                        Trade Binder
                    </Text>

                    {isCurrentUser && (
                        <Text
                            onPress={() =>
                                setShowImportPanel(
                                    !showImportPanel
                                )
                            }
                            style={{
                                alignSelf:
                                    "flex-start",

                                color:
                                    theme.colors.primary,

                                fontWeight:
                                    "800",

                                marginBottom:
                                    12,
                            }}
                        >
                            {showImportPanel
                                ? "Close Import"
                                : "Import"}
                        </Text>
                    )}

                    <DeckImportPanel
                        visible={
                            isCurrentUser &&
                            showImportPanel
                        }
                        importText={
                            importText
                        }
                        onChangeImportText={
                            setImportText
                        }
                        onImport={
                            importCards
                        }
                    />

                    <TextInput
                        value={
                            filterText
                        }
                        onChangeText={
                            setFilterText
                        }
                        placeholder="Search this trade binder..."
                        placeholderTextColor={
                            theme.colors.textMuted
                        }
                        style={{
                            backgroundColor:
                                theme.colors.surface,

                            color:
                                theme.colors.text,

                            borderWidth: 1,

                            borderColor:
                                theme.colors.border,

                            borderRadius:
                                14,

                            padding:
                                12,

                            marginBottom:
                                12,
                        }}
                    />

                    <CardEntryList
                        title="Trade Binder"
                        displayMode="deckGrid"
                        items={
                            filteredCards
                        }
                        editable={
                            isCurrentUser &&
                            !filterText.trim()
                        }
                        onChange={(
                            cards
                        ) => {
                            if (
                                filterText.trim()
                            ) {
                                setDraftCards(
                                    cards
                                );

                                return;
                            }

                            setDraftCards(
                                cards
                            );
                        }}
                        onPreviewCard={
                            setPreviewCard
                        }
                    />
                </View>
            </ScrollView>

            {isCurrentUser && (
                <DeckActionsBar
                    hasUnsavedChanges={
                        hasUnsavedChanges
                    }
                    onSave={
                        saveBinder
                    }
                    onDiscard={
                        discardChanges
                    }
                    onDelete={
                        clearBinder
                    }
                />
            )}

            {!!notice && (
                <View
                    style={{
                        position:
                            "absolute",

                        bottom: 70,

                        alignSelf:
                            "center",

                        backgroundColor:
                            theme.colors.surface,

                        borderWidth: 1,

                        borderColor:
                            theme.colors.border,

                        borderRadius:
                            999,

                        paddingVertical:
                            8,

                        paddingHorizontal:
                            14,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.text,

                            fontWeight:
                                "700",
                        }}
                    >
                        {notice}
                    </Text>
                </View>
            )}
        </View>
    );
}