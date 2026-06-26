import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useAuth,
} from "@/auth/AuthContext";

import {
    useEffect,
    useState,
} from "react";

import { useTheme } from "@/theme/ThemeContext";

import {
    loadProfile,
} from "@/utils/profileStorage";

import {
    defaultProfile,
    UserProfile,
} from "@/types/profile";

import ForumPostCard from "@/components/forum/ForumPostCard";
import ForumReplyBox from "@/components/forum/ForumReplyBox";

import type {
    ForumPost,
} from "@/types/forum";

const API_BASE_URL =
    "http://localhost:4000";

type ForumBoard = {
    id: string;
    title: string;
    description: string;
    threadCount: number;
};

type ForumCategory = {
    category: string;
    boards: ForumBoard[];
};

type ForumThread = {
    id: string;
    boardId: string;
    title: string;
    authorUserId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    postCount: number;
};

function normalizeForumCategories(
    data: any
): ForumCategory[] {
    if (!Array.isArray(data)) {
        return [];
    }

    if (
        data.every(
            (item) =>
                item &&
                Array.isArray(
                    item.boards
                )
        )
    ) {
        return data.map(
            (category) => ({
                category:
                    String(
                        category.category ??
                        "Forum"
                    ),

                boards:
                    category.boards.map(
                        normalizeBoard
                    ),
            })
        );
    }

    return [
        {
            category: "Forum",
            boards:
                data.map(
                    normalizeBoard
                ),
        },
    ];
}

function normalizeBoard(
    board: any
): ForumBoard {
    return {
        id: String(board.id),

        title:
            String(
                board.title ??
                "Untitled Board"
            ),

        description:
            String(
                board.description ??
                ""
            ),

        threadCount:
            Number(
                board.threadCount ??
                0
            ),
    };
}

export default function ForumScreen() {
    const { theme } =
        useTheme();

    const { user } =
        useAuth();

    const isAdmin =
        user?.id === "1";

    const [
        profile,
        setProfile,
    ] = useState<UserProfile>(
        defaultProfile
    );

    const [
        boardCategories,
        setBoardCategories,
    ] = useState<ForumCategory[]>(
        []
    );

    const [
        selectedBoard,
        setSelectedBoard,
    ] = useState<ForumBoard | null>(
        null
    );

    const [
        threads,
        setThreads,
    ] = useState<ForumThread[]>(
        []
    );

    const [
        selectedThread,
        setSelectedThread,
    ] = useState<ForumThread | null>(
        null
    );

    const [
        posts,
        setPosts,
    ] = useState<ForumPost[]>(
        []
    );

    const [
        newThreadTitle,
        setNewThreadTitle,
    ] = useState("");

    const [
        newThreadBody,
        setNewThreadBody,
    ] = useState("");

    const [
        replyBody,
        setReplyBody,
    ] = useState("");

    const [
        replyingTo,
        setReplyingTo,
    ] = useState<ForumPost | null>(
        null
    );

    const [
        showReplyBox,
        setShowReplyBox,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    useEffect(() => {
        async function initialize() {
            const loadedProfile =
                await loadProfile();

            setProfile(
                loadedProfile
            );

            await loadBoards();
        }

        initialize();
    }, []);

    async function loadBoards() {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/boards`
                );

            const data =
                await response.json();

            setBoardCategories(
                normalizeForumCategories(
                    data
                )
            );

            setErrorMessage("");
        } catch {
            setErrorMessage(
                "Could not load forum boards."
            );
        }
    }

    async function loadThreads(
        board: ForumBoard
    ) {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/threads?boardId=${encodeURIComponent(
                        board.id
                    )}`
                );

            const data =
                await response.json();

            setThreads(
                Array.isArray(data)
                    ? data
                    : []
            );

            setSelectedBoard(board);
            setSelectedThread(null);
            setPosts([]);

            setErrorMessage("");
        } catch {
            setErrorMessage(
                "Could not load threads."
            );
        }
    }

    async function loadPosts(
        thread: ForumThread
    ) {
        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/posts?threadId=${encodeURIComponent(
                        thread.id
                    )}`
                );

            const data =
                await response.json();

            setPosts(
                Array.isArray(data)
                    ? data
                    : []
            );

            setSelectedThread(thread);

            setErrorMessage("");
        } catch {
            setErrorMessage(
                "Could not load posts."
            );
        }
    }

    async function createThread() {
        if (
            !selectedBoard ||
            !newThreadTitle.trim() ||
            !newThreadBody.trim()
        ) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/threads`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                boardId:
                                    selectedBoard.id,
                                title:
                                    newThreadTitle.trim(),
                                body:
                                    newThreadBody.trim(),
                                authorUserId:
                                    profile.userId,
                                authorName:
                                    profile.displayName,
                                authorUsername:
                                    profile.username,
                                authorAvatar:
                                    profile.avatar.startsWith(
                                        "data:"
                                    )
                                        ? ""
                                        : profile.avatar,
                                authorJoinDate:
                                    "2026",
                            }),
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            setNewThreadTitle("");
            setNewThreadBody("");

            await loadThreads(
                selectedBoard
            );

            await loadBoards();
        } catch {
            setErrorMessage(
                "Could not create thread."
            );
        }
    }

    async function createReply() {
        if (
            !selectedThread ||
            !replyBody.trim()
        ) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/posts`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body:
                            JSON.stringify({
                                threadId:
                                    selectedThread.id,
                                body:
                                    replyBody.trim(),
                                authorUserId:
                                    profile.userId,
                                authorName:
                                    profile.displayName,
                                authorUsername:
                                    profile.username,
                                authorAvatar:
                                    profile.avatar.startsWith(
                                        "data:"
                                    )
                                        ? ""
                                        : profile.avatar,
                                authorJoinDate:
                                    "2026",
                                replyToPostId:
                                    replyingTo?.id ??
                                    null,
                            }),
                    }
                );

            if (!response.ok) {
                throw new Error();
            }

            setReplyBody("");
            setReplyingTo(null);
            setShowReplyBox(false);

            await loadPosts(
                selectedThread
            );

            if (selectedBoard) {
                await loadThreads(
                    selectedBoard
                );
            }

            await loadBoards();
        } catch {
            setErrorMessage(
                "Could not post reply."
            );
        }
    }

    async function deletePost(
        post: ForumPost
    ) {
        if (
            !isAdmin ||
            !user?.id
        ) {
            return;
        }

        const confirmed =
            Platform.OS === "web"
                ? window.confirm(
                    "Delete this post?"
                )
                : true;

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `${API_BASE_URL}/forum/posts/${encodeURIComponent(
                        post.id
                    )}?adminUserId=${encodeURIComponent(
                        user.id
                    )}`,
                    {
                        method: "DELETE",
                    }
                );

            if (!response.ok) {
                const text =
                    await response.text();

                console.log(
                    "Delete post failed:",
                    response.status,
                    text
                );

                throw new Error(text);
            }

            setPosts((current) =>
                current.filter(
                    (item) =>
                        item.id !== post.id
                )
            );

            if (selectedThread) {
                await loadPosts(
                    selectedThread
                );
            }

            if (selectedBoard) {
                await loadThreads(
                    selectedBoard
                );
            }

            await loadBoards();
        } catch {
            setErrorMessage(
                "Could not delete post."
            );
        }
    }

    if (selectedThread) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor:
                        theme.colors.background,
                    padding: 16,
                }}
            >
                <Pressable
                    onPress={() =>
                        setSelectedThread(null)
                    }
                    style={{
                        alignSelf:
                            "flex-start",
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                            fontWeight: "900",
                        }}
                    >
                        ← Back to Threads
                    </Text>
                </Pressable>

                <Text
                    style={{
                        color:
                            theme.colors.text,
                        fontSize: 26,
                        fontWeight: "900",
                        marginBottom: 6,
                    }}
                >
                    {selectedThread.title}
                </Text>

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                        marginBottom: 14,
                    }}
                >
                    Started by{" "}
                    {selectedThread.authorName}
                </Text>

                {!!errorMessage && (
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                            marginBottom: 10,
                        }}
                    >
                        {errorMessage}
                    </Text>
                )}

                <ScrollView
                    contentContainerStyle={{
                        gap: 12,
                        paddingBottom: 120,
                    }}
                >
                    {posts.map(
                        (post, index) => (
                            <ForumPostCard
                                key={post.id}
                                post={post}
                                isOriginalPost={
                                    index === 0
                                }
                                canDelete={isAdmin}
                                onDelete={
                                    isAdmin
                                        ? deletePost
                                        : undefined
                                }
                                onReply={() => {
                                    setReplyingTo(
                                        post
                                    );

                                    setShowReplyBox(
                                        true
                                    );
                                }}
                                onReport={async () => {
                                    await fetch(
                                        `${API_BASE_URL}/forum/report`,
                                        {
                                            method:
                                                "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body:
                                                JSON.stringify({
                                                    postId:
                                                        post.id,
                                                    threadId:
                                                        post.threadId,
                                                    reporterUserId:
                                                        profile.userId,
                                                    reporterName:
                                                        profile.displayName,
                                                    reason:
                                                        "General",
                                                }),
                                        }
                                    );
                                }}
                            />
                        )
                    )}
                </ScrollView>

                {showReplyBox && (
                    <View
                        style={{
                            position:
                                "absolute",
                            left: 16,
                            right: 16,
                            bottom: 16,
                        }}
                    >
                        <ForumReplyBox
                            value={
                                replyBody
                            }
                            replyingToLabel={
                                replyingTo?.authorName
                            }
                            onChangeText={
                                setReplyBody
                            }
                            onSubmit={
                                createReply
                            }
                            onCancel={() => {
                                setShowReplyBox(
                                    false
                                );

                                setReplyingTo(
                                    null
                                );

                                setReplyBody(
                                    ""
                                );
                            }}
                        />
                    </View>
                )}
            </View>
        );
    }

    if (selectedBoard) {
        return (
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor:
                        theme.colors.background,
                }}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 100,
                    gap: 12,
                }}
            >
                <Pressable
                    onPress={() => {
                        setSelectedBoard(null);
                        setThreads([]);
                    }}
                >
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                            fontWeight: "900",
                        }}
                    >
                        ← Back to Boards
                    </Text>
                </Pressable>

                <Text
                    style={{
                        color:
                            theme.colors.text,
                        fontSize: 28,
                        fontWeight: "900",
                    }}
                >
                    {selectedBoard.title}
                </Text>

                <Text
                    style={{
                        color:
                            theme.colors.textMuted,
                    }}
                >
                    {selectedBoard.description}
                </Text>

                {!!errorMessage && (
                    <Text
                        style={{
                            color:
                                theme.colors.primary,
                        }}
                    >
                        {errorMessage}
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
                            fontWeight: "900",
                            fontSize: 18,
                        }}
                    >
                        New Thread
                    </Text>

                    <TextInput
                        value={
                            newThreadTitle
                        }
                        onChangeText={
                            setNewThreadTitle
                        }
                        placeholder="Thread title"
                        placeholderTextColor={
                            theme.colors.textMuted
                        }
                        style={{
                            color:
                                theme.colors.text,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderRadius: 12,
                            padding: 10,
                        }}
                    />

                    <TextInput
                        value={
                            newThreadBody
                        }
                        onChangeText={
                            setNewThreadBody
                        }
                        placeholder="First post..."
                        placeholderTextColor={
                            theme.colors.textMuted
                        }
                        multiline
                        style={{
                            color:
                                theme.colors.text,
                            backgroundColor:
                                theme.colors.surfaceAlt,
                            borderRadius: 12,
                            padding: 10,
                            minHeight: 90,
                            textAlignVertical:
                                "top",
                        }}
                    />

                    <Pressable
                        onPress={createThread}
                        style={{
                            padding: 11,
                            borderRadius: 999,
                            alignItems:
                                "center",
                            backgroundColor:
                                theme.colors.primary,
                        }}
                    >
                        <Text
                            style={{
                                color: "white",
                                fontWeight: "900",
                            }}
                        >
                            Create Thread
                        </Text>
                    </Pressable>
                </View>

                {threads.map((thread) => (
                    <Pressable
                        key={thread.id}
                        onPress={() =>
                            loadPosts(thread)
                        }
                        style={{
                            backgroundColor:
                                theme.colors.surface,
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                            borderRadius: 16,
                            padding: 14,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    theme.colors.text,
                                fontSize: 18,
                                fontWeight: "900",
                            }}
                        >
                            {thread.title}
                        </Text>

                        <Text
                            style={{
                                color:
                                    theme.colors.textMuted,
                                marginTop: 5,
                            }}
                        >
                            {thread.postCount} post
                            {thread.postCount === 1
                                ? ""
                                : "s"}{" "}
                            · by {thread.authorName}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
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
                padding: 12,
                paddingBottom: 100,
                gap: 10,
            }}
        >
            {!!errorMessage && (
                <Text
                    style={{
                        color:
                            theme.colors.primary,
                    }}
                >
                    {errorMessage}
                </Text>
            )}

            {boardCategories.map(
                (category) => (
                    <View
                        key={
                            category.category
                        }
                        style={{
                            borderRadius: 10,
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor:
                                theme.colors.border,
                            backgroundColor:
                                theme.colors.surface,
                        }}
                    >
                        <View
                            style={{
                                flexDirection:
                                    "row",
                                alignItems:
                                    "center",
                                backgroundColor:
                                    theme.colors.primary,
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                            }}
                        >
                            <Text
                                style={{
                                    flex: 1,
                                    color: "white",
                                    fontSize: 18,
                                    fontWeight: "800",
                                }}
                            >
                                {category.category}
                            </Text>

                            <Text
                                style={{
                                    width: 70,
                                    color: "white",
                                    fontSize: 13,
                                    fontWeight: "800",
                                    textAlign:
                                        "center",
                                }}
                            >
                                Threads
                            </Text>

                            <Text
                                style={{
                                    width: 70,
                                    color: "white",
                                    fontSize: 13,
                                    fontWeight: "800",
                                    textAlign:
                                        "center",
                                }}
                            >
                                Posts
                            </Text>
                        </View>

                        {category.boards.map(
                            (board) => (
                                <Pressable
                                    key={board.id}
                                    onPress={() =>
                                        loadThreads(
                                            board
                                        )
                                    }
                                    style={{
                                        flexDirection:
                                            "row",
                                        alignItems:
                                            "center",
                                        paddingVertical: 10,
                                        paddingHorizontal: 10,
                                        borderTopWidth: 1,
                                        borderTopColor:
                                            theme.colors.border,
                                    }}
                                >
                                    <View
                                        style={{
                                            flex: 1,
                                            paddingRight: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.text,
                                                fontSize: 14,
                                                fontWeight:
                                                    "900",
                                                marginBottom: 3,
                                            }}
                                        >
                                            {board.title}
                                        </Text>

                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.textMuted,
                                                fontSize: 12,
                                                lineHeight: 16,
                                            }}
                                        >
                                            {board.description}
                                        </Text>
                                    </View>

                                    <Text
                                        style={{
                                            width: 70,
                                            color:
                                                theme.colors.text,
                                            fontSize: 12,
                                            fontWeight: "800",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        {board.threadCount}
                                    </Text>

                                    <Text
                                        style={{
                                            width: 70,
                                            color:
                                                theme.colors.textMuted,
                                            fontSize: 12,
                                            fontWeight: "800",
                                            textAlign:
                                                "center",
                                        }}
                                    >
                                        —
                                    </Text>
                                </Pressable>
                            )
                        )}
                    </View>
                )
            )}
        </ScrollView>
    );
}