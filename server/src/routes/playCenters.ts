import { Router } from "express";

import db from "../db";
import { mapPlayCenter } from "../mappers/playCenters";

const router = Router();

router.get("/", (_req, res) => {
    const rows = db
        .prepare(
            `
            SELECT
                id,
                name,
                description,
                image_url as imageUrl,
                address,
                town,
                state,
                phone,
                website,
                created_at as createdAt,
                updated_at as updatedAt
            FROM play_centers
            ORDER BY town ASC, name ASC
            `
        )
        .all();

    res.json({
        playCenters:
            rows.map(mapPlayCenter),
    });
});

export default router;