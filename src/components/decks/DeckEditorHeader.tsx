import {
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useState,
} from "react";

import { useTheme } from "@/theme/ThemeContext";

import type {
    DeckFormat,
    DeckPowerLevel,
    DeckVisibility,
} from "@/components/DeckListEditor";

type DeckEditorHeaderProps = {
    name: string;
    format: DeckFormat;
    powerLevel: DeckPowerLevel;
    visibility: DeckVisibility;
    showImportPanel: boolean;
    editable?: boolean;
    onChangeName: (name: string) => void;
    onChangeFormat: (format: DeckFormat) => void;
    onChangePowerLevel: (powerLevel: DeckPowerLevel) => void;
    onChangeVisibility: (visibility: DeckVisibility) => void;
    onToggleImportPanel: () => void;
};

const FORMATS: DeckFormat[] = [
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

const POWER_LEVELS: DeckPowerLevel[] = [
    5,
    4,
    3,
    2,
    1,
];

const VISIBILITIES: {
    value: DeckVisibility;
    label: string;
    description: string;
}[] = [
        {
            value: "private",
            label: "Private",
            description: "Only you can view this deck.",
        },
        {
            value: "unlisted",
            label: "Unlisted",
            description: "Anyone with the link can view it.",
        },
        {
            value: "public",
            label: "Public",
            description: "Visible on your profile.",
        },
    ];

function getPowerColor(powerLevel: DeckPowerLevel) {
    switch (powerLevel) {
        case 5:
            return "#7F1D1D";
        case 4:
            return "#EA580C";
        case 3:
            return "#F59E0B";
        case 2:
            return "#A3E635";
        case 1:
        default:
            return "#22C55E";
    }
}

function getVisibilityLabel(
    visibility: DeckVisibility
) {
    return (
        VISIBILITIES.find(
            (option) =>
                option.value === visibility
        )?.label ?? "Private"
    );
}

export default function DeckEditorHeader({
    name,
    format,
    powerLevel,
    visibility,
    showImportPanel,
    editable = true,
    onChangeName,
    onChangeFormat,
    onChangePowerLevel,
    onChangeVisibility,
    onToggleImportPanel,
}: DeckEditorHeaderProps) {
    const { theme } =
        useTheme();

    const [
        showFormatMenu,
        setShowFormatMenu,
    ] = useState(false);

    const [
        showPowerMenu,
        setShowPowerMenu,
    ] = useState(false);

    const [
        showVisibilityMenu,
        setShowVisibilityMenu,
    ] = useState(false);

    return (
        <View
            style={{
                marginBottom: 14,
            }}
        >
            <TextInput
                value={name}
                editable={editable}
                onChangeText={onChangeName}
                placeholder="Deck name"
                placeholderTextColor={
                    theme.colors.textMuted
                }
                style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: theme.colors.text,
                    borderBottomWidth: 1,
                    borderBottomColor:
                        theme.colors.border,
                    paddingBottom: 8,
                    marginBottom: 14,
                    opacity: editable ? 1 : 0.9,
                }}
            />

            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom:
                        editable ? 14 : 0,
                }}
            >
                <View
                    style={{
                        width: 150,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "800",
                            marginBottom: 8,
                        }}
                    >
                        Format
                    </Text>

                    <Pressable
                        disabled={!editable}
                        onPress={() =>
                            setShowFormatMenu(
                                !showFormatMenu
                            )
                        }
                        style={{
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderRadius: 12,
                            paddingVertical: 11,
                            paddingHorizontal: 14,
                            opacity: editable ? 1 : 0.85,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: theme.colors.text,
                                fontWeight: "700",
                            }}
                        >
                            {format}
                        </Text>
                    </Pressable>

                    {editable && showFormatMenu && (
                        <View
                            style={{
                                marginTop: 8,
                                borderRadius: 12,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor:
                                    theme.colors.border,
                                backgroundColor:
                                    theme.colors.surface,
                            }}
                        >
                            {FORMATS.map((option) => (
                                <Pressable
                                    key={option}
                                    onPress={() => {
                                        onChangeFormat(option);
                                        setShowFormatMenu(false);
                                    }}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 14,
                                        backgroundColor:
                                            option === format
                                                ? theme.colors.primary
                                                : "transparent",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                option === format
                                                    ? "white"
                                                    : theme.colors.text,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                <View
                    style={{
                        width: 62,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "800",
                            marginBottom: 8,
                        }}
                    >
                        Power
                    </Text>

                    <Pressable
                        disabled={!editable}
                        onPress={() =>
                            setShowPowerMenu(
                                !showPowerMenu
                            )
                        }
                        style={{
                            borderRadius: 12,
                            paddingVertical: 11,
                            paddingHorizontal: 14,
                            backgroundColor:
                                getPowerColor(
                                    powerLevel
                                ),
                            opacity: editable ? 1 : 0.85,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "900",
                                textAlign: "center",
                            }}
                        >
                            {powerLevel}
                        </Text>
                    </Pressable>

                    {editable && showPowerMenu && (
                        <View
                            style={{
                                marginTop: 8,
                                borderRadius: 12,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor:
                                    theme.colors.border,
                            }}
                        >
                            {POWER_LEVELS.map((level) => (
                                <Pressable
                                    key={level}
                                    onPress={() => {
                                        onChangePowerLevel(level);
                                        setShowPowerMenu(false);
                                    }}
                                    style={{
                                        paddingVertical: 12,
                                        alignItems: "center",
                                        backgroundColor:
                                            getPowerColor(level),
                                        opacity:
                                            level === powerLevel
                                                ? 1
                                                : 0.75,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "white",
                                            fontWeight: "900",
                                        }}
                                    >
                                        {level}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                <View
                    style={{
                        width: 150,
                    }}
                >
                    <Text
                        style={{
                            color: theme.colors.text,
                            fontWeight: "800",
                            marginBottom: 8,
                        }}
                    >
                        Visibility
                    </Text>

                    <Pressable
                        disabled={!editable}
                        onPress={() =>
                            setShowVisibilityMenu(
                                !showVisibilityMenu
                            )
                        }
                        style={{
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderRadius: 12,
                            paddingVertical: 11,
                            paddingHorizontal: 14,
                            opacity: editable ? 1 : 0.85,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            style={{
                                color: theme.colors.text,
                                fontWeight: "700",
                            }}
                        >
                            {getVisibilityLabel(
                                visibility
                            )}
                        </Text>
                    </Pressable>

                    {editable && showVisibilityMenu && (
                        <View
                            style={{
                                marginTop: 8,
                                borderRadius: 12,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor:
                                    theme.colors.border,
                                backgroundColor:
                                    theme.colors.surface,
                            }}
                        >
                            {VISIBILITIES.map((option) => (
                                <Pressable
                                    key={option.value}
                                    onPress={() => {
                                        onChangeVisibility(
                                            option.value
                                        );
                                        setShowVisibilityMenu(false);
                                    }}
                                    style={{
                                        paddingVertical: 10,
                                        paddingHorizontal: 14,
                                        backgroundColor:
                                            option.value === visibility
                                                ? theme.colors.primary
                                                : "transparent",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                option.value === visibility
                                                    ? "white"
                                                    : theme.colors.text,
                                            fontWeight: "800",
                                            marginBottom: 2,
                                        }}
                                    >
                                        {option.label}
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                option.value === visibility
                                                    ? "white"
                                                    : theme.colors.textMuted,
                                            fontSize: 11,
                                            lineHeight: 15,
                                        }}
                                    >
                                        {option.description}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {editable && (
                <Pressable
                    onPress={onToggleImportPanel}
                    style={{
                        alignSelf: "flex-start",
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 999,
                        backgroundColor:
                            theme.colors.primary,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "700",
                        }}
                    >
                        {showImportPanel
                            ? "Close Import"
                            : "Import"}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}