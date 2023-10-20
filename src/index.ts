import express from "express";
import declareAuthRoutes from "./routes/auth";
import declareUserRoutes from "./routes/user";
import declareGamesRoutes from "./routes/games";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 240,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}))

declareAuthRoutes(app);
declareUserRoutes(app);
declareGamesRoutes(app);

app.all("/", (req, res) => {
  res.send("Welcome to the Griff's API");
});

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
);
