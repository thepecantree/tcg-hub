import { useState } from "react";

import {
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import { useTheme } from "@/theme/ThemeContext";

type ProfileHeaderCardProps = {
    userId: string;

    displayName: string;
    username: string;
    location: string;
    bio: string;
    avatar: string;

    editable?: boolean;

    onChangeAvatar?: () => void;

    onChange?: (
        update: {
            displayName?: string;
            username?: string;
            bio?: string;
        }
    ) => void;
};

export default function ProfileHeaderCard({
    userId,
    displayName,
    username,
    location,
    bio,
    avatar,
    editable = false,
    onChangeAvatar,
    onChange,
}: ProfileHeaderCardProps) {
    const { theme } =
        useTheme();

    const [
        avatarHovered,
        setAvatarHovered,
    ] = useState(false);

    const TOP_BLOCK_HEIGHT =
        168;

    const BUTTON_HEIGHT =
        30;

    const isDark =
        theme.colors.background.toLowerCase() !==
        "#ffffff";

    const messageColor =
        isDark
            ? "#1D4ED8"
            : "#BFDBFE";

    const tradeColor =
        isDark
            ? "#047857"
            : "#BBF7D0";

    const actionTextColor =
        isDark
            ? "white"
            : "#111827";

    return (
        <View
            style={{
                width: "100%",
                backgroundColor:
                    theme.colors.surface,
                borderRadius: 14,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                padding: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: 16,
                    alignItems:
                        "stretch",
                    width: "100%",
                    height:
                        TOP_BLOCK_HEIGHT,
                }}
            >
                <Pressable
                    disabled={!editable}
                    onPress={
                        onChangeAvatar
                    }
                    onHoverIn={() =>
                        setAvatarHovered(
                            true
                        )
                    }
                    onHoverOut={() =>
                        setAvatarHovered(
                            false
                        )
                    }
                    style={{
                        position:
                            "relative",
                        width:
                            TOP_BLOCK_HEIGHT,
                        height:
                            TOP_BLOCK_HEIGHT,
                        flexShrink: 0,
                    }}
                >
                    <Image
                        source={{
                            uri: avatar,
                        }}
                        style={{
                            width:
                                TOP_BLOCK_HEIGHT,
                            height:
                                TOP_BLOCK_HEIGHT,
                            borderRadius:
                                18,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                        }}
                    />

                    {editable &&
                        avatarHovered && (
                            <View
                                style={{
                                    position:
                                        "absolute",
                                    inset: 0,
                                    borderRadius:
                                        18,
                                    backgroundColor:
                                        "rgba(0,0,0,.35)",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            "white",
                                        fontWeight:
                                            "700",
                                    }}
                                >
                                    Change
                                </Text>
                            </View>
                        )}
                </Pressable>

                <View
                    style={{
                        flex: 1,
                        minWidth: 0,
                        height:
                            TOP_BLOCK_HEIGHT,
                        justifyContent:
                            "space-between",
                    }}
                >
                    <View>
                        <View
                            style={{
                                alignSelf: "flex-start",
                            }}
                        >
                            <Text>
                                <Text
                                    style={{
                                        color: theme.colors.text,
                                        fontSize: 23,
                                        fontWeight: "800",
                                    }}
                                >
                                    {displayName}
                                </Text>

                                <Text
                                    style={{
                                        color: theme.colors.textMuted,
                                        fontSize: 11.5,
                                        fontWeight: "700",
                                    }}
                                >
                                    {" || "}
                                    {username}
                                </Text>
                            </Text>
                        </View>

                        <Text
                            numberOfLines={
                                1
                            }
                            style={{
                                color:
                                    theme.colors.textMuted,
                                fontSize:
                                    15,
                                fontWeight:
                                    "600",
                                marginTop:
                                    4,
                            }}
                        >
                            {location ||
                                "Location unavailable"}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection:
                                "row",
                            gap: 8,
                            height:
                                BUTTON_HEIGHT,
                        }}
                    >
                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/(tabs)/message/[userId]",
                                    params: {
                                        userId,
                                    },
                                })
                            }
                            style={{
                                flex: 1,
                                height:
                                    BUTTON_HEIGHT,
                                borderRadius:
                                    10,
                                backgroundColor:
                                    messageColor,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        actionTextColor,
                                    fontWeight:
                                        "800",
                                    fontSize:
                                        16,
                                }}
                            >
                                Message
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                router.push({
                                    pathname:
                                        "/(tabs)/trade/[userId]",
                                    params: {
                                        userId,
                                    },
                                })
                            }
                            style={{
                                flex: 1,
                                height:
                                    BUTTON_HEIGHT,
                                borderRadius:
                                    10,
                                backgroundColor:
                                    tradeColor,
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        actionTextColor,
                                    fontWeight:
                                        "800",
                                    fontSize:
                                        16,
                                }}
                            >
                                Trade
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View
                style={{
                    marginTop: 12,
                }}
            >
                <TextInput
                    value={bio}
                    onChangeText={(
                        text
                    ) =>
                        onChange?.({
                            bio: text,
                        })
                    }
                    editable={editable}
                    multiline
                    placeholder="Bio"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    style={{
                        backgroundColor:
                            theme.colors.surfaceAlt,
                        color:
                            theme.colors.text,
                        borderRadius:
                            10,
                        paddingHorizontal:
                            12,
                        paddingVertical:
                            12,
                        minHeight:
                            110,
                        textAlignVertical:
                            "top",
                    }}
                />
            </View>
        </View>
    );
}