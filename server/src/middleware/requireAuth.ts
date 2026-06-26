import { Request, Response, NextFunction } from "express";

import {
    getUserIdFromAuthHeader,
} from "../utils/auth";

export function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId =
        getUserIdFromAuthHeader(req);

    if (!userId) {
        return res.status(401).json({
            error: "Authentication required",
        });
    }

    (req as any).userId =
        userId;

    next();
}