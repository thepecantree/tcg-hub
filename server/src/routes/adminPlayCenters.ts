import { Router } from "express";

import db from "../db";
import { createId } from "../utils/ids";
import { requireAdmin } from "../utils/auth";

const router = Router();

router.post("/", (req, res) => {
    if (!requireAdmin(req, res)) {
        return;
    }

    const now =
        new Date().toISOString();

    const id =
        createId("play-center");

    db.prepare(
        `
        INSERT INTO play_centers (
            id,
            name,
            description,
            image_url,
            address,
            town,
            state,
            phone,
            website,
            created_at,
            updated_at
        )
        VALUES (
            @id,
            @name,
            @description,
            @imageUrl,
            @address,
            @town,
            @state,
            @phone,
            @website,
            @createdAt,
            @updatedAt
        )
        `
    ).run({
        id,
        name:
            String(req.body.name ?? "").trim(),
        description:
            String(req.body.description ?? "").trim(),
        imageUrl:
            req.body.imageUrl ?? null,
        address:
            req.body.address ?? null,
        town:
            req.body.town ?? null,
        state:
            req.body.state ?? null,
        phone:
            req.body.phone ?? null,
        website:
            req.body.website ?? null,
        createdAt:
            now,
        updatedAt:
            now,
    });

    res.json({
        id,
    });
});

router.patch("/:id", (req, res) => {
    if (!requireAdmin(req, res)) {
        return;
    }

    db.prepare(
        `
        UPDATE play_centers
        SET
            name = @name,
            description = @description,
            image_url = @imageUrl,
            address = @address,
            town = @town,
            state = @state,
            phone = @phone,
            website = @website,
            updated_at = @updatedAt
        WHERE id = @id
        `
    ).run({
        id:
            req.params.id,
        name:
            String(req.body.name ?? "").trim(),
        description:
            String(req.body.description ?? "").trim(),
        imageUrl:
            req.body.imageUrl ?? null,
        address:
            req.body.address ?? null,
        town:
            req.body.town ?? null,
        state:
            req.body.state ?? null,
        phone:
            req.body.phone ?? null,
        website:
            req.body.website ?? null,
        updatedAt:
            new Date().toISOString(),
    });

    res.json({
        ok: true,
    });
});

router.delete("/:id", (req, res) => {
    if (!requireAdmin(req, res)) {
        return;
    }

    db.prepare(
        `
        DELETE FROM play_centers
        WHERE id = @id
        `
    ).run({
        id:
            req.params.id,
    });

    res.json({
        ok: true,
    });
});

export default router;