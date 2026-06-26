import {
    ScrollView,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import type {
    UserProfile,
} from "@/types/profile";

import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import ProfileDecksPanel from "@/components/profile/ProfileDecksPanel";
import ProfileCollectionsPanel from "@/components/profile/ProfileCollectionsPanel";

import CollapsiblePanel from "@/components/layout/CollapsiblePanel";

type Props = {
    profile: UserProfile;

    editable?: boolean;

    onChangeAvatar?: () => void;

    onChangeProfile?: (
        profile: UserProfile
    ) => void;
};

export default function ProfileLayout({
    profile,
    editable = false,
    onChangeAvatar,
    onChangeProfile,
}: Props) {
    const { theme } =
        useTheme();

    const { width } =
        useWindowDimensions();

    const isPhone =
        width < 700;

    function updateProfile(
        update: Partial<UserProfile>
    ) {
        if (!onChangeProfile) {
            return;
        }

        onChangeProfile({
            ...profile,
            ...update,
        });
    }

    return (
        <ScrollView
            contentContainerStyle={{
                padding: 20,
                paddingBottom: 120,
                gap: 2,
            }}
        >
            <View
                style={{
                    flexDirection:
                        isPhone
                            ? "column"
                            : "row",

                    gap: 2,

                    alignItems:
                        "flex-start",

                    width: "100%",
                }}
            >
                <View
                    style={{
                        flex:
                            isPhone
                                ? undefined
                                : 2,

                        width:
                            isPhone
                                ? "100%"
                                : undefined,

                        minWidth: 0,

                        padding: 2,
                    }}
                >
                    <ProfileHeaderCard
                        userId={
                            profile.userId
                        }
                        editable={
                            editable
                        }
                        displayName={
                            profile.displayName
                        }
                        username={
                            profile.username
                        }
                        location={
                            profile.location
                        }
                        bio={
                            profile.bio
                        }
                        avatar={
                            profile.avatar
                        }
                        onChangeAvatar={
                            editable
                                ? onChangeAvatar
                                : undefined
                        }
                        onChange={(
                            update
                        ) =>
                            updateProfile(
                                update
                            )
                        }
                    />
                </View>

                <View
                    style={{
                        flex:
                            isPhone
                                ? undefined
                                : 1,

                        width:
                            isPhone
                                ? "100%"
                                : undefined,

                        gap: 2,
                    }}
                >
                </View>
            </View>

            <CollapsiblePanel title="Decks">
                <ProfileDecksPanel
                    userId={profile.userId}
                    editable={editable}
                    decks={profile.decks}
                    onChange={
                        editable
                            ? (
                                decks
                            ) =>
                                updateProfile({
                                    decks,
                                })
                            : undefined
                    }
                />
            </CollapsiblePanel>

            <View
                style={{
                    flexDirection:
                        isPhone
                            ? "column"
                            : "row",

                    gap: 2,

                    width: "100%",
                }}
            >
                <View
                    style={{
                        flex:
                            isPhone
                                ? undefined
                                : 1,

                        width:
                            isPhone
                                ? "100%"
                                : undefined,
                    }}
                >
                    <CollapsiblePanel title="Trade Binder">
                        <ProfileCollectionsPanel
                            userId={
                                profile.userId
                            }
                            collection={
                                profile.collection
                            }
                            editable={
                                editable
                            }
                        />
                    </CollapsiblePanel>
                </View>

                <View
                    style={{
                        flex:
                            isPhone
                                ? undefined
                                : 1,

                        width:
                            isPhone
                                ? "100%"
                                : undefined,
                    }}
                >
                    <CollapsiblePanel title="Wishlist">
                        <ProfileCollectionsPanel
                            userId={
                                profile.userId
                            }
                            wishlist={
                                profile.wishlist
                            }
                            editable={
                                editable
                            }
                        />
                    </CollapsiblePanel>
                    <CollapsiblePanel
                        title="Badges"
                        defaultOpen={!isPhone}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                            }}
                        >
                            No badges yet.
                        </Text>
                    </CollapsiblePanel>
                </View>
            </View>
        </ScrollView>
    );
}