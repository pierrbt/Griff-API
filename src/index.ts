import express from "express";
import declareAuthRoutes from "./routes/auth";
import declareUserRoutes from "./routes/user";
import declareGamesRoutes from "./routes/games";
import helmet from "helmet";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

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
