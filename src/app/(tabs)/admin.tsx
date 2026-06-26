import {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import * as FileSystem from "expo-file-system/legacy";

import * as ImagePicker from "expo-image-picker";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    API_BASE_URL,
} from "@/api/config";

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

type PlayCenterDraft = {
    id?: string;
    name: string;
    description: string;
    imageUrl: string;
    address: string;
    town: string;
    state: string;
    phone: string;
    website: string;
};

const emptyDraft: PlayCenterDraft = {
    name: "",
    description: "",
    imageUrl: "",
    address: "",
    town: "",
    state: "",
    phone: "",
    website: "",
};

export default function AdminScreen() {
    const {
        theme,
    } = useTheme();

    const {
        user,
        token,
    } = useAuth();

    const [
        playCenters,
        setPlayCenters,
    ] = useState<PlayCenter[]>(
        []
    );

    const [
        draft,
        setDraft,
    ] = useState<PlayCenterDraft>(
        emptyDraft
    );

    const [
        notice,
        setNotice,
    ] = useState("");

    const isAdmin =
        user?.id === "1";

    useEffect(() => {
        loadPlayCenters();
    }, []);

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

    async function loadPlayCenters() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/play-centers`
                );

            const data =
                await response.json();

            setPlayCenters(
                Array.isArray(
                    data.playCenters
                )
                    ? data.playCenters
                    : []
            );
        } catch {
            showNotice(
                "Could not load play centers"
            );
        }
    }

    function updateDraft(
        key: keyof PlayCenterDraft,
        value: string
    ) {
        setDraft({
            ...draft,
            [key]: value,
        });
    }

    function editPlayCenter(
        center: PlayCenter
    ) {
        setDraft({
            id:
                center.id,
            name:
                center.name ?? "",
            description:
                center.description ?? "",
            imageUrl:
                center.imageUrl ?? "",
            address:
                center.address ?? "",
            town:
                center.town ?? "",
            state:
                center.state ?? "",
            phone:
                center.phone ?? "",
            website:
                center.website ?? "",
        });
    }

    async function pickImage() {
        const result =
            await ImagePicker.launchImageLibraryAsync({
                mediaTypes:
                    ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.65,
                base64: true,
            });

        if (result.canceled) {
            return;
        }

        const asset =
            result.assets[0];

        if (asset.base64) {
            const mimeType =
                asset.mimeType ||
                "image/jpeg";

            updateDraft(
                "imageUrl",
                `data:${mimeType};base64,${asset.base64}`
            );

            return;
        }

        updateDraft(
            "imageUrl",
            asset.uri
        );
    }

    async function savePlayCenter() {
        if (!isAdmin) {
            return;
        }

        if (
            !draft.name.trim() ||
            !draft.description.trim()
        ) {
            Alert.alert(
                "Missing info",
                "Name and description are required."
            );

            return;
        }

        const endpoint =
            draft.id
                ? `${API_BASE_URL}/admin/play-centers/${encodeURIComponent(
                      draft.id
                  )}`
                : `${API_BASE_URL}/admin/play-centers`;

        const method =
            draft.id
                ? "PATCH"
                : "POST";

        try {
            const response =
                await fetch(
                    endpoint,
                    {
                        method,
                        headers: {
                            "Content-Type":
                                "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                        body:
                            JSON.stringify({
                                name:
                                    draft.name.trim(),
                                description:
                                    draft.description.trim(),
                                imageUrl:
                                    draft.imageUrl.trim() ||
                                    null,
                                address:
                                    draft.address.trim() ||
                                    null,
                                town:
                                    draft.town.trim() ||
                                    null,
                                state:
                                    draft.state.trim() ||
                                    null,
                                phone:
                                    draft.phone.trim() ||
                                    null,
                                website:
                                    draft.website.trim() ||
                                    null,
                            }),
                    }
                );

            if (!response.ok) {
                const data =
                    await response.json().catch(
                        () => null
                    );

                throw new Error(
                    data?.error ??
                    "Could not save play center"
                );
            }

            setDraft(
                emptyDraft
            );

            await loadPlayCenters();

            Alert.alert(
                "Success",
                draft.id
                    ? "Play center updated."
                    : "Play center created."
            );

            showNotice(
                draft.id
                    ? "Play center updated"
                    : "Play center created"
            );
        } catch (error) {
            Alert.alert(
                "Upload failed",
                error instanceof Error
                    ? error.message
                    : "Could not upload play center."
            );

            showNotice(
                "Could not upload play center"
            );
        }
    }

    async function deletePlayCenter(
        center: PlayCenter
    ) {
        if (!isAdmin) {
            return;
        }

        const confirmed =
            Platform.OS === "web"
                ? window.confirm(
                      `Delete ${center.name}?`
                  )
                : true;

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/admin/play-centers/${encodeURIComponent(
                        center.id
                    )}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            await loadPlayCenters();

            if (
                draft.id ===
                center.id
            ) {
                setDraft(
                    emptyDraft
                );
            }

            showNotice(
                "Play center deleted"
            );
        } catch {
            Alert.alert(
                "Delete failed",
                "Could not delete play center."
            );
        }
    }

    if (!isAdmin) {
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
                        color:
                            theme.colors.text,
                        fontSize: 24,
                        fontWeight: "900",
                    }}
                >
                    Admin access required.
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor:
                    theme.colors.background,
            }}
            contentContainerStyle={{
                padding: 16,
                paddingBottom: 120,
                gap: 14,
            }}
        >
            <Text
                style={{
                    color:
                        theme.colors.text,
                    fontSize: 30,
                    fontWeight: "900",
                }}
            >
                Admin Panel
            </Text>

            <Text
                style={{
                    color:
                        theme.colors.textMuted,
                }}
            >
                Manage play center listings.
            </Text>

            {!!notice && (
                <Text
                    style={{
                        color:
                            theme.colors.primary,
                        fontWeight: "900",
                    }}
                >
                    {notice}
                </Text>
            )}

            <View
                style={{
                    backgroundColor:
                        theme.colors.surface,
                    borderWidth: 1,
                    borderColor:
                        theme.colors.border,
                    borderRadius: 16,
                    padding: 14,
                    gap: 10,
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
                    {draft.id
                        ? "Edit Play Center"
                        : "New Play Center"}
                </Text>

                {!!draft.imageUrl && (
                    <Image
                        source={{
                            uri:
                                draft.imageUrl,
                        }}
                        style={{
                            width: "100%",
                            height: 180,
                            borderRadius: 14,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                        }}
                    />
                )}

                <Pressable
                    onPress={
                        pickImage
                    }
                    style={{
                        backgroundColor:
                            theme.colors.surfaceAlt,
                        borderRadius: 999,
                        padding: 10,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.text,
                            fontWeight: "900",
                        }}
                    >
                        Upload / Pick Image
                    </Text>
                </Pressable>

                <TextInput
                    value={draft.name}
                    onChangeText={(value) =>
                        updateDraft(
                            "name",
                            value
                        )
                    }
                    placeholder="Name"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    style={inputStyle(theme)}
                />

                <TextInput
                    value={
                        draft.description
                    }
                    onChangeText={(value) =>
                        updateDraft(
                            "description",
                            value
                        )
                    }
                    placeholder="Description"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    multiline
                    style={[
                        inputStyle(theme),
                        {
                            minHeight: 80,
                            textAlignVertical:
                                "top",
                        },
                    ]}
                />

                <TextInput
                    value={draft.address}
                    onChangeText={(value) =>
                        updateDraft(
                            "address",
                            value
                        )
                    }
                    placeholder="Address"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    style={inputStyle(theme)}
                />

                <View
                    style={{
                        flexDirection: "row",
                        gap: 8,
                    }}
                >
                    <TextInput
                        value={draft.town}
                        onChangeText={(value) =>
                            updateDraft(
                                "town",
                                value
                            )
                        }
                        placeholder="Town"
                        placeholderTextColor={
                            theme.colors.textMuted
                        }
                        style={[
                            inputStyle(theme),
                            {
                                flex: 1,
                            },
                        ]}
                    />

                    <TextInput
                        value={draft.state}
                        onChangeText={(value) =>
                            updateDraft(
                                "state",
                                value
                            )
                        }
                        placeholder="State"
                        placeholderTextColor={
                            theme.colors.textMuted
                        }
                        autoCapitalize="characters"
                        maxLength={2}
                        style={[
                            inputStyle(theme),
                            {
                                width: 90,
                            },
                        ]}
                    />
                </View>

                <TextInput
                    value={draft.phone}
                    onChangeText={(value) =>
                        updateDraft(
                            "phone",
                            value
                        )
                    }
                    placeholder="Phone"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    style={inputStyle(theme)}
                />

                <TextInput
                    value={draft.website}
                    onChangeText={(value) =>
                        updateDraft(
                            "website",
                            value
                        )
                    }
                    placeholder="Website"
                    placeholderTextColor={
                        theme.colors.textMuted
                    }
                    autoCapitalize="none"
                    style={inputStyle(theme)}
                />

                <View
                    style={{
                        flexDirection: "row",
                        gap: 10,
                    }}
                >
                    <Pressable
                        onPress={
                            savePlayCenter
                        }
                        style={{
                            flex: 1,
                            backgroundColor:
                                theme.colors.primary,
                            borderRadius: 999,
                            padding: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "900",
                            }}
                        >
                            Save
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            setDraft(
                                emptyDraft
                            )
                        }
                        style={{
                            flex: 1,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderRadius: 999,
                            padding: 12,
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontWeight: "900",
                            }}
                        >
                            Clear
                        </Text>
                    </Pressable>
                </View>
            </View>

            <Text
                style={{
                    color:
                        theme.colors.text,
                    fontSize: 22,
                    fontWeight: "900",
                    marginTop: 8,
                }}
            >
                Existing Listings
            </Text>

            {playCenters.map(
                (center) => (
                    <View
                        key={
                            center.id
                        }
                        style={{
                            backgroundColor:
                                theme.colors.surface,
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                            borderRadius: 16,
                            padding: 14,
                            gap: 8,
                        }}
                    >
                        {!!center.imageUrl && (
                            <Image
                                source={{
                                    uri:
                                        center.imageUrl,
                                }}
                                style={{
                                    width: "100%",
                                    height: 150,
                                    borderRadius: 12,
                                    backgroundColor:
                                        theme.colors.surfaceAlt,
                                }}
                            />
                        )}

                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontSize: 18,
                                fontWeight: "900",
                            }}
                        >
                            {center.name}
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                            }}
                        >
                            {center.description}
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                                fontSize: 12,
                            }}
                        >
                            {[
                                center.address,
                                center.town,
                                center.state,
                            ]
                                .filter(Boolean)
                                .join(", ")}
                        </Text>

                        <View
                            style={{
                                flexDirection: "row",
                                gap: 10,
                            }}
                        >
                            <Pressable
                                onPress={() =>
                                    editPlayCenter(
                                        center
                                    )
                                }
                                style={{
                                    flex: 1,
                                    backgroundColor:
                                        theme.colors.surfaceAlt,
                                    borderRadius: 999,
                                    padding: 10,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color:
                                            theme.colors.text,
                                        fontWeight: "900",
                                    }}
                                >
                                    Edit
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() =>
                                    deletePlayCenter(
                                        center
                                    )
                                }
                                style={{
                                    flex: 1,
                                    backgroundColor:
                                        "#B91C1C",
                                    borderRadius: 999,
                                    padding: 10,
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "900",
                                    }}
                                >
                                    Delete
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )
            )}
        </ScrollView>
    );
}

function inputStyle(
    theme: any
) {
    return {
        backgroundColor:
            theme.colors.surfaceAlt,
        borderWidth: 1,
        borderColor:
            theme.colors.border,
        borderRadius: 12,
        padding: 10,
        color:
            theme.colors.text,
    };
}