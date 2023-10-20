import {Express} from "express";
import {prisma, authToken} from "../middleware";

export default function declareGamesRoutes(app: Express)
{
  app.get("/game/:id", authToken, async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({
        ok: false,
        message: "Missing parameters : (gameId) required",
      });
    }

    const gameId = parseInt(id);
    if (!gameId) {
      return res.status(400).send({
        ok: false,
        message: "Invalid gameId",
      });
    }

    await prisma.game
      .findUnique({
        where: {
          id: gameId,
        },
      })
      .then((game: any) => {
        if (!game)
          return res.status(404).send({
            ok: false,
            message: "Game not found",
          });
        return res.status(200).send({
          ok: true,
          message: "Game found",
          game: game,
        });
      })
      .catch((err: any) => {
        return res.status(500).send({
          ok: false,
          message: "Error while getting game",
        });
      });
  });
}