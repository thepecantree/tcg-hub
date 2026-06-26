import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";

import { useTheme } from "@/theme/ThemeContext";

import type {
    ForumPost,
} from "@/types/forum";

type Props = {
    post: ForumPost;
    isOriginalPost?: boolean;
    canDelete?: boolean;
    onReply: (post: ForumPost) => void;
    onReport: (post: ForumPost) => void;
    onDelete?: (post: ForumPost) => void;
};

function formatPostDate(
    isoDate: string
) {
    const date =
        new Date(isoDate);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleString(
        undefined,
        {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

export default function ForumPostCard({
    post,
    isOriginalPost = false,
    canDelete = false,
    onReply,
    onReport,
    onDelete,
}: Props) {
    const { theme } =
        useTheme();

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor:
                    theme.colors.surface,
                borderWidth: 1,
                borderColor:
                    theme.colors.border,
                borderRadius: 14,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    width: 132,
                    padding: 10,
                    backgroundColor:
                        theme.colors.surfaceAlt,
                    borderRightWidth: 1,
                    borderRightColor:
                        theme.colors.border,
                    alignItems: "center",
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color:
                            theme.colors.text,
                        fontWeight: "900",
                        fontSize: 13,
                    }}
                >
                    {post.authorName}
                </Text>

                {!!post.authorUsername && (
                    <Text
                        numberOfLines={1}
                        style={{
                            color:
                                theme.colors.textMuted,
                            fontSize: 10,
                            fontWeight: "700",
                            marginBottom: 8,
                        }}
                    >
                        || {post.authorUsername}
                    </Text>
                )}

                <Image
                    source={{
                        uri:
                            post.authorAvatar ||
                            "https://placehold.co/300x300/png",
                    }}
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 10,
                        backgroundColor:
                            theme.colors.surface,
                        marginBottom: 8,
                    }}
                />

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        fontSize: 10,
                        textAlign: "center",
                    }}
                >
                    Joined:{" "}
                    {post.authorJoinDate ||
                        "—"}
                </Text>

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        fontSize: 10,
                        textAlign: "center",
                        marginTop: 3,
                    }}
                >
                    Posts:{" "}
                    {post.authorPostCount ??
                        0}
                </Text>
            </View>

            <View
                style={{
                    flex: 1,
                    padding: 12,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent:
                            "space-between",
                        gap: 10,
                        marginBottom: 10,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                            fontSize: 12,
                            fontWeight: "700",
                        }}
                    >
                        {formatPostDate(
                            post.createdAt
                        )}
                    </Text>

                    {isOriginalPost && (
                        <Text
                            style={{
                                color:
                                    theme.colors.primary,
                                fontSize: 12,
                                fontWeight: "900",
                            }}
                        >
                            Original Post
                        </Text>
                    )}
                </View>

                {!!post.replyToPostId && (
                    <Text
                        style={{
                            color:
                                theme.colors.textMuted,
                            fontSize: 12,
                            fontStyle: "italic",
                            marginBottom: 8,
                        }}
                    >
                        Replying to post #
                        {post.replyToPostId.slice(-6)}
                    </Text>
                )}

                <Text
                    style={{
                        color:
                            theme.colors.text,
                        lineHeight: 20,
                        minHeight: 70,
                    }}
                >
                    {post.body}
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent:
                            "flex-end",
                        gap: 10,
                        marginTop: 14,
                    }}
                >
                    <Pressable
                        onPress={() =>
                            onReply(post)
                        }
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.primary,
                                fontWeight: "900",
                            }}
                        >
                            Reply
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() =>
                            onReport(post)
                        }
                    >
                        <Text
                            style={{
                                color:
                                    "#EF4444",
                                fontWeight: "900",
                            }}
                        >
                            Report
                        </Text>
                    </Pressable>

                    {canDelete && onDelete && (
                        <Pressable
                            onPress={() =>
                                onDelete(post)
                            }
                        >
                            <Text
                                style={{
                                    color:
                                        "#EF4444",
                                    fontWeight:
                                        "900",
                                }}
                            >
                                Delete
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}