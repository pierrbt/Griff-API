import jwt from "jsonwebtoken";
import {jwtSecret} from "./utils";

export function createToken(id: number): string {
  return jwt.sign(
    { id },
    jwtSecret,
    { expiresIn: "5y" }
  );
}