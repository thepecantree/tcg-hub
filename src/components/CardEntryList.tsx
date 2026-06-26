import { useState } from "react";

import {
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import {
    CardEntryListProps,
    CardEntryListVariant,
    CardPrinting,
    UserCardEntry,
} from "@/types/cards";

import CardAddInput from "@/components/cards/CardAddInput";
import CardControls from "@/components/cards/CardControls";
import CardListRow from "@/components/cards/CardListRow";
import DeckGridView from "@/components/cards/DeckGridView";
import PrintingPickerModal from "@/components/cards/PrintingPickerModal";

const API_BASE_URL =
    "http://localhost:4000";

type Props =
    CardEntryListProps & {
        hideTitle?: boolean;

        editable?: boolean;

        variant?: CardEntryListVariant;
    };

function cardFromApiResult(
    card: any,
    quantity = 1
): UserCardEntry {
    return {
        cardName:
            card.name,

        scryfallId:
            card.scryfallId,

        setName:
            card.setName,

        setCode:
            card.setCode,

        collectorNumber:
            card.collectorNumber,

        imageSmall:
            card.imageSmall,

        typeLine:
            card.typeLine,

        rarity:
            card.rarity,

        manaValue:
            card.manaValue,

        colors:
            card.colors,

        foil:
            false,

        quantity,

        printSpecific:
            false,
    };
}

export default function CardEntryList({
    title,
    items,
    onChange,
    displayMode = "list",
    variant = "default",
    onMakeFaceCard,
    onPreviewCard,
    hideTitle = false,
    editable = true,
}: Props) {
    const { theme } =
        useTheme();

    const [
        newCardName,
        setNewCardName,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        printingPickerIndex,
        setPrintingPickerIndex,
    ] = useState<
        number | null
    >(null);

    const [
        expandedCardIndex,
        setExpandedCardIndex,
    ] = useState<
        number | null
    >(null);

    const [
        printings,
        setPrintings,
    ] = useState<
        CardPrinting[]
    >([]);

    function showError(
        message: string
    ) {
        setErrorMessage(
            message
        );

        setTimeout(
            () => {
                setErrorMessage(
                    ""
                );
            },
            2500
        );
    }

    async function addCard() {
        if (!editable) {
            return;
        }

        const trimmed =
            newCardName.trim();

        if (!trimmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/cards/search?q=${encodeURIComponent(
                        trimmed
                    )}`
                );

            const data =
                await response.json();

            const exactMatch =
                data?.find?.(
                    (
                        card: any
                    ) =>
                        card.name?.toLowerCase() ===
                        trimmed.toLowerCase()
                ) ?? null;

            if (!exactMatch) {
                showError(
                    `"${trimmed}" is not a valid card`
                );

                return;
            }

            onChange([
                ...items,
                cardFromApiResult(
                    exactMatch
                ),
            ]);

            setNewCardName(
                ""
            );

            setErrorMessage(
                ""
            );
        } catch {
            showError(
                "Could not validate card"
            );
        }
    }

    async function openPrintingPicker(
        index: number
    ) {
        if (!editable) {
            return;
        }

        const card =
            items[index];

        setPrintingPickerIndex(
            index
        );

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/cards/editions?name=${encodeURIComponent(
                        card.cardName
                    )}`
                );

            const data =
                await response.json();

            setPrintings(
                Array.isArray(
                    data
                )
                    ? data
                    : []
            );
        } catch {
            setPrintings(
                []
            );
        }
    }

    function updateEntry(
        index: number,
        update: Partial<UserCardEntry>
    ) {
        if (!editable) {
            return;
        }

        onChange(
            items.map(
                (
                    item,
                    i
                ) =>
                    i === index
                        ? {
                            ...item,
                            ...update,
                        }
                        : item
            )
        );
    }

    function removeEntry(
        index: number
    ) {
        if (!editable) {
            return;
        }

        onChange(
            items.filter(
                (
                    _item,
                    i
                ) =>
                    i !== index
            )
        );
    }

    function renderControls(
        item: UserCardEntry,
        index: number
    ) {
        if (!editable) {
            return null;
        }

        return (
            <View>
                <CardControls
                    item={
                        item
                    }
                    onOpenPrintingPicker={() =>
                        openPrintingPicker(
                            index
                        )
                    }
                    onUpdate={(
                        update
                    ) =>
                        updateEntry(
                            index,
                            update
                        )
                    }
                    onRemove={() =>
                        removeEntry(
                            index
                        )
                    }
                    onMakeFaceCard={
                        onMakeFaceCard
                            ? () =>
                                onMakeFaceCard(
                                    item
                                )
                            : undefined
                    }
                />

                {variant ===
                    "wishlist" && (
                        <Text
                            onPress={() =>
                                updateEntry(
                                    index,
                                    {
                                        printSpecific:
                                            !item.printSpecific,
                                    }
                                )
                            }
                            style={{
                                color:
                                    item.printSpecific
                                        ? "#FACC15"
                                        : "#3B82F6",

                                fontWeight:
                                    "700",

                                marginTop:
                                    8,
                            }}
                        >
                            Print specific:{" "}
                            {item.printSpecific
                                ? "On"
                                : "Off"}
                        </Text>
                    )}
            </View>
        );
    }

    function selectPrinting(
        printing: CardPrinting
    ) {
        if (
            !editable ||
            printingPickerIndex ===
            null
        ) {
            return;
        }

        updateEntry(
            printingPickerIndex,
            {
                cardName:
                    printing.name,

                scryfallId:
                    printing.scryfallId,

                setName:
                    printing.setName,

                setCode:
                    printing.setCode,

                collectorNumber:
                    printing.collectorNumber,

                imageSmall:
                    printing.imageSmall,

                typeLine:
                    printing.typeLine,

                rarity:
                    printing.rarity,

                manaValue:
                    printing.manaValue,

                colors:
                    printing.colors,
            }
        );

        setPrintingPickerIndex(
            null
        );

        setPrintings(
            []
        );
    }

    return (
        <View
            style={{
                width:
                    "100%",

                backgroundColor:
                    theme.colors.surface,

                padding:
                    15,

                borderRadius:
                    14,

                marginBottom:
                    15,

                borderWidth:
                    1,

                borderColor:
                    theme.colors.border,
            }}
        >
            {!hideTitle && (
                <Text
                    style={{
                        fontWeight:
                            "bold",

                        color:
                            theme.colors.text,

                        marginBottom:
                            8,
                    }}
                >
                    {title}
                </Text>
            )}

            {!!errorMessage && (
                <Text
                    style={{
                        color:
                            "#EF4444",

                        marginBottom:
                            10,

                        fontSize:
                            13,
                    }}
                >
                    {errorMessage}
                </Text>
            )}

            {displayMode ===
                "deckGrid" ? (
                <DeckGridView
                    items={
                        items
                    }
                    variant={
                        variant
                    }
                    expandedCardIndex={
                        expandedCardIndex
                    }
                    onExpandCard={(
                        index
                    ) => {
                        setExpandedCardIndex(
                            expandedCardIndex ===
                                index
                                ? null
                                : index
                        );

                        onPreviewCard?.(
                            expandedCardIndex ===
                                index
                                ? null
                                : items[index]
                        );
                    }}
                    renderControls={
                        renderControls
                    }
                    onPreviewCard={
                        onPreviewCard
                    }
                />
            ) : (
                items.map(
                    (
                        item,
                        index
                    ) => (
                        <CardListRow
                            key={`${item.cardName}-${index}`}
                            item={
                                item
                            }
                            first={
                                index ===
                                0
                            }
                            controls={
                                renderControls(
                                    item,
                                    index
                                )
                            }
                        />
                    )
                )
            )}

            {editable && (
                <CardAddInput
                    title={
                        title
                    }
                    value={
                        newCardName
                    }
                    onChangeText={
                        setNewCardName
                    }
                    onAdd={
                        addCard
                    }
                />
            )}

            {editable && (
                <PrintingPickerModal
                    visible={
                        printingPickerIndex !==
                        null
                    }
                    printings={
                        printings
                    }
                    onSelect={
                        selectPrinting
                    }
                    onClose={() => {
                        setPrintingPickerIndex(
                            null
                        );

                        setPrintings(
                            []
                        );
                    }}
                />
            )}
        </View>
    );
}