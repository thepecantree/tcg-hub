export function mapForumThread(
    row: any
) {
    return {
        id: row.id,
        boardId: row.boardId,
        title: row.title,

        authorUserId:
            row.authorUserId,

        authorName:
            row.authorName,

        createdAt:
            row.createdAt,

        updatedAt:
            row.updatedAt,

        postCount:
            Number(
                row.postCount ?? 0
            ),
    };
}

export function mapForumPost(
    row: any
) {
    return {
        id: row.id,

        threadId:
            row.threadId,

        authorUserId:
            row.authorUserId,

        authorName:
            row.authorName,

        authorUsername:
            row.authorUsername,

        authorAvatar:
            row.authorAvatar,

        authorJoinDate:
            row.authorJoinDate,

        authorPostCount:
            Number(
                row.authorPostCount ?? 0
            ),

        body:
            row.body,

        createdAt:
            row.createdAt,

        replyToPostId:
            row.replyToPostId,
    };
}

export function mapForumReport(
    row: any
) {
    return {
        id: row.id,

        postId:
            row.postId,

        threadId:
            row.threadId,

        reporterUserId:
            row.reporterUserId,

        reporterName:
            row.reporterName,

        reason:
            row.reason,

        createdAt:
            row.createdAt,
    };
}

export const FORUM_THREAD_SELECT_SQL =
    `
    SELECT
        id,

        board_id as boardId,

        title,

        author_user_id as authorUserId,

        author_name as authorName,

        created_at as createdAt,

        updated_at as updatedAt

    FROM forum_threads
    `;

export const FORUM_POST_SELECT_SQL =
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
    `;

export const FORUM_REPORT_SELECT_SQL =
    `
    SELECT
        id,

        post_id as postId,

        thread_id as threadId,

        reporter_user_id as reporterUserId,

        reporter_name as reporterName,

        reason,

        created_at as createdAt

    FROM forum_reports
    `;