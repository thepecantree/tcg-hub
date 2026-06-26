import { Request, Response, NextFunction } from "express";

import {
    ADMIN_USER_IDS,
    getUserIdFromAuthHeader,
} from "../utils/auth";

export function requireAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId =
        getUserIdFromAuthHeader(req);

    if (
        !userId ||
        !ADMIN_USER_IDS.has(userId)
    ) {
        return res.status(403).json({
            error:
                "Admin access required",
        });
    }

    (req as any).userId =
        userId;

    next();
}