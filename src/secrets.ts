import jwt from "jsonwebtoken";
import { jwtSecret } from "./utils";

export function createToken(id: number): string {
  return jwt.sign(
    {
      id,
    },
    jwtSecret,
    { expiresIn: "5y", issuer: "Griff's API", subject: "auth" },
  );
}

export function verifyToken(token: string): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
        if (err) return reject(err);
        if (decoded.id) resolve(decoded.id);
        else reject(0);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

export async function checkAndVerifyToken(
  token: string | undefined,
): Promise<number> {
  if (!token) {
    return 0;
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  } else {
    return 0;
  }

  if (!token) {
    return 0;
  }

  return await verifyToken(token)
    .then((id: number) => {
      return id;
    })
    .catch((err: any) => {
      return 0;
    });
}
