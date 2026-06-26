import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import {
    useEffect,
    useState,
} from "react";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    loadProfile,
} from "@/utils/profileStorage";

import {
    defaultProfile,
    UserProfile,
} from "@/types/profile";

import LocalChatPanel from "@/components/hubs/LocalChatPanel";

const API_BASE_URL =
    "http://localhost:4000";

type HubTab =
    | "playCenters"
    | "localChat";

type PlayCenter = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string | null;
    address?: string | null;
    town?: string | null;
    state?: string | null;
    phone?: string | null;
    website?: string | null;
};

function getTownName(
    location: string
) {
    return (
        location
            .split(",")[0]
            ?.trim() ||
        "Local"
    );
}

function getTownKey(
    location: string
) {
    return getTownName(location)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export default function HubsScreen() {
    const { theme } =
        useTheme();

    const [
        activeTab,
        setActiveTab,
    ] = useState<HubTab>(
        "playCenters"
    );

    const [
        profile,
        setProfile,
    ] = useState<UserProfile>(
        defaultProfile
    );

    const [
        playCenters,
        setPlayCenters,
    ] = useState<PlayCenter[]>(
        []
    );

    const [
        playCentersError,
        setPlayCentersError,
    ] = useState("");

    async function loadPlayCenters() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/play-centers`
                );

            if (!response.ok) {
                throw new Error();
            }

            const data =
                await response.json();

            setPlayCenters(
                Array.isArray(data.playCenters)
                    ? data.playCenters
                    : []
            );

            setPlayCentersError("");
        } catch {
            setPlayCenters([]);

            setPlayCentersError(
                "Could not load play centers."
            );
        }
    }

    useEffect(() => {
        async function initialize() {
            const loadedProfile =
                await loadProfile();

            setProfile(
                loadedProfile
            );

            await loadPlayCenters();
        }

        initialize();
    }, []);

    const townName =
        getTownName(
            profile.location
        );

    const townKey =
        getTownKey(
            profile.location
        );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.background,
                padding: 10,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                <Pressable
                    onPress={() =>
                        setActiveTab(
                            "playCenters"
                        )
                    }
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 999,
                        alignItems: "center",
                        backgroundColor:
                            activeTab ===
                                "playCenters"
                                ? theme.colors.primary
                                : theme.colors.surfaceAlt,
                    }}
                >
                    <Text
                        style={{
                            color:
                                activeTab ===
                                    "playCenters"
                                    ? "white"
                                    : theme.colors.text,
                            fontWeight: "800",
                        }}
                    >
                        Play Centers
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() =>
                        setActiveTab(
                            "localChat"
                        )
                    }
                    style={{
                        flex: 1,
                        padding: 12,
                        borderRadius: 999,
                        alignItems: "center",
                        backgroundColor:
                            activeTab ===
                                "localChat"
                                ? theme.colors.primary
                                : theme.colors.surfaceAlt,
                    }}
                >
                    <Text
                        style={{
                            color:
                                activeTab ===
                                    "localChat"
                                    ? "white"
                                    : theme.colors.text,
                            fontWeight: "800",
                        }}
                    >
                        Local Chat
                    </Text>
                </Pressable>
            </View>

            {activeTab ===
                "playCenters" ? (
                <ScrollView
                    contentContainerStyle={{
                        gap: 14,
                        paddingBottom: 40,
                    }}
                >
                    {!!playCentersError && (
                        <Text
                            style={{
                                color:
                                    theme.colors.primary,
                                fontWeight: "800",
                            }}
                        >
                            {
                                playCentersError
                            }
                        </Text>
                    )}

                    {!playCentersError &&
                        playCenters.length ===
                        0 && (
                            <Text
                                style={{
                                    color:
                                        theme.colors.textMuted,
                                }}
                            >
                                No play centers listed yet.
                            </Text>
                        )}

                    {playCenters.map(
                        (
                            center
                        ) => (
                            <View
                                key={
                                    center.id
                                }
                                style={{
                                    backgroundColor:
                                        theme.colors.surface,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor:
                                        theme.colors.border,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    source={{
                                        uri:
                                            center.imageUrl ||
                                            "https://placehold.co/600x400/png",
                                    }}
                                    style={{
                                        width: "100%",
                                        height: 180,
                                        backgroundColor:
                                            theme.colors.surfaceAlt,
                                    }}
                                />

                                <View
                                    style={{
                                        padding: 14,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                theme.colors.text,
                                            fontSize: 20,
                                            fontWeight: "900",
                                            marginBottom: 6,
                                        }}
                                    >
                                        {
                                            center.name
                                        }
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.text,
                                            marginBottom: 10,
                                            lineHeight: 20,
                                        }}
                                    >
                                        {
                                            center.description
                                        }
                                    </Text>

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.textMuted,
                                            fontWeight: "700",
                                        }}
                                    >
                                        {[
                                            center.address,
                                            center.town,
                                            center.state,
                                        ]
                                            .filter(
                                                Boolean
                                            )
                                            .join(
                                                ", "
                                            )}
                                    </Text>

                                    {!!center.phone && (
                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.textMuted,
                                                marginTop: 4,
                                            }}
                                        >
                                            {
                                                center.phone
                                            }
                                        </Text>
                                    )}

                                    {!!center.website && (
                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.primary,
                                                marginTop: 4,
                                                fontWeight:
                                                    "800",
                                            }}
                                        >
                                            {
                                                center.website
                                            }
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )
                    )}
                </ScrollView>
            ) : (
                <LocalChatPanel
                    townName={
                        townName
                    }
                    townKey={
                        townKey
                    }
                    currentUser={{
                        userId:
                            profile.userId,
                        displayName:
                            profile.displayName,
                        username:
                            profile.username,
                        avatar:
                            profile.avatar,
                    }}
                />
            )}
        </View>
    );
}