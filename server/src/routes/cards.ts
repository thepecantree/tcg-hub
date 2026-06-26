import { Router } from "express";

import db from "../db";
import { cardSelectSql } from "../mappers/cards";

const router = Router();

router.get("/search", (req, res) => {
    const q = String(req.query.q ?? "").trim();

    if (!q) {
        return res.json([]);
    }

    const mode = String(req.query.mode ?? "string");
    const search = `%${q}%`;

    const cards = db
        .prepare(
            `
            ${cardSelectSql()}

            WHERE
                lang = 'en'
                AND (
                    LOWER(name) LIKE LOWER(@search)
                    OR (
                        @mode != 'string'
                        AND LOWER(set_name) LIKE LOWER(@search)
                    )
                )

            ORDER BY
                name ASC,
                releasedAt DESC

            LIMIT 300
            `
        )
        .all({
            search,
            mode,
        });

    res.json(cards);
});

router.get("/editions", (req, res) => {
    const name = String(req.query.name ?? "").trim();

    if (!name) {
        return res.json([]);
    }

    const cards = db
        .prepare(
            `
            ${cardSelectSql()}

            WHERE
                lang = 'en'
                AND name = @name

            ORDER BY releasedAt DESC
            `
        )
        .all({
            name,
        });

    res.json(cards);
});

router.get("/:id", (req, res) => {
    const card = db
        .prepare(
            `
            ${cardSelectSql()}

            WHERE scryfall_id = @id

            LIMIT 1
            `
        )
        .get({
            id: req.params.id,
        });

    if (!card) {
        return res.status(404).json({
            error: "Card not found",
        });
    }

    res.json(card);
});

export default router;