import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Platform,
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

import CardEntryList from "@/components/CardEntryList";

import type {
    UserCardEntry,
} from "@/types/cards";

import type {
    DeckFormat,
    DeckPowerLevel,
} from "@/components/DeckListEditor";

import DeckEditorHeader from "@/components/decks/DeckEditorHeader";
import DeckImportPanel from "@/components/decks/DeckImportPanel";
import DeckPreviewPanel from "@/components/decks/DeckPreviewPanel";
import DeckActionsBar from "@/components/decks/DeckActionsBar";

const API_BASE_URL =
    "http://localhost:4000";

type UserDeck = {
    id: string;
    userId?: string;
    name: string;
    cards: UserCardEntry[];

    faceCardName?: string;
    faceCardImage?: string | null;

    isPublic?: boolean;

    visibility?:
    | "private"
    | "unlisted"
    | "public";

    format?: DeckFormat;
    powerLevel?: DeckPowerLevel;
};

function normalizeDeckFormat(
    value: any
): DeckFormat {
    const formats: DeckFormat[] = [
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

    return formats.includes(value)
        ? value
        : "Unsorted";
}

function normalizePowerLevel(
    value: any
): DeckPowerLevel {
    const number =
        Number(value);

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

export default function DeckDraftPage() {
    const { theme } =
        useTheme();

    const { user } =
        useAuth();

    const { width } =
        useWindowDimensions();

    const isMobile =
        width < 700;

    const {
        id,
        userId,
    } =
        useLocalSearchParams<{
            id: string;
            userId?: string;
        }>();

    const ownerUserId =
        userId ?? user?.id;

    const canEdit =
        ownerUserId === user?.id;

    const [
        savedDeck,
        setSavedDeck,
    ] = useState<UserDeck | null>(
        null
    );

    const [
        draftDeck,
        setDraftDeck,
    ] = useState<UserDeck | null>(
        null
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

    useEffect(() => {
        loadDeck();
    }, [
        id,
        ownerUserId,
    ]);

    function showNotice(
        message: string
    ) {
        setNotice(message);

        setTimeout(
            () =>
                setNotice(""),
            1800
        );
    }

    async function loadDeck() {
        if (
            !id ||
            !ownerUserId
        ) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        ownerUserId
                    )}/decks/${encodeURIComponent(id)}`
                );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            const found =
                data.deck;

            const normalizedDeck: UserDeck = {
                ...found,

                format:
                    normalizeDeckFormat(
                        found.format
                    ),

                powerLevel:
                    normalizePowerLevel(
                        found.powerLevel
                    ),

                cards:
                    Array.isArray(found.cards)
                        ? found.cards
                        : [],
            };

            setSavedDeck(
                normalizedDeck
            );

            setDraftDeck(
                JSON.parse(
                    JSON.stringify(
                        normalizedDeck
                    )
                )
            );
        } catch {
            setSavedDeck(null);
            setDraftDeck(null);
        }
    }

    const hasUnsavedChanges =
        useMemo(
            () =>
                JSON.stringify(savedDeck) !==
                JSON.stringify(draftDeck),
            [
                savedDeck,
                draftDeck,
            ]
        );

    async function saveDeck() {
        if (
            !draftDeck ||
            !ownerUserId ||
            !canEdit
        ) {
            return;
        }

        const nextDeck: UserDeck = {
            ...draftDeck,

            format:
                normalizeDeckFormat(
                    draftDeck.format
                ),

            powerLevel:
                normalizePowerLevel(
                    draftDeck.powerLevel
                ),

            visibility:
                draftDeck.visibility ?? "private",

            isPublic:
                (draftDeck.visibility ?? "private") === "public",
        };

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        ownerUserId
                    )}/decks/${encodeURIComponent(
                        nextDeck.id
                    )}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                name:
                                    nextDeck.name,
                                faceCardName:
                                    nextDeck.faceCardName,
                                faceCardImage:
                                    nextDeck.faceCardImage,
                                isPublic:
                                    nextDeck.isPublic,
                                format:
                                    nextDeck.format,
                                powerLevel:
                                    nextDeck.powerLevel,
                                visibility:
                                    nextDeck.visibility ?? "private",
                            }),
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            const cardsResponse =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        ownerUserId
                    )}/decks/${encodeURIComponent(
                        nextDeck.id
                    )}/replace-cards`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                cards:
                                    nextDeck.cards,
                            }),
                    }
                );

            if (!cardsResponse.ok) {
                throw new Error();
            }

            setDraftDeck(nextDeck);

            setSavedDeck(
                JSON.parse(
                    JSON.stringify(
                        nextDeck
                    )
                )
            );

            showNotice(
                "Saved successfully"
            );
        } catch {
            showNotice(
                "Could not save deck"
            );
        }
    }

    function discardChanges() {
        if (!savedDeck) {
            return;
        }

        setDraftDeck(
            JSON.parse(
                JSON.stringify(
                    savedDeck
                )
            )
        );

        showNotice(
            "Changes discarded"
        );
    }

    async function deleteDeck() {
        if (
            !draftDeck ||
            !ownerUserId ||
            !canEdit
        ) {
            return;
        }

        const confirmDelete =
            Platform.OS === "web"
                ? window.confirm(
                    `Delete "${draftDeck.name}"?`
                )
                : true;

        if (!confirmDelete) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/users/${encodeURIComponent(
                        ownerUserId
                    )}/decks/${encodeURIComponent(
                        draftDeck.id
                    )}`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            router.back();
        } catch {
            showNotice(
                "Could not delete deck"
            );
        }
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
                !Array.isArray(results) ||
                results.length === 0
            ) {
                return null;
            }

            const selected =
                results.find(
                    (card: any) =>
                        card.name?.toLowerCase() ===
                        cardName.toLowerCase()
                ) ?? results[0];

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

                printSpecific:
                    false,
            };
        } catch {
            return null;
        }
    }

    async function addCards() {
        if (!canEdit) {
            showNotice(
                "You can only edit your own decks."
            );

            return;
        }
        if (!draftDeck) {
            showNotice(
                "Deck not loaded"
            );

            return;
        }

        const lines =
            importText
                .split(/\r?\n/)
                .map(
                    (line) =>
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

        const resolved: UserCardEntry[] =
            [];

        const missed: string[] =
            [];

        for (const line of lines) {
            const parsed =
                parseImportLine(line);

            if (!parsed) {
                missed.push(line);
                continue;
            }

            const card =
                await resolveCard(
                    parsed.cardName,
                    parsed.quantity
                );

            if (card) {
                resolved.push(card);
            } else {
                missed.push(
                    parsed.cardName
                );
            }
        }

        if (
            resolved.length === 0
        ) {
            showNotice(
                `No cards found: ${missed[0] ?? "unknown"}`
            );

            return;
        }

        const nextDeck = {
            ...draftDeck,

            cards: [
                ...(draftDeck.cards ?? []),
                ...resolved,
            ],

            faceCardName:
                draftDeck.faceCardName ||
                resolved[0].cardName,

            faceCardImage:
                draftDeck.faceCardImage ||
                resolved[0].imageSmall,
        };

        setDraftDeck(nextDeck);

        setImportText("");

        showNotice(
            missed.length
                ? `Added ${resolved.length}, missed ${missed.length}`
                : `Added ${resolved.length} cards`
        );
    }

    if (!draftDeck) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent:
                        "center",
                    alignItems:
                        "center",
                    backgroundColor:
                        theme.colors.background,
                }}
            >
                <Text
                    style={{
                        color:
                            theme.colors.text,
                    }}
                >
                    Deck not found
                </Text>
            </View>
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

                    paddingBottom: 120,

                    flexDirection:
                        isMobile
                            ? "column"
                            : "row",

                    gap: 20,
                }}
            >
                {!isMobile && (
                    <DeckPreviewPanel
                        faceCardImage={
                            draftDeck.faceCardImage
                        }
                        previewCard={
                            previewCard
                        }
                    />
                )}

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <DeckEditorHeader
                        editable={canEdit}
                        name={draftDeck.name}
                        format={normalizeDeckFormat(
                            draftDeck.format
                        )}
                        powerLevel={normalizePowerLevel(
                            draftDeck.powerLevel
                        )}
                        visibility={
                            draftDeck.visibility ??
                            "private"
                        }
                        onChangeVisibility={(
                            visibility
                        ) =>
                            setDraftDeck({
                                ...draftDeck,
                                visibility,
                                isPublic:
                                    visibility ===
                                    "public",
                            })
                        }
                        showImportPanel={
                            showImportPanel
                        }
                        onChangeName={(name) =>
                            setDraftDeck({
                                ...draftDeck,
                                name,
                            })
                        }
                        onChangeFormat={(format) =>
                            setDraftDeck({
                                ...draftDeck,
                                format,
                            })
                        }
                        onChangePowerLevel={(powerLevel) =>
                            setDraftDeck({
                                ...draftDeck,
                                powerLevel,
                            })
                        }
                        onToggleImportPanel={() =>
                            setShowImportPanel(!showImportPanel)
                        }
                    />
                    {canEdit && (
                        <DeckImportPanel
                            visible={showImportPanel}
                            importText={importText}
                            onChangeImportText={setImportText}
                            onImport={addCards}
                        />
                    )}

                    <CardEntryList
                        editable={canEdit}
                        title="Deck Cards"
                        displayMode="deckGrid"
                        items={
                            draftDeck.cards
                        }
                        onChange={(
                            cards
                        ) =>
                            setDraftDeck({
                                ...draftDeck,
                                cards,
                            })
                        }
                        onMakeFaceCard={(
                            card
                        ) =>
                            setDraftDeck({
                                ...draftDeck,
                                faceCardName:
                                    card.cardName,
                                faceCardImage:
                                    card.imageSmall,
                            })
                        }
                        onPreviewCard={
                            setPreviewCard
                        }
                    />
                </View>
            </ScrollView>

            {canEdit && (
                <DeckActionsBar
                    hasUnsavedChanges={hasUnsavedChanges}
                    onSave={saveDeck}
                    onDiscard={discardChanges}
                    onDelete={deleteDeck}
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
                        borderRadius: 999,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
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