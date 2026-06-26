import { Router } from "express";

import db from "../db";
import { createId } from "../utils/ids";

import {
    mapForumPost,
    mapForumThread,
} from "../mappers/forum";

const router = Router();

const forumBoards = [
    {
        category: "Magic: The Gathering",
        boards: [
            {
                id: "mtg-competition-meta",
                title: "Competition & Meta",
                description:
                    "Tournament review, deck performance, and general format analysis.",
            },
            {
                id: "mtg-aesthetics-casual",
                title: "Aesthetics & Casual",
                description:
                    "Cube, alters, collections, pet cards, deck appreciation, etc.",
            },
            {
                id: "mtg-flavor-lore",
                title: "Flavor & Lore",
                description:
                    "Story review, worldbuilding, characters, planes, theories, etc.",
            },
            {
                id: "mtg-business-finance",
                title: "Business & Finance",
                description:
                    "LGS operations, WotC news, secondary market analysis, and general finance.",
            },
            {
                id: "mtg-x",
                title: "X Board",
                description:
                    "Memes, jokes, shitposts, and whatever survives moderation. (About MTG)",
            },
        ],
    },
    {
        category: "Off Topic",
        boards: [
            {
                id: "offtopic-games",
                title: "Games & Hobbies",
                description:
                    "Video games, tabletop games, music, art, and akin interests.",
            },
            {
                id: "offtopic-film-tv",
                title: "Film & TV",
                description:
                    "Movies, TV series, anime, and akin media.",
            },
            {
                id: "offtopic-sports",
                title: "Sports",
                description:
                    "Professional & amateur sports & general physical activity.",
            },
            {
                id: "offtopic-news",
                title: "News",
                description:
                    "Current events and ongoing news.",
            },
            {
                id: "offtopic-x",
                title: "X Board",
                description:
                    "Memes, jokes, shitposts, and whatever survives moderation. (Not about MTG)",
            },
        ],
    },
];

router.get("/boards", (_req, res) => {
    const result = forumBoards.map(
        (category) => ({
            category:
                category.category,

            boards:
                category.boards.map(
                    (board) => {
                        const stats = db
                            .prepare(
                                `
                                SELECT
                                    COUNT(*) as threadCount
                                FROM forum_threads
                                WHERE board_id = @boardId
                                `
                            )
                            .get({
                                boardId:
                                    board.id,
                            }) as {
                                threadCount: number;
                            };

                        return {
                            ...board,
                            threadCount:
                                stats.threadCount,
                        };
                    }
                ),
        })
    );

    res.json(result);
});

router.get("/threads", (req, res) => {
    const boardId =
        String(req.query.boardId ?? "").trim();

    if (!boardId) {
        return res.json([]);
    }

    const rows = db
        .prepare(
            `
            SELECT
                t.id,
                t.board_id as boardId,
                t.title,
                t.author_user_id as authorUserId,
                t.author_name as authorName,
                t.created_at as createdAt,
                t.updated_at as updatedAt,
                COUNT(p.id) as postCount
            FROM forum_threads t
            LEFT JOIN forum_posts p
                ON p.thread_id = t.id
            WHERE t.board_id = @boardId
            GROUP BY t.id
            ORDER BY t.updated_at DESC
            `
        )
        .all({
            boardId,
        });

    res.json(
        rows.map(mapForumThread)
    );
});

router.get("/posts", (req, res) => {
    const threadId =
        String(req.query.threadId ?? "").trim();

    if (!threadId) {
        return res.json([]);
    }

    const rows = db
        .prepare(
            `
            SELECT
                id,
                thread_id as threadId,
                author_user_id as authorUserId,
                author_name as authorName,
                author_username as authorUsername,
                author_avatar as authorAvatar,
                author_join_date as authorJoinDate,
                author_post_count as authorPostCount,
                body,
                created_at as createdAt,
                reply_to_post_id as replyToPostId
            FROM forum_posts
            WHERE thread_id = @threadId
            ORDER BY created_at ASC
            `
        )
        .all({
            threadId,
        });

    res.json(
        rows.map(mapForumPost)
    );
});

router.post("/threads", (req, res) => {
    try {
        const boardId =
            String(req.body.boardId ?? "").trim();

        const title =
            String(req.body.title ?? "").trim();

        const body =
            String(req.body.body ?? "").trim();

        const authorUserId =
            String(req.body.authorUserId ?? "").trim();

        const authorName =
            String(req.body.authorName ?? "").trim();

        const authorUsername =
            String(req.body.authorUsername ?? "").trim();

        const authorAvatar =
            String(req.body.authorAvatar ?? "").trim();

        const authorJoinDate =
            String(
                req.body.authorJoinDate ??
                "2026"
            ).trim();

        if (
            !boardId ||
            !title ||
            !body ||
            !authorUserId ||
            !authorName
        ) {
            return res.status(400).json({
                error:
                    "Missing required thread fields",
            });
        }

        const now =
            new Date().toISOString();

        const threadId =
            createId("thread");

        const postId =
            createId("post");

        const totalPosts = db
            .prepare(
                `
                SELECT
                    COUNT(*) as count
                FROM forum_posts
                WHERE author_user_id = @userId
                `
            )
            .get({
                userId:
                    authorUserId,
            }) as {
                count: number;
            };

        const transaction =
            db.transaction(() => {
                db.prepare(
                    `
                    INSERT INTO forum_threads (
                        id,
                        board_id,
                        title,
                        author_user_id,
                        author_name,
                        created_at,
                        updated_at
                    )
                    VALUES (
                        @id,
                        @boardId,
                        @title,
                        @authorUserId,
                        @authorName,
                        @createdAt,
                        @updatedAt
                    )
                    `
                ).run({
                    id:
                        threadId,
                    boardId,
                    title,
                    authorUserId,
                    authorName,
                    createdAt:
                        now,
                    updatedAt:
                        now,
                });

                db.prepare(
                    `
                    INSERT INTO forum_posts (
                        id,
                        thread_id,
                        author_user_id,
                        author_name,
                        author_username,
                        author_avatar,
                        author_join_date,
                        author_post_count,
                        body,
                        created_at,
                        reply_to_post_id
                    )
                    VALUES (
                        @id,
                        @threadId,
                        @authorUserId,
                        @authorName,
                        @authorUsername,
                        @authorAvatar,
                        @authorJoinDate,
                        @authorPostCount,
                        @body,
                        @createdAt,
                        @replyToPostId
                    )
                    `
                ).run({
                    id:
                        postId,
                    threadId,
                    authorUserId,
                    authorName,
                    authorUsername,
                    authorAvatar,
                    authorJoinDate,
                    authorPostCount:
                        totalPosts.count + 1,
                    body,
                    createdAt:
                        now,
                    replyToPostId:
                        null,
                });
            });

        transaction();

        res.json({
            id:
                threadId,
        });
    } catch (error) {
        console.error(
            "Create thread failed:",
            error
        );

        res.status(500).json({
            error:
                "Could not create thread",
        });
    }
});

router.post("/posts", (req, res) => {
    try {
        const threadId =
            String(req.body.threadId ?? "").trim();

        const body =
            String(req.body.body ?? "").trim();

        const authorUserId =
            String(req.body.authorUserId ?? "").trim();

        const authorName =
            String(req.body.authorName ?? "").trim();

        const authorUsername =
            String(req.body.authorUsername ?? "").trim();

        const authorAvatar =
            String(req.body.authorAvatar ?? "").trim();

        const authorJoinDate =
            String(
                req.body.authorJoinDate ??
                "2026"
            ).trim();

        const replyToPostId =
            req.body.replyToPostId
                ? String(
                    req.body.replyToPostId
                )
                : null;

        if (
            !threadId ||
            !body ||
            !authorUserId ||
            !authorName
        ) {
            return res.status(400).json({
                error:
                    "Missing required post fields",
            });
        }

        const postId =
            createId("post");

        const now =
            new Date().toISOString();

        const totalPosts = db
            .prepare(
                `
                SELECT
                    COUNT(*) as count
                FROM forum_posts
                WHERE author_user_id = @userId
                `
            )
            .get({
                userId:
                    authorUserId,
            }) as {
                count: number;
            };

        db.prepare(
            `
            INSERT INTO forum_posts (
                id,
                thread_id,
                author_user_id,
                author_name,
                author_username,
                author_avatar,
                author_join_date,
                author_post_count,
                body,
                created_at,
                reply_to_post_id
            )
            VALUES (
                @id,
                @threadId,
                @authorUserId,
                @authorName,
                @authorUsername,
                @authorAvatar,
                @authorJoinDate,
                @authorPostCount,
                @body,
                @createdAt,
                @replyToPostId
            )
            `
        ).run({
            id:
                postId,
            threadId,
            authorUserId,
            authorName,
            authorUsername,
            authorAvatar,
            authorJoinDate,
            authorPostCount:
                totalPosts.count + 1,
            body,
            createdAt:
                now,
            replyToPostId,
        });

        db.prepare(
            `
            UPDATE forum_threads
            SET updated_at = @updatedAt
            WHERE id = @threadId
            `
        ).run({
            updatedAt:
                now,
            threadId,
        });

        res.json({
            id:
                postId,
        });
    } catch (error) {
        console.error(
            "Create forum post failed:",
            error
        );

        res.status(500).json({
            error:
                "Could not create post",
        });
    }
});

router.post("/report", (req, res) => {
    try {
        const postId =
            String(req.body.postId ?? "").trim();

        const threadId =
            String(req.body.threadId ?? "").trim();

        const reporterUserId =
            String(
                req.body.reporterUserId ?? ""
            ).trim();

        const reporterName =
            String(
                req.body.reporterName ?? ""
            ).trim();

        const reason =
            String(
                req.body.reason ?? "General"
            ).trim();

        if (
            !postId ||
            !threadId ||
            !reporterUserId ||
            !reporterName
        ) {
            return res.status(400).json({
                error:
                    "Missing required report fields",
            });
        }

        const reportId =
            createId("report");

        const now =
            new Date().toISOString();

        db.prepare(
            `
            INSERT INTO forum_reports (
                id,
                post_id,
                thread_id,
                reporter_user_id,
                reporter_name,
                reason,
                created_at
            )
            VALUES (
                @id,
                @postId,
                @threadId,
                @reporterUserId,
                @reporterName,
                @reason,
                @createdAt
            )
            `
        ).run({
            id:
                reportId,
            postId,
            threadId,
            reporterUserId,
            reporterName,
            reason,
            createdAt:
                now,
        });

        res.json({
            ok: true,
        });
    } catch (error) {
        console.error(
            "Create forum report failed:",
            error
        );

        res.status(500).json({
            error:
                "Could not create report",
        });
    }
});

router.delete("/posts/:postId", (req, res) => {

    const postId =
        String(req.params.postId ?? "").trim();

    const adminUserId =
        String(req.query.adminUserId ?? "").trim();

    if (adminUserId !== "1") {
        return res.status(403).json({
            error: "Admin access required",
        });
    }

    const existing = db
        .prepare(
            `
            SELECT
                id,
                thread_id as threadId
            FROM forum_posts
            WHERE id = @postId
            LIMIT 1
            `
        )
        .get({
            postId,
        }) as
        | {
            id: string;
            threadId: string;
        }
        | undefined;

    if (!existing) {
        return res.status(404).json({
            error: "Post not found",
        });
    }
    const firstPost = db
        .prepare(
            `
        SELECT id
        FROM forum_posts
        WHERE thread_id = @threadId
        ORDER BY created_at ASC
        LIMIT 1
        `
        )
        .get({
            threadId: existing.threadId,
        }) as { id: string } | undefined;

    const isOriginalPost =
        firstPost?.id === postId;

    const now =
        new Date().toISOString();

    const transaction =
        db.transaction(() => {
            if (isOriginalPost) {
                db.prepare(
                    `
                DELETE FROM forum_reports
                WHERE thread_id = @threadId
                `
                ).run({
                    threadId: existing.threadId,
                });

                db.prepare(
                    `
                DELETE FROM forum_posts
                WHERE thread_id = @threadId
                `
                ).run({
                    threadId: existing.threadId,
                });

                db.prepare(
                    `
                DELETE FROM forum_threads
                WHERE id = @threadId
                `
                ).run({
                    threadId: existing.threadId,
                });

                return;
            }

            db.prepare(
                `
            DELETE FROM forum_reports
            WHERE post_id = @postId
            `
            ).run({
                postId,
            });

            db.prepare(
                `
            UPDATE forum_posts
            SET reply_to_post_id = NULL
            WHERE reply_to_post_id = @postId
            `
            ).run({
                postId,
            });

            db.prepare(
                `
            DELETE FROM forum_posts
            WHERE id = @postId
            `
            ).run({
                postId,
            });

            db.prepare(
                `
            UPDATE forum_threads
            SET updated_at = @updatedAt
            WHERE id = @threadId
            `
            ).run({
                threadId: existing.threadId,
                updatedAt: now,
            });
        });

    transaction();

    res.json({
        ok: true,
    });
});

export default router;