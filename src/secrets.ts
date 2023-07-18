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
    jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
      if (err) return reject(err);
      if (decoded.id) resolve(decoded.id);
      else reject(0);
    });
  });
}
