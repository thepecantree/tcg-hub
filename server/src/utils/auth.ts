import db from "../db";

export const ADMIN_USER_IDS = new Set([
    "1",
]);

export function createToken() {
    return `session-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
}

export function getTokenFromAuthHeader(req: any) {
    const authorization =
        String(req.headers.authorization ?? "");

    return authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : "";
}

export function getUserIdFromAuthHeader(req: any) {
    const token =
        getTokenFromAuthHeader(req);

    if (!token) {
        return null;
    }

    const session = db
        .prepare(
            `
            SELECT user_id as userId
            FROM sessions
            WHERE token = @token
            LIMIT 1
            `
        )
        .get({
            token,
        }) as
        | {
            userId: string;
        }
        | undefined;

    return session?.userId ?? null;
}

export function requireAdmin(req: any, res: any) {
    const userId =
        getUserIdFromAuthHeader(req);

    if (
        !userId ||
        !ADMIN_USER_IDS.has(userId)
    ) {
        res.status(403).json({
            error: "Admin access required",
        });

        return null;
    }

    return userId;
}