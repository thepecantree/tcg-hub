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

router.get("/demand", (req, res) => {
    const cardName =
        String(req.query.cardName ?? "").trim();

    const excludeUserId =
        String(req.query.excludeUserId ?? "").trim();

    if (!cardName) {
        return res.json([]);
    }

    const rows = db
        .prepare(
            `
            SELECT
                u.id as userId,
                u.username,
                u.display_name as displayName,
                u.avatar,
                u.location,

                e.card_name as cardName,
                e.scryfall_id as scryfallId,
                e.set_name as setName,
                e.set_code as setCode,
                e.collector_number as collectorNumber,
                e.image_small as imageSmall,
                e.type_line as typeLine,
                e.rarity,
                e.mana_value as manaValue,
                e.colors,
                e.foil,
                e.quantity,
                e.print_specific as printSpecific
            FROM user_card_entries e
            JOIN users u
                ON u.id = e.user_id
            WHERE
                e.list_type = 'wishlist'
                AND LOWER(e.card_name) = LOWER(@cardName)
                AND (
                    @excludeUserId = ''
                    OR e.user_id != @excludeUserId
                )
            ORDER BY
                u.display_name ASC,
                e.card_name ASC
            `
        )
        .all({
            cardName,
            excludeUserId,
        });

    res.json(rows);
});

router.get("/availability", (req, res) => {
    const cardName =
        String(req.query.cardName ?? "").trim();

    const excludeUserId =
        String(req.query.excludeUserId ?? "").trim();

    if (!cardName) {
        return res.json([]);
    }

    const rows = db
        .prepare(
            `
            SELECT
                u.id as userId,
                u.username,
                u.display_name as displayName,
                u.avatar,
                u.location,

                e.card_name as cardName,
                e.scryfall_id as scryfallId,
                e.set_name as setName,
                e.set_code as setCode,
                e.collector_number as collectorNumber,
                e.image_small as imageSmall,
                e.type_line as typeLine,
                e.rarity,
                e.mana_value as manaValue,
                e.colors,
                e.foil,
                e.quantity,
                e.print_specific as printSpecific
            FROM user_card_entries e
            JOIN users u
                ON u.id = e.user_id
            WHERE
                e.list_type = 'collection'
                AND LOWER(e.card_name) = LOWER(@cardName)
                AND (
                    @excludeUserId = ''
                    OR e.user_id != @excludeUserId
                )
            ORDER BY
                u.display_name ASC,
                e.card_name ASC
            `
        )
        .all({
            cardName,
            excludeUserId,
        });

    res.json(rows);
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