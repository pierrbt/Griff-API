import { Express } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../tokens";
import { prisma, authToken } from "../middleware";

export default function declareUserRoutes(app: Express) {
  app.get("/user/:id", authToken, async (req, res) => {
    const { id } = req.params;
    if (!id)
      return res.status(400).send({
        ok: false,
        message: "Missing parameters",
      });

    const userId = parseInt(id);
    if (!userId)
      return res.status(400).send({
        ok: false,
        message: "Invalid parameters",
      });

    await prisma.user
      .findUnique({
        where: {
          id: userId,
        },
        select: {
          pseudo: true,
          firstName: true,
          lastActivity: true,
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
          message: "User found",
          user,
        });
      })
      .catch((err: any) => {
        res.status(500).send({
          ok: false,
          message: "Error while getting user",
          error: err,
        });
      });
  });

  app.post("/user", async (req, res) => {
    const { pseudo, firstName, email, password } = req.body;

    if (!pseudo || !firstName || !email || !password)
      return res.status(400).send({
        ok: false,
        message:
          "Missing parameters : (pseudo, firstName, email, password) required",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    await prisma.user
      .create({
        data: {
          pseudo,
          firstName,
          password: hashedPassword,
          email,
          status: "active",
          lastActivity: new Date(),
        },
      })
      .then((user: any) => {
        const token = createToken(user.id);
        res.status(201).send({
          ok: true,
          message: "User created",
          user: user,
          token: token,
        });
      })
      .catch((err: any) => {
        res.status(500).send({
          ok: false,
          message: "Error while creating user",
          error: err,
        });
      });
  });

  app.put("/user", authToken, async (req, res) => {
    const userId = res.locals.userId;
    const { pseudo, firstName, password } = req.body;
    if (!pseudo && !firstName && !password)
      return res.status(400).send({
        ok: false,
        message: "Missing parameters : (pseudo, firstName, password) required",
      });

    if (pseudo) {
      await prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            pseudo,
          },
        })
        .then((user: any) => {
          res.status(200).send({
            ok: true,
            message: "User updated",
            user: user,
          });
        })
        .catch((err: any) => {
          res.status(500).send({
            ok: false,
            message: "Error while updating user",
            error: err,
          });
        });
    } else if (firstName) {
      await prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            firstName,
          },
        })
        .then((user: any) => {
          res.status(200).send({
            ok: true,
            message: "User updated",
            user: user,
          });
        })
        .catch((err: any) => {
          res.status(500).send({
            ok: false,
            message: "Error while updating user",
            error: err,
          });
        });
    } else if (password) {
      await prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            password: await bcrypt.hash(password, 10),
          },
        })
        .then((user: any) => {
          res.status(200).send({
            ok: true,
            message: "User updated",
            user: user,
          });
        })
        .catch((err: any) => {
          res.status(500).send({
            ok: false,
            message: "Error while updating user",
            error: err,
          });
        });
    } else {
      return res.status(400).send({
        ok: false,
        message: "Missing parameters : (pseudo, firstName, password) required",
      });
    }
  });

  app.delete("/user", authToken, async (req, res) => {
    const userId = res.locals.userId;

    await prisma.user
      .delete({
        where: {
          id: userId,
        },
      })
      .then(() => {
        res.status(200).send({
          ok: true,
          message: "User deleted",
        });
      })
      .catch((err: any) => {
        res.status(500).send({
          ok: false,
          message: "Error while deleting user",
          error: err,
        });
      });
  });
}
