import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { checkAndVerifyToken } from "./tokens";

export const prisma = new PrismaClient();

export async function authToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;
  const [authId, message] = await checkAndVerifyToken(token);
  if (!authId) {
    return res.status(401).send({
      ok: false,
      message: `Auth failed, ${message}`,
    });
  }

  prisma.user.update({
    where: {
      id: authId,
    },
    data: {
      lastActivity: new Date(),
    }
  })

  res.locals.userId = authId;
  next();
}
