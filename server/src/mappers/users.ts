export function mapUser(row: any) {
    return {
        id: row.id,
        username: row.username,
        displayName: row.displayName,
        avatar: row.avatar,
        location: row.location,
        bio: row.bio,
        createdAt: row.createdAt,
    };
}

export function userSelectSql() {
    return `
        SELECT
            id,
            username,
            display_name as displayName,
            avatar,
            location,
            bio,
            created_at as createdAt
        FROM users
    `;
}