import { Express } from "express";
import { authAdmin, prisma } from "../middleware";
import { z } from "zod";

const banUserId = z.coerce.number().positive("User id must be positive").int();
const newPseudo = z
  .string()
  .min(3, "Pseudo must be at least 3 characters long");

export function declareAdminRoutes(app: Express) {
  app.post("/ban/:id", authAdmin, async (req, res) => {
    try {
      const parsed = banUserId.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: "banned",
        },
      });

      res.status(200).send({
        ok: true,
        message: "User banned",
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while banning user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.post("/unban/:id", authAdmin, async (req, res) => {
    try {
      const parsed = banUserId.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          status: "active",
        },
      });

      res.status(200).send({
        ok: true,
        message: "User unbanned",
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while unbanning user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.post("/admin/:id", authAdmin, async (req, res) => {
    try {
      const parsed = banUserId.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          admin: true,
        },
      });

      res.status(200).send({
        ok: true,
        message: "User admin",
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while admining user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.post("/unadmin/:id", authAdmin, async (req, res) => {
    try {
      const parsed = banUserId.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          admin: false,
        },
      });

      res.status(200).send({
        ok: true,
        message: "User unadmin",
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while unadmining user";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });

  app.put("/user/pseudo/:id", authAdmin, async (req, res) => {
    try {
      const parsed = banUserId.safeParse(req.params.id);
      if (!parsed.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed.error.message,
        };
      }

      const id = parsed.data;
      const parsed2 = newPseudo.safeParse(req.body.pseudo);
      if (!parsed2.success) {
        throw {
          status: 400,
          message: "Invalid parameters " + parsed2.error.message,
        };
      }

      const pseudo = parsed2.data;

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          pseudo: pseudo,
        },
      });

      res.status(200).send({
        ok: true,
        message: "User pseudo updated",
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Error while updating user pseudo";
      res.status(status).send({
        ok: false,
        message: message,
      });
    }
  });
}
