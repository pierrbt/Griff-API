import express, { NextFunction, Request, Response } from "express";
import declareAuthRoutes from "./routes/auth";
import declareUserRoutes from "./routes/user";
import declareGamesRoutes from "./routes/games";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { updateLastActivity } from "./middleware";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(updateLastActivity);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 240,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

console.log(`[INFO] Welcome on the Griff's API`);
console.log(
  `[INFO] You can define a custom port by setting the PORT environment variable`,
);
console.log(
  `[INFO] You can define a custom token secret by setting the TOKEN_SECRET environment variable\n`,
);

declareAuthRoutes(app);
declareUserRoutes(app);
declareGamesRoutes(app);

app.all("/", (req, res) => {
  res.send({
    ok: true,
    message: "Welcome on the Griff's API",
    routes: app._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => r.route.path),
  });
});

app.all("*", (req, res) => {
  res.status(404).send({
    ok: false,
    message: "Route not found",
  });
});

app.listen(port, function () {
  console.log(`[INFO] 🚀 Server is listening on port ${port}`);
});
