import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.TOKEN_SECRET) {
  console.error("ERROR: No token secret provided (.env file, TOKEN_SECRET)");
  process.exit(1);
}

const jwtSecret = process.env.TOKEN_SECRET;

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
