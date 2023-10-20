import {Express} from "express";
import bcrypt from "bcrypt";
import {createToken} from "../tokens";
import {prisma, authToken} from "../middleware";

export default function declareAuthRoutes(app: Express)
{

  app.post("/login", async (req, res) => {
    const { pseudo, password } = req.body;

    if (!pseudo || !password)
      return res.status(400).send({
        ok: false,
        message: "Missing parameters : (email, password) required",
      });

    await prisma.user
      .findUnique({
        where: {
          pseudo,
        },
      })
      .then(async (user: any) => {
        if (!user)
          return res.status(404).send({
            ok: false,
            message: "User not found",
          });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
          return res.status(401).send({
            ok: false,
            message: "Invalid password",
          });

        const token = createToken(user.id);
        console.log(token);
        res.status(200).send({
          ok: true,
          message: "User logged in",
          user: user,
          token: token,
        });
      })
      .catch((err: any) => {
        res.status(500).send({
          ok: false,
          message: "Error while logging in",
          error: err,
        });
      });
  });



  app.post("/user/verify", authToken, async (req, res) => {
    const userId = res.locals.userId;
    return await prisma.user
      .findUnique({
        where: {
          id: userId,
          status: "active",
        },
      })
      .then((user: any) => {
        if (!user)
          return res.status(404).send({
            ok: false,
            message: "User not found",
          });

        return res.status(200).send({
          ok: true,
          message: "User verified",
          user: user,
        });
      })
      .catch((err: any) => {
        return res.status(500).send({
          ok: false,
          message: "Error while verifying user",
          error: err,
        });
      });
  });
}