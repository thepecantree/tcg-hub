import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";

import db from "../db";
import { createId } from "../utils/ids";
import {
    mapDeck,
    mapDeckCard,
} from "../mappers/decks";

const router = Router();

function normalizePowerLevel(value: unknown) {
    const number = Number(value);

    if (number < 1) {
        return 1;
    }

    if (number > 5) {
        return 5;
    }

    return number || 1;
}

function normalizeDeckVisibility(value: unknown) {
    const visibility = String(value ?? "").trim();

    if (
        visibility === "public" ||
        visibility === "unlisted" ||
        visibility === "private"
    ) {
        return visibility;
    }

    return "private";
}

function ensureUserExists(userId: string) {
    return db
        .prepare(
            `
            SELECT id
            FROM users
            WHERE id = @userId
            LIMIT 1
            `
        )
        .get({
            userId,
        });
}

router.get("/:id/decks", (req, res) => {
    const userId = String(req.params.id ?? "").trim();

    const viewerUserId =
        String(req.query.viewerUserId ?? "").trim();

    const isOwner =
        viewerUserId === userId;

    const rows = db
        .prepare(
            `
            SELECT
                id,
                user_id as userId,
                name,
                face_card_name as faceCardName,
                face_card_image as faceCardImage,
                is_public as isPublic,
                visibility,
                format,
                power_level as powerLevel,
                created_at as createdAt,
                updated_at as updatedAt
            FROM decks
            WHERE
                user_id = @userId
                AND (
                    @isOwner = 1
                    OR visibility = 'public'
                )
            ORDER BY
                format ASC,
                power_level DESC,
                name ASC
            `
        )
        .all({
            userId,
            isOwner: isOwner ? 1 : 0,
        });

    res.json({
        decks: rows.map(mapDeck),
    });
});

router.post(
    "/:id/decks",
    requireAuth,
    (req, res) => {
        const userId = String(req.params.id ?? "").trim();
        

    if (!userId) {
        return res.status(400).json({
            error: "Missing user id",
        });
    }

    if (!ensureUserExists(userId)) {
        return res.status(404).json({
            error: "User not found",
        });
    }

    const now = new Date().toISOString();

    const deckId = createId("deck");

    const name =
        String(req.body.name ?? "Untitled Deck").trim() ||
        "Untitled Deck";

    const visibility =
        normalizeDeckVisibility(
            req.body.visibility
        );

    db.prepare(
        `
        INSERT INTO decks (
            id,
            user_id,
            name,
            face_card_name,
            face_card_image,
            is_public,
            visibility,
            format,
            power_level,
            created_at,
            updated_at
        )
        VALUES (
            @id,
            @userId,
            @name,
            @faceCardName,
            @faceCardImage,
            @isPublic,
            @visibility,
            @format,
            @powerLevel,
            @createdAt,
            @updatedAt
        )
        `
    ).run({
        id: deckId,
        userId,
        name,
        faceCardName: req.body.faceCardName ?? null,
        faceCardImage: req.body.faceCardImage ?? null,
        isPublic: visibility === "public" ? 1 : 0,
        visibility,
        format: req.body.format ?? "Unsorted",
        powerLevel: normalizePowerLevel(req.body.powerLevel),
        createdAt: now,
        updatedAt: now,
    });

    const row = db
        .prepare(
            `
            SELECT
                id,
                user_id as userId,
                name,
                face_card_name as faceCardName,
                face_card_image as faceCardImage,
                is_public as isPublic,
                visibility,
                format,
                power_level as powerLevel,
                visibility,
                created_at as createdAt,
                updated_at as updatedAt
            FROM decks
            WHERE id = @deckId
            LIMIT 1
            `
        )
        .get({
            deckId,
        });

    res.json({
        deck: mapDeck(row),
    });
});

router.get("/:id/decks/:deckId", (req, res) => {
    const userId = String(req.params.id ?? "").trim();
    const deckId = String(req.params.deckId ?? "").trim();

    const viewerUserId =
        String(req.query.viewerUserId ?? "").trim();

    const isOwner =
        viewerUserId === userId;

    const deckRow = db
        .prepare(
            `
            SELECT
                id,
                user_id as userId,
                name,
                face_card_name as faceCardName,
                face_card_image as faceCardImage,
                is_public as isPublic,
                visibility,
                format,
                power_level as powerLevel,
                created_at as createdAt,
                updated_at as updatedAt
            FROM decks
            WHERE
                id = @deckId
                AND user_id = @userId
                AND (
                    @isOwner = 1
                    OR visibility IN ('public', 'unlisted')
                )
            LIMIT 1
            `
        )
        .get({
            userId,
            deckId,
            isOwner: isOwner ? 1 : 0,
        });

    if (!deckRow) {
        return res.status(404).json({
            error: "Deck not found",
        });
    }

    const cardRows = db
        .prepare(
            `
            SELECT
                id,
                deck_id as deckId,
                card_name as cardName,
                scryfall_id as scryfallId,
                set_name as setName,
                set_code as setCode,
                collector_number as collectorNumber,
                image_small as imageSmall,
                type_line as typeLine,
                rarity,
                mana_value as manaValue,
                colors,
                foil,
                quantity,
                print_specific as printSpecific,
                created_at as createdAt,
                updated_at as updatedAt
            FROM deck_cards
            WHERE deck_id = @deckId
            ORDER BY card_name ASC
            `
        )
        .all({
            deckId,
        });

    res.json({
        deck: {
            ...mapDeck(deckRow),
            cards: cardRows.map(mapDeckCard),
        },
    });
});

router.patch(
    "/:id/decks/:deckId",
    requireAuth,
    (req, res) => {
        const userId = String(req.params.id ?? "").trim();
        const authenticatedUserId =
            String((req as any).userId ?? "");

        if (authenticatedUserId !== userId) {
            return res.status(403).json({
                error: "Forbidden",
            });
        }
    const deckId = String(req.params.deckId ?? "").trim();

    const existing = db
        .prepare(
            `
            SELECT
                id,
                name,
                face_card_name as faceCardName,
                face_card_image as faceCardImage,
                is_public as isPublic,
                visibility,
                format,
                power_level as powerLevel,
                visibility
            FROM decks
            WHERE
                id = @deckId
                AND user_id = @userId
            LIMIT 1
            `
        )
        .get({
            userId,
            deckId,
        }) as any;

    if (!existing) {
        return res.status(404).json({
            error: "Deck not found",
        });
    }

    const nextName =
        req.body.name === undefined
            ? existing.name
            : String(req.body.name).trim() || existing.name;

    const nextFaceCardName =
        req.body.faceCardName === undefined
            ? existing.faceCardName
            : req.body.faceCardName ?? null;

    const nextFaceCardImage =
        req.body.faceCardImage === undefined
            ? existing.faceCardImage
            : req.body.faceCardImage ?? null;

    const existingVisibility =
        existing.visibility ??
        (existing.isPublic ? "public" : "private");

    const nextVisibility =
        req.body.visibility === undefined
            ? existingVisibility
            : normalizeDeckVisibility(
                req.body.visibility
            );

    const nextIsPublic =
        nextVisibility === "public"
            ? 1
            : 0;

    const nextFormat =
        req.body.format === undefined
            ? existing.format
            : req.body.format ?? "Unsorted";

    const nextPowerLevel =
        req.body.powerLevel === undefined
            ? existing.powerLevel
            : normalizePowerLevel(req.body.powerLevel);

    db.prepare(
        `
        UPDATE decks
        SET
            name = @name,
            face_card_name = @faceCardName,
            face_card_image = @faceCardImage,
            is_public = @isPublic,
            visibility = @visibility,
            format = @format,
            power_level = @powerLevel,
            updated_at = @updatedAt
        WHERE
            id = @deckId
            AND user_id = @userId
        `
    ).run({
        userId,
        deckId,
        name: nextName,
        faceCardName: nextFaceCardName,
        faceCardImage: nextFaceCardImage,
        isPublic: nextIsPublic,
        visibility: nextVisibility,
        format: nextFormat,
        powerLevel: nextPowerLevel,
        updatedAt: new Date().toISOString(),
    });

    const row = db
        .prepare(
            `
            SELECT
                id,
                user_id as userId,
                name,
                face_card_name as faceCardName,
                face_card_image as faceCardImage,
                is_public as isPublic,
                visibility as visibility,
                format,
                power_level as powerLevel,
                visibility,
                created_at as createdAt,
                updated_at as updatedAt
            FROM decks
            WHERE id = @deckId
            LIMIT 1
            `
        )
        .get({
            deckId,
        });

    res.json({
        deck: mapDeck(row),
    });
});

router.post(
    "/:id/decks/:deckId/replace-cards",
    requireAuth,
    (req, res) => {
        const userId = String(req.params.id ?? "").trim();
        const authenticatedUserId =
            (req as any).userId;
        if (authenticatedUserId !== userId) {
            return res.status(403).json({
                error: "Forbidden",
            });
        }
    const deckId = String(req.params.deckId ?? "").trim();

    const cards = Array.isArray(req.body.cards)
        ? req.body.cards
        : [];

    const existing = db
        .prepare(
            `
            SELECT id
            FROM decks
            WHERE
                id = @deckId
                AND user_id = @userId
            LIMIT 1
            `
        )
        .get({
            userId,
            deckId,
        });

    if (!existing) {
        return res.status(404).json({
            error: "Deck not found",
        });
    }

    const now = new Date().toISOString();

    const transaction = db.transaction(() => {
        db.prepare(
            `
            DELETE FROM deck_cards
            WHERE deck_id = @deckId
            `
        ).run({
            deckId,
        });

        const insert = db.prepare(
            `
            INSERT INTO deck_cards (
                id,
                deck_id,

                card_name,
                scryfall_id,
                set_name,
                set_code,
                collector_number,
                image_small,
                type_line,
                rarity,
                mana_value,
                colors,

                foil,
                quantity,
                print_specific,

                created_at,
                updated_at
            )
            VALUES (
                @id,
                @deckId,

                @cardName,
                @scryfallId,
                @setName,
                @setCode,
                @collectorNumber,
                @imageSmall,
                @typeLine,
                @rarity,
                @manaValue,
                @colors,

                @foil,
                @quantity,
                @printSpecific,

                @createdAt,
                @updatedAt
            )
            `
        );

        for (const card of cards) {
            const cardName = String(card.cardName ?? "").trim();

            if (!cardName) {
                continue;
            }

            insert.run({
                id: createId("deck-card"),
                deckId,

                cardName,
                scryfallId: card.scryfallId ?? null,
                setName: card.setName ?? null,
                setCode: card.setCode ?? null,
                collectorNumber: card.collectorNumber ?? null,
                imageSmall: card.imageSmall ?? null,
                typeLine: card.typeLine ?? null,
                rarity: card.rarity ?? null,
                manaValue: card.manaValue ?? null,
                colors: card.colors ?? null,

                foil: card.foil ? 1 : 0,
                quantity: Math.max(
                    1,
                    Number(card.quantity ?? 1)
                ),
                printSpecific: card.printSpecific ? 1 : 0,

                createdAt: now,
                updatedAt: now,
            });
        }

        db.prepare(
            `
            UPDATE decks
            SET updated_at = @updatedAt
            WHERE id = @deckId
            `
        ).run({
            deckId,
            updatedAt: now,
        });
    });

    transaction();

    res.json({
        ok: true,
    });
});

router.delete(
    "/:id/decks/:deckId",
    requireAuth,
    (req, res) => {
        const userId = String(req.params.id ?? "").trim();
        const authenticatedUserId =
            (req as any).userId;
        if (authenticatedUserId !== userId) {
            return res.status(403).json({
                error: "Forbidden",
            });
        }
    const deckId = String(req.params.deckId ?? "").trim();

    const transaction = db.transaction(() => {
        db.prepare(
            `
            DELETE FROM deck_cards
            WHERE deck_id = @deckId
            `
        ).run({
            deckId,
        });

        return db
            .prepare(
                `
                DELETE FROM decks
                WHERE
                    id = @deckId
                    AND user_id = @userId
                `
            )
            .run({
                userId,
                deckId,
            });
    });

    const result = transaction();

    if (result.changes === 0) {
        return res.status(404).json({
            error: "Deck not found",
        });
    }

    res.json({
        ok: true,
    });
});

export default router;