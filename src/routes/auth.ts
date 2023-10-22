import { Express } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../tokens";
import { prisma, authUser } from "../middleware";
import { z } from "zod";

const loginUserObject = z.object({
  pseudo: z.string().min(3, "Pseudo must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function declareAuthRoutes(app: Express) {
  app.post("/login", async (req, res) => {
    try {
      const parsed = loginUserObject.safeParse(req.body);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const { pseudo, password } = parsed.data;

      const user = await prisma.user.findUnique({
        where: {
          pseudo,
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw {
          status: 401,
          message: "Incorrect username or password",
        };
      }
      const token = createToken(user.id);
      res.status(200).send({
        ok: true,
        message: "User logged in",
        user: user,
        token: token,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while getting user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.post("/token", authUser, async (req, res) => {
    try {
      const userId = res.locals.userId;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          status: "active",
        },
        select: {
          password: false,
        },
      });

      if (!user) {
        throw {
          status: 404,
          message: "User not found",
        };
      }

      res.status(200).send({
        ok: true,
        message: "User verified",
        user: user,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while getting user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });
}
