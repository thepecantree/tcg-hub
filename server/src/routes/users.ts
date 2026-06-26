import { Router } from "express";

import db from "../db";

import {
    mapUser,
    userSelectSql,
} from "../mappers/users";

const router = Router();

router.get("/:id", (req, res) => {
    const id =
        String(req.params.id ?? "").trim();

    const user = db
        .prepare(
            `
            ${userSelectSql()}

            WHERE id = @id

            LIMIT 1
            `
        )
        .get({
            id,
        });

    if (!user) {
        return res.status(404).json({
            error: "User not found",
        });
    }

    res.json({
        user: mapUser(user),
    });
});

router.patch("/:id", (req, res) => {
    try {
        const id =
            String(req.params.id ?? "").trim();

        const displayName =
            String(req.body.displayName ?? "").trim();

        const username =
            String(req.body.username ?? "").trim();

        const avatar =
            String(req.body.avatar ?? "").trim();

        const bio =
            String(req.body.bio ?? "").trim();

        if (
            !id ||
            !displayName ||
            !username
        ) {
            return res.status(400).json({
                error:
                    "Missing required profile fields",
            });
        }

        const existingUser = db
            .prepare(
                `
                SELECT id
                FROM users
                WHERE id = @id
                LIMIT 1
                `
            )
            .get({
                id,
            });

        if (!existingUser) {
            return res.status(404).json({
                error:
                    "User not found",
            });
        }

        const existingUsername = db
            .prepare(
                `
                SELECT id
                FROM users
                WHERE
                    username = @username
                    AND id != @id
                LIMIT 1
                `
            )
            .get({
                id,
                username,
            });

        if (existingUsername) {
            return res.status(409).json({
                error:
                    "Username already taken",
            });
        }

        db.prepare(
            `
            UPDATE users
            SET
                display_name = @displayName,
                username = @username,
                avatar = @avatar,
                bio = @bio
            WHERE id = @id
            `
        ).run({
            id,
            displayName,
            username,
            avatar,
            bio,
        });

        const user = db
            .prepare(
                `
                ${userSelectSql()}

                WHERE id = @id

                LIMIT 1
                `
            )
            .get({
                id,
            });

        res.json({
            user: mapUser(user),
        });
    } catch (error) {
        console.error(
            "Update user failed:",
            error
        );

        res.status(500).json({
            error:
                "Could not update user",
        });
    }
});

export default router;