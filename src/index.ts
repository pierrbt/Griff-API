import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createToken } from "./secrets";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.all("/", (req, res) => {
  res.send("Welcome to the Griff's API");
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
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

  await prisma.user
    .create({
      data: {
        pseudo,
        firstName,
        password: await bcrypt.hash(password, 10),
        email,
        status: "active",
        lastActivity: new Date(),
      },
    })
    .then((user: any) => {
      const token = createToken(user.id);
      console.log(token);
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({
      ok: false,
      message: "Missing parameters : (email, password) required",
    });

  await prisma.user
    .findUnique({
      where: {
        email,
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

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
);
