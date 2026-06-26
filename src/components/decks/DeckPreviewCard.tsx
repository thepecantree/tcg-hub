import {
    Alert,
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import { useState } from "react";

import { useTheme } from "@/theme/ThemeContext";

import type {
    UserDeckEntry,
} from "@/components/DeckListEditor";

const POWER_LEVEL_COLORS = {
    1: "#22C55E",
    2: "#A3E635",
    3: "#F59E0B",
    4: "#EA580C",
    5: "#7F1D1D",
} as const;

type Props = {
    deck: UserDeckEntry;
    ownerUserId: string;
    cardWidth: number;

    canEdit?: boolean;

    onDelete?: () => void;
    onRename?: () => void;

    onAddCustomFaceImage?: () => void;
    onChangeCustomFaceImage?: () => void;
    onRemoveCustomFaceImage?: () => void;

    onCopyDecklist?: () => void;
    onShareDecklist?: () => void;
};

export default function DeckPreviewCard({
    deck,
    ownerUserId,
    cardWidth,
    canEdit = false,
    onDelete,
    onRename,
    onAddCustomFaceImage,
    onChangeCustomFaceImage,
    onRemoveCustomFaceImage,
    onCopyDecklist,
    onShareDecklist,
}: Props) {
    const { theme } =
        useTheme();

    const [
        menuOpen,
        setMenuOpen,
    ] = useState(false);

    const powerLevel =
        deck.powerLevel ?? 1;

    const frameColor =
        POWER_LEVEL_COLORS[
        powerLevel as keyof typeof POWER_LEVEL_COLORS
        ] ?? POWER_LEVEL_COLORS[1];

    const hasCustomFaceImage =
        Boolean(
            deck.faceCardImage &&
            !deck.faceCardImage.includes(
                "cards.scryfall.io"
            )
        );

    function openDeck() {
        if (menuOpen) {
            setMenuOpen(false);
            return;
        }

        router.push({
            pathname:
                "/(tabs)/deck-draft/[id]",
            params: {
                id: deck.id,
                userId:
                    deck.userId ??
                    ownerUserId,
            },
        } as any);
    }

    function confirmDelete() {
        setMenuOpen(false);

        if (!onDelete) {
            return;
        }

        Alert.alert(
            "Delete deck?",
            `Are you sure you want to delete "${deck.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: onDelete,
                },
            ]
        );
    }

    function runAction(
        action?: () => void
    ) {
        setMenuOpen(false);
        action?.();
    }

    return (
        <View
            style={{
                width:
                    cardWidth,
                position:
                    "relative",
            }}
        >
            <Pressable
                onPress={
                    openDeck
                }
                style={{
                    width:
                        cardWidth,
                }}
            >
                <View
                    style={{
                        width:
                            cardWidth,
                        aspectRatio:
                            0.716,
                        borderRadius:
                            13,
                        padding:
                            4,
                        backgroundColor:
                            frameColor,
                    }}
                >
                    <View
                        style={{
                            width:
                                "100%",
                            height:
                                "100%",
                            borderRadius:
                                10,
                            overflow:
                                "hidden",
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderWidth:
                                1,
                            borderColor:
                                theme.colors.border,
                            position:
                                "relative",
                        }}
                    >
                        {deck.faceCardImage ? (
                            <Image
                                source={{
                                    uri:
                                        deck.faceCardImage,
                                }}
                                resizeMode="cover"
                                style={{
                                    width:
                                        "100%",
                                    height:
                                        "100%",
                                }}
                            />
                        ) : (
                            <View
                                style={{
                                    flex: 1,
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    padding:
                                        8,
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            theme.colors.textMuted,
                                        fontWeight:
                                            "800",
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    No face image
                                </Text>
                            </View>
                        )}

                        <View
                            style={{
                                position:
                                    "absolute",
                                left: 0,
                                right: 0,
                                bottom: 0,
                                maxHeight:
                                    "50%",
                                backgroundColor:
                                    "rgba(0,0,0,.82)",
                                paddingVertical:
                                    4,
                                paddingHorizontal:
                                    5,
                                justifyContent:
                                    "flex-end",
                            }}
                        >
                            <Text
                                numberOfLines={
                                    3
                                }
                                style={{
                                    color:
                                        "white",
                                    fontWeight:
                                        "900",
                                    fontSize:
                                        Math.max(
                                            6.5,
                                            Math.min(
                                                13,
                                                cardWidth /
                                                9.5
                                            )
                                        ),
                                    textAlign:
                                        "center",
                                }}
                            >
                                {deck.name}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>

            <Pressable
                onPress={() =>
                    setMenuOpen(
                        !menuOpen
                    )
                }
                style={{
                    position:
                        "absolute",
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius:
                        999,
                    backgroundColor:
                        "rgba(0,0,0,.72)",
                    alignItems:
                        "center",
                    justifyContent:
                        "center",
                    borderWidth:
                        1,
                    borderColor:
                        "rgba(255,255,255,.3)",
                }}
            >
                <Text
                    style={{
                        color:
                            "white",
                        fontWeight:
                            "900",
                        fontSize:
                            18,
                        lineHeight:
                            20,
                    }}
                >
                    ⋯
                </Text>
            </Pressable>

            {menuOpen && (
                <View
                    style={{
                        position: "absolute",
                        top: 40,
                        right: 8,

                        width: Math.min(
                            160,
                            cardWidth - 16
                        ),

                        maxWidth:
                            cardWidth - 16,

                        borderRadius: 14,
                        overflow: "hidden",
                        backgroundColor: theme.colors.surface,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        shadowColor: "#000",
                        shadowOpacity: 0.22,
                        shadowRadius: 10,
                        shadowOffset: {
                            width: 0,
                            height: 4,
                        },
                        elevation: 8,
                        zIndex: 30,
                    }}
                >
                    <MenuButton
                        label="Copy decklist"
                        onPress={() =>
                            runAction(
                                onCopyDecklist
                            )
                        }
                    />

                    <MenuButton
                        label="Share decklist"
                        onPress={() =>
                            runAction(
                                onShareDecklist
                            )
                        }
                    />

                    {canEdit && (
                        <>
                            <MenuDivider />

                            <MenuButton
                                label="Rename"
                                onPress={() =>
                                    runAction(
                                        onRename
                                    )
                                }
                            />

                            {hasCustomFaceImage ? (
                                <>
                                    <MenuButton
                                        label="Change face"
                                        onPress={() =>
                                            runAction(
                                                onChangeCustomFaceImage
                                            )
                                        }
                                    />

                                    <MenuButton
                                        label="Remove face"
                                        onPress={() =>
                                            runAction(
                                                onRemoveCustomFaceImage
                                            )
                                        }
                                    />
                                </>
                            ) : (
                                <MenuButton
                                    label="Add face"
                                    onPress={() =>
                                        runAction(
                                            onAddCustomFaceImage
                                        )
                                    }
                                />
                            )}

                            <MenuDivider />

                            <MenuButton
                                label="Delete"
                                destructive
                                onPress={
                                    confirmDelete
                                }
                            />
                        </>
                    )}
                </View>
            )}
        </View>
    );
}

function MenuButton({
    label,
    onPress,
    destructive = false,
}: {
    label: string;
    onPress?: () => void;
    destructive?: boolean;
}) {
    const { theme } =
        useTheme();

    return (
        <Pressable
            onPress={
                onPress
            }
            style={{
                paddingVertical:
                    11,
                paddingHorizontal:
                    13,
                backgroundColor:
                    theme.colors.surface,
            }}
        >
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                    color:
                        destructive
                            ? "#EF4444"
                            : theme.colors.text,
                    fontWeight: "800",
                    fontSize: 12,
                }}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function MenuDivider() {
    const { theme } =
        useTheme();

    return (
        <View
            style={{
                height: 1,
                backgroundColor:
                    theme.colors.border,
            }}
        />
    );
}