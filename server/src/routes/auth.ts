import { Router } from "express";

import db from "../db";

import {
    createToken,
    getTokenFromAuthHeader,
} from "../utils/auth";

import {
    mapUser,
    userSelectSql,
} from "../mappers/users";

const router = Router();

router.get("/dev-users", (_req, res) => {
    const users = db
        .prepare(
            `
            ${userSelectSql()}
            ORDER BY id ASC
            `
        )
        .all();

    res.json(
        users.map(mapUser)
    );
});

router.post("/login", (req, res) => {
    const identifier =
        String(
            req.body.identifier ?? ""
        ).trim();

    if (!identifier) {
        return res.status(400).json({
            error:
                "Missing login identifier",
        });
    }

    const user = db
        .prepare(
            `
            ${userSelectSql()}

            WHERE
                id = @identifier
                OR username = @identifier

            LIMIT 1
            `
        )
        .get({
            identifier,
        });

    if (!user) {
        return res.status(404).json({
            error:
                "User not found",
        });
    }

    const token =
        createToken();

    db.prepare(
        `
        INSERT INTO sessions (
            token,
            user_id,
            created_at,
            expires_at
        )
        VALUES (
            @token,
            @userId,
            @createdAt,
            @expiresAt
        )
        `
    ).run({
        token,
        userId:
            (user as any).id,
        createdAt:
            new Date().toISOString(),
        expiresAt:
            null,
    });

    res.json({
        token,
        user:
            mapUser(user),
    });
});

router.get("/me", (req, res) => {
    const token =
        getTokenFromAuthHeader(req);

    if (!token) {
        return res.status(401).json({
            error:
                "Missing token",
        });
    }

    const session = db
        .prepare(
            `
            SELECT
                user_id as userId
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

    if (!session) {
        return res.status(401).json({
            error:
                "Invalid session",
        });
    }

    const user = db
        .prepare(
            `
            ${userSelectSql()}

            WHERE id = @userId

            LIMIT 1
            `
        )
        .get({
            userId:
                session.userId,
        });

    if (!user) {
        return res.status(401).json({
            error:
                "User not found",
        });
    }

    res.json({
        user:
            mapUser(user),
    });
});

router.post("/logout", (req, res) => {
    const token =
        getTokenFromAuthHeader(req);

    if (token) {
        db.prepare(
            `
            DELETE FROM sessions
            WHERE token = @token
            `
        ).run({
            token,
        });
    }

    res.json({
        ok: true,
    });
});

export default router;