import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import deckRoutes from "./routes/decks";
import userCardRoutes from "./routes/userCards";
import cardRoutes from "./routes/cards";
import forumRoutes from "./routes/forum";
import playCenterRoutes from "./routes/playCenters";
import adminPlayCenterRoutes from "./routes/adminPlayCenters";

const app = express();

const PORT = 4000;

app.use(
    cors()
);

app.use(
    express.json({
        limit: "15mb",
    })
);

app.get(
    "/health",
    (_req, res) => {
        res.json({
            ok: true,
            message:
                "TCG Hub server online",
        });
    }
);

app.use(
    "/auth",
    authRoutes
);

app.use(
    "/users",
    userRoutes
);

app.use(
    "/users",
    deckRoutes
);

app.use(
    "/users",
    userCardRoutes
);

app.use(
    "/cards",
    cardRoutes
);

app.use(
    "/forum",
    forumRoutes
);

app.use(
    "/play-centers",
    playCenterRoutes
);

app.use(
    "/admin/play-centers",
    adminPlayCenterRoutes
);

app.use(
    (
        _req,
        res
    ) => {
        res.status(404).json({
            error:
                "Route not found",
        });
    }
);

app.listen(
    PORT,
    () => {
        console.log("");
        console.log(
            "=================================="
        );
        console.log(
            "TCG Hub API Running"
        );
        console.log(
            `http://localhost:${PORT}`
        );
        console.log(
            "=================================="
        );
        console.log("");
    }
);