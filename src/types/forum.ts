export type ForumBoard = {
    id: string;
    title: string;
    description: string;
    threadCount: number;
};

export type ForumCategory = {
    category: string;
    boards: ForumBoard[];
};

export type ForumThread = {
    id: string;
    boardId: string;
    title: string;
    authorUserId: string;
    authorName: string;
    createdAt: string;
    updatedAt: string;
    postCount: number;
};

export type ForumPost = {
    id: string;
    threadId: string;

    authorUserId: string;
    authorName: string;
    authorUsername?: string | null;
    authorAvatar?: string | null;
    authorJoinDate?: string | null;
    authorPostCount?: number | null;

    body: string;
    createdAt: string;

    replyToPostId?: string | null;
};

export type ForumReport = {
    id: string;
    postId: string;
    threadId: string;
    reporterUserId: string;
    reporterName: string;
    reason: string;
    createdAt: string;
};