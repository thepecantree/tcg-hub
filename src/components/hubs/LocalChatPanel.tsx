import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import { useTheme } from "@/theme/ThemeContext";

import type {
    LocalChatMessage,
} from "@/types/chat";

type Props = {
    townName: string;
    townKey: string;

    currentUser: {
        userId: string;
        displayName: string;
        username: string;
        avatar: string;
    };
};

const API_BASE_URL =
    "http://localhost:4000";

export default function LocalChatPanel({
    townName,
    townKey,
    currentUser,
}: Props) {
    const { theme } =
        useTheme();

    const [
        messages,
        setMessages,
    ] = useState<LocalChatMessage[]>(
        []
    );

    const [
        chatText,
        setChatText,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    async function loadMessages() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/local-chat/messages?townKey=${encodeURIComponent(
                        townKey
                    )}`
                );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            setMessages(
                Array.isArray(data)
                    ? data
                    : []
            );

            setErrorMessage("");
        } catch {
            setErrorMessage(
                "Local chat server unavailable."
            );
        }
    }

    async function sendMessage() {
        const body =
            chatText.trim();

        if (!body) {
            return;
        }

        setChatText("");

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/local-chat/messages`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            townKey,
                            senderUserId:
                                currentUser.userId,
                            senderDisplayName:
                                currentUser.displayName,
                            senderUsername:
                                currentUser.username,
                            senderAvatar:
                                currentUser.avatar,
                            body,
                        }),
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            await loadMessages();
        } catch {
            setErrorMessage(
                "Could not send message."
            );

            setChatText(body);
        }
    }

    useEffect(() => {
        loadMessages();

        const interval =
            setInterval(
                loadMessages,
                2500
            );

        return () =>
            clearInterval(
                interval
            );
    }, [
        townKey,
    ]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.surface,
                borderRadius: 16,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    padding: 14,
                    borderBottomWidth: 1,
                    borderBottomColor:
                        theme.colors.border,
                }}
            >
                <Text
                    style={{
                        color:
                            theme.colors.text,
                        fontSize: 20,
                        fontWeight: "900",
                    }}
                >
                    {townName} Local Chat
                </Text>

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        marginTop: 4,
                    }}
                >
                    24/7 chat for players in your town.
                </Text>

                {!!errorMessage && (
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                            marginTop: 8,
                        }}
                    >
                        {errorMessage}
                    </Text>
                )}
            </View>

            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    padding: 14,
                    gap: 10,
                }}
            >
                {messages.map(
                    (
                        message
                    ) => {
                        const mine =
                            message.senderUserId ===
                            currentUser.userId;

                        return (
                            <View
                                key={
                                    message.id
                                }
                                style={{
                                    alignSelf:
                                        mine
                                            ? "flex-end"
                                            : "flex-start",
                                    maxWidth:
                                        "86%",
                                    backgroundColor:
                                        mine
                                            ? theme.colors.primary
                                            : theme.colors.surfaceAlt,
                                    borderRadius: 14,
                                    padding: 10,
                                }}
                            >
                                {!mine && (
                                    <View
                                        style={{
                                            flexDirection:
                                                "row",
                                            alignItems:
                                                "center",
                                            gap: 8,
                                            marginBottom: 5,
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    message.senderAvatar,
                                            }}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                borderRadius: 12,
                                            }}
                                        />

                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.primary,
                                                fontWeight:
                                                    "900",
                                            }}
                                        >
                                            {
                                                message.senderUsername
                                            }
                                        </Text>
                                    </View>
                                )}

                                <Text
                                    style={{
                                        color:
                                            mine
                                                ? "white"
                                                : theme.colors.text,
                                    }}
                                >
                                    {message.body}
                                </Text>
                            </View>
                        );
                    }
                )}
            </ScrollView>

            <View
                style={{
                    padding: 12,
                    borderTopWidth: 1,
                    borderTopColor:
                        theme.colors.border,
                    flexDirection: "row",
                    gap: 8,
                }}
            >
                <TextInput
                    value={chatText}
                    onChangeText={
                        setChatText
                    }
                    onSubmitEditing={
                        sendMessage
                    }
                    placeholder="Message your local chat..."
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    style={{
                        flex: 1,
                        backgroundColor:
                            theme.colors.surfaceAlt,
                        color:
                            theme.colors.text,
                        borderRadius: 999,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                    }}
                />

                <Pressable
                    onPress={
                        sendMessage
                    }
                    style={{
                        paddingHorizontal: 16,
                        borderRadius: 999,
                        backgroundColor:
                            theme.colors.primary,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "800",
                        }}
                    >
                        Send
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}