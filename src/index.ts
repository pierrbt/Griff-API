// TODO: Start making the games routes

import { PrismaClient } from "@prisma/client";
import express from "express";
import bcrypt from "bcrypt";
import {checkAndVerifyToken, createToken, verifyToken} from "./secrets";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.all("/", (req, res) => {
  res.send("Welcome to the Griff's API");
});
app.get("/user/:id", async (req, res) => {
  const token = req.headers.authorization;
  const authId = await checkAndVerifyToken(token);
  if (!authId) {
    return res.status(401).send({
      ok: false,
      message: "Invalid token",
    });
  }
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
app.put("/user", async (req, res) => {
  // The user can only update his pseudo, firstName and password
  // First check the JWT token sent in Authorization header with Bearer method
  const token = req.headers.authorization;
  const userId = await checkAndVerifyToken(token);
  if (!userId) {
    return res.status(401).send({
      ok: false,
      message: "Invalid token",
    });
  }
  // switch whether the user wants to update his pseudo, firstName or password
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

app.delete("/user", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await checkAndVerifyToken(token);
  if (!userId) {
    return res.status(401).send({
      ok: false,
      message: "Invalid token",
    });
  }

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


app.get("/game/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await checkAndVerifyToken(token);
  if (!userId) {
    return res.status(401).send({
      ok: false,
      message: "Invalid token",
    });
  }

  const { id } = req.params;
  if (!id)
  {
    return res.status(400).send({
      ok: false,
      message: "Missing parameters : (gameId) required",
    });
  }

  const gameId = parseInt(id);
  if(!gameId)
  {
    return res.status(400).send({
      ok: false,
      message: "Invalid gameId",
    });
  }

  await prisma.game.findUnique({
    where: {
      id: gameId,
    }
  })
  .then((game: any) => {
    if(!game)
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
  })

});




const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
);
