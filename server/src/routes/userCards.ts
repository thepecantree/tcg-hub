import { Router } from "express";

import db from "../db";
import { createId } from "../utils/ids";

import {
    USER_CARD_SELECT_SQL,
    mapCardEntry,
    normalizeListType,
} from "../mappers/userCards";

const router = Router();

function cardPayloadToDbParams(
    card: any,
    extra: {
        id: string;
        userId: string;
        listType: "collection" | "wishlist";
        createdAt: string;
        updatedAt: string;
    }
) {
    return {
        id: extra.id,
        userId: extra.userId,
        listType: extra.listType,

        cardName:
            String(card.cardName ?? "").trim(),

        scryfallId:
            card.scryfallId ?? null,

        setName:
            card.setName ?? null,

        setCode:
            card.setCode ?? null,

        collectorNumber:
            card.collectorNumber ?? null,

        imageSmall:
            card.imageSmall ?? null,

        typeLine:
            card.typeLine ?? null,

        rarity:
            card.rarity ?? null,

        manaValue:
            card.manaValue ?? null,

        colors:
            card.colors ?? null,

        foil:
            card.foil ? 1 : 0,

        quantity:
            Math.max(
                1,
                Number(card.quantity ?? 1)
            ),

        printSpecific:
            card.printSpecific ? 1 : 0,

        createdAt:
            extra.createdAt,

        updatedAt:
            extra.updatedAt,
    };
}

router.get("/:id/cards", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const listType =
        normalizeListType(
            req.query.listType
        );

    if (!userId || !listType) {
        return res.status(400).json({
            error:
                "Missing or invalid listType",
        });
    }

    const rows = db
        .prepare(
            `
            ${USER_CARD_SELECT_SQL}

            WHERE
                user_id = @userId
                AND list_type = @listType

            ORDER BY
                card_name ASC,
                updated_at DESC
            `
        )
        .all({
            userId,
            listType,
        });

    res.json({
        cards:
            rows.map(
                mapCardEntry
            ),
    });
});

router.post("/:id/cards", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const listType =
        normalizeListType(
            req.body.listType
        );

    const cardName =
        String(req.body.cardName ?? "").trim();

    if (!userId || !listType || !cardName) {
        return res.status(400).json({
            error:
                "Missing required card entry fields",
        });
    }

    const now =
        new Date().toISOString();

    const id =
        createId("card-entry");

    db.prepare(
        `
        INSERT INTO user_card_entries (
            id,
            user_id,
            list_type,

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
            @userId,
            @listType,

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
    ).run(
        cardPayloadToDbParams(
            req.body,
            {
                id,
                userId,
                listType,
                createdAt: now,
                updatedAt: now,
            }
        )
    );

    const row = db
        .prepare(
            `
            ${USER_CARD_SELECT_SQL}

            WHERE id = @id

            LIMIT 1
            `
        )
        .get({
            id,
        });

    res.json({
        card:
            mapCardEntry(row),
    });
});

router.patch("/:id/cards/:entryId", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const entryId =
        String(req.params.entryId ?? "").trim();

    if (!userId || !entryId) {
        return res.status(400).json({
            error:
                "Missing card entry id",
        });
    }

    const existing = db
        .prepare(
            `
            ${USER_CARD_SELECT_SQL}

            WHERE
                id = @entryId
                AND user_id = @userId

            LIMIT 1
            `
        )
        .get({
            entryId,
            userId,
        }) as any;

    if (!existing) {
        return res.status(404).json({
            error:
                "Card entry not found",
        });
    }

    const next = {
        cardName:
            req.body.cardName === undefined
                ? existing.cardName
                : String(req.body.cardName).trim() ||
                existing.cardName,

        scryfallId:
            req.body.scryfallId === undefined
                ? existing.scryfallId
                : req.body.scryfallId ?? null,

        setName:
            req.body.setName === undefined
                ? existing.setName
                : req.body.setName ?? null,

        setCode:
            req.body.setCode === undefined
                ? existing.setCode
                : req.body.setCode ?? null,

        collectorNumber:
            req.body.collectorNumber === undefined
                ? existing.collectorNumber
                : req.body.collectorNumber ?? null,

        imageSmall:
            req.body.imageSmall === undefined
                ? existing.imageSmall
                : req.body.imageSmall ?? null,

        typeLine:
            req.body.typeLine === undefined
                ? existing.typeLine
                : req.body.typeLine ?? null,

        rarity:
            req.body.rarity === undefined
                ? existing.rarity
                : req.body.rarity ?? null,

        manaValue:
            req.body.manaValue === undefined
                ? existing.manaValue
                : req.body.manaValue ?? null,

        colors:
            req.body.colors === undefined
                ? existing.colors
                : req.body.colors ?? null,

        foil:
            req.body.foil === undefined
                ? existing.foil
                : req.body.foil
                    ? 1
                    : 0,

        quantity:
            req.body.quantity === undefined
                ? existing.quantity
                : Math.max(
                    1,
                    Number(req.body.quantity ?? 1)
                ),

        printSpecific:
            req.body.printSpecific === undefined
                ? existing.printSpecific
                : req.body.printSpecific
                    ? 1
                    : 0,
    };

    db.prepare(
        `
        UPDATE user_card_entries
        SET
            card_name = @cardName,
            scryfall_id = @scryfallId,
            set_name = @setName,
            set_code = @setCode,
            collector_number = @collectorNumber,
            image_small = @imageSmall,
            type_line = @typeLine,
            rarity = @rarity,
            mana_value = @manaValue,
            colors = @colors,

            foil = @foil,
            quantity = @quantity,
            print_specific = @printSpecific,

            updated_at = @updatedAt

        WHERE
            id = @entryId
            AND user_id = @userId
        `
    ).run({
        entryId,
        userId,

        ...next,

        updatedAt:
            new Date().toISOString(),
    });

    const row = db
        .prepare(
            `
            ${USER_CARD_SELECT_SQL}

            WHERE id = @entryId

            LIMIT 1
            `
        )
        .get({
            entryId,
        });

    res.json({
        card:
            mapCardEntry(row),
    });
});

router.delete("/:id/cards/:entryId", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const entryId =
        String(req.params.entryId ?? "").trim();

    const result = db
        .prepare(
            `
            DELETE FROM user_card_entries
            WHERE
                id = @entryId
                AND user_id = @userId
            `
        )
        .run({
            entryId,
            userId,
        });

    if (result.changes === 0) {
        return res.status(404).json({
            error:
                "Card entry not found",
        });
    }

    res.json({
        ok: true,
    });
});

function replaceCardsForListType(
    userId: string,
    listType: "collection" | "wishlist",
    cards: any[]
) {
    const now =
        new Date().toISOString();

    const transaction =
        db.transaction(() => {
            db.prepare(
                `
                DELETE FROM user_card_entries
                WHERE
                    user_id = @userId
                    AND list_type = @listType
                `
            ).run({
                userId,
                listType,
            });

            const insert =
                db.prepare(
                    `
                    INSERT INTO user_card_entries (
                        id,
                        user_id,
                        list_type,

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
                        @userId,
                        @listType,

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
                const cardName =
                    String(
                        card.cardName ?? ""
                    ).trim();

                if (!cardName) {
                    continue;
                }

                insert.run(
                    cardPayloadToDbParams(
                        {
                            ...card,
                            cardName,
                        },
                        {
                            id:
                                createId(
                                    "card"
                                ),
                            userId,
                            listType,
                            createdAt:
                                now,
                            updatedAt:
                                now,
                        }
                    )
                );
            }
        });

    transaction();
}

router.post("/:id/cards/replace-collection", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const cards =
        Array.isArray(req.body.cards)
            ? req.body.cards
            : [];

    if (!userId) {
        return res.status(400).json({
            error:
                "Missing user id",
        });
    }

    replaceCardsForListType(
        userId,
        "collection",
        cards
    );

    res.json({
        ok: true,
    });
});

router.post("/:id/cards/replace-wishlist", (req, res) => {
    const userId =
        String(req.params.id ?? "").trim();

    const cards =
        Array.isArray(req.body.cards)
            ? req.body.cards
            : [];

    if (!userId) {
        return res.status(400).json({
            error:
                "Missing user id",
        });
    }

    replaceCardsForListType(
        userId,
        "wishlist",
        cards
    );

    res.json({
        ok: true,
    });
});

export default router;