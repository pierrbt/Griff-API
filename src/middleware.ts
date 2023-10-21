import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { checkAndVerifyToken } from "./tokens";

export const prisma = new PrismaClient();

export async function updateLastActivity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;
  const [authId, message] = await checkAndVerifyToken(token);
  if (authId) {
    prisma.user.update({
      where: {
        id: authId,
      },
      data: {
        lastActivity: new Date(),
      },
    });
  }
  next();
}

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

  res.locals.userId = authId;
  next();
}

export async function authAdmin(
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

  const user = await prisma.user.findUnique({
    where: {
      id: authId,
      admin: true,
    },
  });

  if (!user) {
    return res.status(401).send({
      ok: false,
      message: `User not found or not admin`,
    });
  }

  res.locals.userId = authId;
  next();
}
