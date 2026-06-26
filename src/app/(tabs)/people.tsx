import {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    Pressable,
    Image,
    FlatList,
    useWindowDimensions,
    ActivityIndicator,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

const API_BASE_URL =
    "http://localhost:4000";

type PlayerSummary = {
    id: string;
    username: string;
    displayName: string;
    avatar?: string | null;
    location?: string | null;
    bio?: string | null;
};

export default function PeopleScreen() {
    const { theme } =
        useTheme();

    const { user } =
        useAuth();

    const { width } =
        useWindowDimensions();

    const [
        players,
        setPlayers,
    ] = useState<PlayerSummary[]>(
        []
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    useEffect(() => {
        async function loadPlayers() {
            try {
                setIsLoading(
                    true
                );

                setErrorMessage(
                    ""
                );

                const response =
                    await fetch(
                        `${API_BASE_URL}/auth/dev-users`
                    );

                if (!response.ok) {
                    throw new Error();
                }

                const data =
                    await response.json();

                setPlayers(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch {
                setErrorMessage(
                    "Could not load players."
                );

                setPlayers([]);
            } finally {
                setIsLoading(
                    false
                );
            }
        }

        loadPlayers();
    }, []);

    const gap = 12;

    const horizontalPadding = 40;

    const availableWidth =
        Math.max(
            280,
            width - horizontalPadding
        );

    const columns =
        width < 700
            ? 4
            : Math.max(
                5,
                Math.floor(
                    availableWidth / 130
                )
            );

    const itemSize =
        width < 700
            ? (
                availableWidth -
                gap * 3
            ) / 4
            : Math.min(
                140,
                availableWidth * 0.14
            );

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor:
                    theme.colors.background,
            }}
        >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color:
                        theme.colors.text,
                }}
            >
                Nearby Players
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                    marginBottom: 20,
                }}
            >
                Find TCG players near you.
            </Text>

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

            <FlatList
                data={
                    players
                }
                key={
                    columns
                }
                numColumns={
                    columns
                }
                columnWrapperStyle={{
                    gap,
                    justifyContent: "flex-start",
                }}
                contentContainerStyle={{
                    paddingBottom: 24,
                }}
                keyExtractor={(
                    item
                ) =>
                    item.id
                }
                renderItem={({
                    item,
                }) => {
                    const isMe =
                        item.id ===
                        user?.id;

                    return (
                        <Pressable
                            onPress={() =>
                                router.push(
                                    {
                                        pathname:
                                            "/(tabs)/player/[id]",
                                        params: {
                                            id:
                                                item.id,
                                        },
                                    } as any
                                )
                            }
                            style={{
                                width:
                                    itemSize,
                                marginBottom:
                                    16,
                            }}
                        >
                            <Image
                                source={{
                                    uri:
                                        item.avatar ||
                                        "https://placehold.co/300x300/png",
                                }}
                                style={{
                                    width:
                                        itemSize,
                                    height:
                                        itemSize,
                                    borderRadius:
                                        16,
                                    backgroundColor:
                                        theme.colors.surfaceAlt,
                                    borderWidth:
                                        isMe
                                            ? 2
                                            : 1,
                                    borderColor:
                                        isMe
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                }}
                            />

                            <Text
                                numberOfLines={
                                    1
                                }
                                style={{
                                    marginTop:
                                        8,
                                    fontSize:
                                        15,
                                    fontWeight:
                                        "700",
                                    color:
                                        theme.colors.text,
                                }}
                            >
                                {
                                    item.displayName
                                }
                                {isMe
                                    ? " (You)"
                                    : ""}
                            </Text>

                            <Text
                                numberOfLines={
                                    1
                                }
                                style={{
                                    color:
                                        theme.colors.textMuted,
                                    fontSize:
                                        13,
                                }}
                            >
                                ||
                                {" "}
                                {
                                    item.username
                                }
                            </Text>

                            {!!item.location && (
                                <Text
                                    numberOfLines={
                                        1
                                    }
                                    style={{
                                        color:
                                            theme.colors.textMuted,
                                        fontSize:
                                            12,
                                        marginTop:
                                            2,
                                    }}
                                >
                                    {
                                        item.location
                                    }
                                </Text>
                            )}
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}