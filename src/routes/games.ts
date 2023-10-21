import { Express } from "express";
import { prisma, authToken, authAdmin } from "../middleware";
import {
  gameIdParameter,
  createGameObject,
} from "../validators/games.validator";

export default function declareGamesRoutes(app: Express) {
  app.get("/games", authToken, async (req, res) => {
    try {
      const games = await prisma.game.findMany();
      if (!games) {
        throw {
          status: 404,
          message: "Games not found",
        };
      }
      res.status(200).send({
        ok: true,
        message: "Games found",
        games: games,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while getting games";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.get("/games/:id", authToken, async (req, res) => {
    try {
      const parsed = gameIdParameter.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;

      const game = await prisma.game.findUnique({
        where: {
          id: id,
        },
      });

      if (!game) {
        throw {
          status: 404,
          message: "Game not found",
        };
      }

      res.status(200).send({
        ok: true,
        message: "Game found",
        game: game,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while getting game";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.post("/games", authAdmin, async (req, res) => {
    try {
      const parsed = createGameObject.safeParse(req.body);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }
      const {
        name,
        description,
        verticalIcon,
        background,
        altBackground,
        installPath,
        executable,
        version,
        size,
      } = parsed.data;
      const game = await prisma.game.create({
        data: {
          name: name,
          installPath: installPath,
          executable: executable,
          version: version,
          size: size,
          props: {
            create: {
              name: name,
              description: description,
              verticalIcon: verticalIcon,
              background: background,
              altBackground: altBackground,
            },
          },
        },
      });

      if (!game) {
        throw {
          status: 500,
          message: "Error while creating game",
        };
      }

      res.status(200).send({
        ok: true,
        message: "Game created",
        game: game,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while creating game";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });
}
