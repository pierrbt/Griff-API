import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { confirm } from '@inquirer/prompts';
import crypto from "crypto";
import {writeFile} from "fs/promises";

dotenv.config();

let jwtSecret = process.env.TOKEN_SECRET as string;

if (!process.env.TOKEN_SECRET) {
  console.error("[ERROR]: No token secret provided (.env file, TOKEN_SECRET)");
  confirm({
    message: 'Do you want to generate a new token secret or want to do it yourself?',
  }).then(async (answer: boolean) => {
    if(!answer)
      process.exit(1);
    const secret = crypto.randomBytes(128).toString('hex');
    console.log(`Generated secret: ${secret.slice(0, 20)}...`);
    await writeFile('.env', `TOKEN_SECRET=${secret}`);
    console.log('Secret saved to .env file');
    process.env.TOKEN_SECRET = secret;
    jwtSecret = secret;
  })
    .catch((error: any) => {
      console.error(error);
      process.exit(1);
  });
}



export function createToken(id: number): string {
  return jwt.sign(
    {
      id,
    },
    jwtSecret,
    { expiresIn: "5y", issuer: "Griff's API", subject: "auth" },
  );
}

export async function checkAndVerifyToken(
  token: string | undefined,
): Promise<number> {
  try {
    if (!token || typeof token !== "string" || !token.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }

    const cleanedToken = token.slice(7);
    const decoded: any = jwt.verify(cleanedToken, jwtSecret);

    if (decoded && decoded.id && typeof decoded.id === "number") {
      return decoded.id;
    } else {
      throw new Error("Invalid token content");
    }
  } catch (error: any) {
    console.log(`[ERROR] error while verifying token: ${error.message}`);
    return 0;
  }
}
