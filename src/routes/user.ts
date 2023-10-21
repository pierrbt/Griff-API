import { Express } from "express";
import bcrypt from "bcrypt";
import { createToken } from "../tokens";
import { prisma, authToken } from "../middleware";
import {
  createUserObject,
  updateUserObject,
  userIdParameter,
} from "../validators/user.validator";

export default function declareUserRoutes(app: Express) {
  app.get("/user/:id", authToken, async (req, res) => {
    try {
      const parsed = userIdParameter.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid user id",
        };
      }
      const id = parsed.data;
      console.log(id);

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          pseudo: true,
          firstName: true,
          lastActivity: true,
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
        message: "User found",
        user,
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

  app.post("/user", async (req, res) => {
    try {
      const parsed = createUserObject.safeParse(req.body);
      if (!parsed.success) {
        throw {
          status: 400,
          message: parsed.error.message,
        };
      }
      const { pseudo, firstName, email, password } = parsed.data;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          pseudo,
          firstName,
          password: hashedPassword,
          email,
          status: "active",
          lastActivity: new Date(),
        },
      });
      if (!user) {
        throw {
          status: 500,
          message: "Error while creating user",
        };
      }
      const token = createToken(user.id);
      res.status(201).send({
        ok: true,
        message: "User created",
        user: user,
        token: token,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while creating user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.put("/user", authToken, async (req, res) => {
    try {
      const userId = res.locals.userId;
      const parsed = updateUserObject.safeParse(req.body);
      if (!parsed.success) {
        throw {
          status: 400,
          message: parsed.error.message,
        };
      }
      const { pseudo, firstName, password } = parsed.data;
      const dataToUpdate: any = {};

      if (pseudo) {
        dataToUpdate.pseudo = pseudo;
      }
      if (firstName) {
        dataToUpdate.firstName = firstName;
      }
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: dataToUpdate,
      });

      if (!user) {
        throw {
          status: 500,
          message: "Error while updating user",
        };
      }

      res.status(200).send({
        ok: true,
        message: "User updated",
        user: user,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while updating user";
      res.status(status).send({
        ok: false,
        message: message,
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
