import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Alert,
    Text,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import {
    useFocusEffect,
    useLocalSearchParams,
    useNavigation,
} from "expo-router";

import {
    useTheme,
} from "@/theme/ThemeContext";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    fetchUserProfile,
    updateUserProfile,
} from "@/api/users";

import {
    UserProfile,
    defaultProfile,
    sameProfile,
} from "@/types/profile";

import {
    loadProfile,
    saveProfile,
    saveUserAvatar,
} from "@/utils/profileStorage";

import ProfileActionsBar from "@/components/profile/ProfileActionsBar";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function PlayerProfileScreen() {
    const { id } =
        useLocalSearchParams<{
            id: string;
        }>();

    const {
        user,
        setUserFromServer,
    } = useAuth();

    const { theme } =
        useTheme();

    const navigation =
        useNavigation();

    const isOwnProfile =
        id === user?.id;

    const [
        savedProfile,
        setSavedProfile,
    ] = useState<UserProfile>(
        defaultProfile
    );

    const [
        draftProfile,
        setDraftProfile,
    ] = useState<UserProfile>(
        defaultProfile
    );

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const savedProfileRef =
        useRef(savedProfile);

    const discardRef =
        useRef(false);

    useEffect(() => {
        savedProfileRef.current =
            savedProfile;
    }, [savedProfile]);

    const hasUnsavedChanges =
        useMemo(
            () =>
                !sameProfile(
                    draftProfile,
                    savedProfile
                ),
            [
                draftProfile,
                savedProfile,
            ]
        );

    const loadPlayer =
        useCallback(
            async () => {
                if (!id) {
                    return;
                }

                try {
                    setIsLoading(
                        true
                    );

                    const serverUser =
                        await fetchUserProfile(
                            id
                        );

                    const localProfile =
                        isOwnProfile
                            ? await loadProfile(id)
                            : defaultProfile;

                    const [
                        collectionResponse,
                        wishlistResponse,
                    ] =
                        await Promise.all([
                            fetch(
                                `http://localhost:4000/users/${encodeURIComponent(
                                    id
                                )}/cards?listType=collection`
                            ),
                            fetch(
                                `http://localhost:4000/users/${encodeURIComponent(
                                    id
                                )}/cards?listType=wishlist`
                            ),
                        ]);

                    const collectionData =
                        await collectionResponse.json();

                    const wishlistData =
                        await wishlistResponse.json();

                    const collection =
                        Array.isArray(collectionData.cards)
                            ? collectionData.cards
                            : [];

                    const wishlist =
                        Array.isArray(wishlistData.cards)
                            ? wishlistData.cards
                            : [];

                    const decksResponse =
                        await fetch(
                            `http://localhost:4000/users/${encodeURIComponent(
                                id
                            )}/decks`
                        );

                    const decksData =
                        await decksResponse.json();

                    const allDecks =
                        Array.isArray(decksData.decks)
                            ? decksData.decks
                            : [];

                    const visibleDecks =
                        isOwnProfile
                            ? allDecks
                            : allDecks.filter(
                                (deck: any) =>
                                    deck.visibility === "public"
                            );

                    const decks =
                        visibleDecks.map(
                            (deck: any) => ({
                                ...deck,
                                cards: [],
                            })
                        );

                    const mergedProfile: UserProfile = {
                        ...localProfile,

                        userId:
                            serverUser.id,

                        displayName:
                            serverUser.displayName,

                        username:
                            serverUser.username,

                        avatar:
                            serverUser.avatar ||
                            localProfile.avatar,

                        location:
                            serverUser.location ||
                            localProfile.location,

                        bio:
                            serverUser.bio ||
                            localProfile.bio,
                        collection,
                        wishlist,
                        decks,
                    };

                    setSavedProfile(
                        mergedProfile
                    );

                    setDraftProfile(
                        mergedProfile
                    );
                } catch {
                    setSavedProfile(
                        defaultProfile
                    );

                    setDraftProfile(
                        defaultProfile
                    );
                } finally {
                    setIsLoading(
                        false
                    );
                }
            },
            [
                id,
                isOwnProfile,
            ]
        );

    useFocusEffect(
        useCallback(() => {
            loadPlayer();
        }, [
            loadPlayer,
        ])
    );

    useFocusEffect(
        useCallback(() => {
            const unsubscribe =
                navigation.addListener(
                    "beforeRemove",
                    (
                        event
                    ) => {
                        if (
                            !hasUnsavedChanges ||
                            discardRef.current ||
                            !isOwnProfile
                        ) {
                            return;
                        }

                        event.preventDefault();

                        Alert.alert(
                            "Discard changes?",
                            "You have unsaved profile changes.",
                            [
                                {
                                    text: "Stay",
                                    style: "cancel",
                                },
                                {
                                    text: "Leave",
                                    style: "destructive",
                                    onPress: () => {
                                        discardRef.current =
                                            true;

                                        setDraftProfile(
                                            savedProfileRef.current
                                        );

                                        navigation.dispatch(
                                            event.data.action
                                        );
                                    },
                                },
                            ]
                        );
                    }
                );

            return unsubscribe;
        }, [
            navigation,
            hasUnsavedChanges,
            isOwnProfile,
        ])
    );

    async function pickAvatar() {
        if (!isOwnProfile) {
            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync(
                {
                    mediaTypes:
                        ImagePicker.MediaTypeOptions.Images,

                    allowsEditing: true,

                    aspect: [
                        1,
                        1,
                    ],

                    quality: 0.8,
                }
            );

        if (
            result.canceled
        ) {
            return;
        }

        setDraftProfile({
            ...draftProfile,

            avatar:
                result.assets[0].uri,
        });
    }

    async function saveChanges() {
        if (
            !isOwnProfile
        ) {
            return;
        }

        let profileToSave: UserProfile = {
            ...draftProfile,

            userId:
                user?.id ??
                draftProfile.userId,
        };

        const avatarChanged =
            draftProfile.avatar !==
            savedProfile.avatar;

        if (
            avatarChanged
        ) {
            const savedAvatar =
                await saveUserAvatar(
                    profileToSave.userId,
                    profileToSave.avatar
                );

            profileToSave = {
                ...profileToSave,

                avatar:
                    savedAvatar,
            };
        }

        try {
            const savedServerUser =
                await updateUserProfile(
                    profileToSave.userId,
                    {
                        displayName:
                            profileToSave.displayName,

                        username:
                            profileToSave.username,

                        avatar:
                            profileToSave.avatar,

                        bio:
                            profileToSave.bio,
                    }
                );

            setUserFromServer(
                savedServerUser
            );

            const finalizedProfile: UserProfile = {
                ...profileToSave,

                userId:
                    savedServerUser.id,

                displayName:
                    savedServerUser.displayName,

                username:
                    savedServerUser.username,

                avatar:
                    savedServerUser.avatar ||
                    profileToSave.avatar,

                location:
                    savedServerUser.location ||
                    profileToSave.location,

                bio:
                    savedServerUser.bio ||
                    profileToSave.bio,
            };

            await saveProfile(
                finalizedProfile
            );

            setDraftProfile(
                finalizedProfile
            );

            setSavedProfile(
                finalizedProfile
            );

            await loadPlayer();

            Alert.alert(
                "Profile saved",
                "Your profile changes were saved."
            );
        } catch (error) {
            Alert.alert(
                "Could not save profile",
                error instanceof Error
                    ? error.message
                    : "Unknown error"
            );
        }
    }

    function discardChanges() {
        setDraftProfile(
            savedProfile
        );
    }

    if (
        isLoading
    ) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
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
                    Loading profile...
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
            <ProfileLayout
                profile={
                    draftProfile
                }
                editable={
                    isOwnProfile
                }
                onChangeAvatar={
                    pickAvatar
                }
                onChangeProfile={
                    setDraftProfile
                }
            />

            {isOwnProfile && (
                <ProfileActionsBar
                    visible={
                        hasUnsavedChanges
                    }
                    onSave={
                        saveChanges
                    }
                    onDiscard={
                        discardChanges
                    }
                />
            )}
        </View>
    );
}